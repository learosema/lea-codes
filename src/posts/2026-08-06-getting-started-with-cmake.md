---
title: Getting started with CMake
date: 2026-08-06
tags:
  - c++
  - build-system
  - package-management
---
Usually, I'm a web developer with a focus on web standards and accessibility, 
but from time to time I write C++ or even C code.

It's what I grew up with and still enjoy.
Yet, going beyond small programs is often where I struggle. 

How do I build a project with more than one file? How do I manage dependencies?
How does cross-platform development work? There are differences between Windows
and UNIX-like environments. Also, different compilers use different project formats.

That's where CMake comes into play.

## Build systems

Before getting to CMake, it's worth being clear about what a build system actually does:

- it turns your source files into an executable (or library).
- it invokes the compiler and linker in the right order
- it only rebuilds what actually changes.
  This matters once the project gets bigger.

A few common ones:

- Make, driven by Makefiles, the classic unix tool
- Ninja, a newer and faster alternative to Make
- MSBuild, what Visual Studio projects use
- Xcode, for Apple platforms

Each of these has its own file format and its own quirks. If you wanted one project to build with Make on Linux, MSBuild on
Windows and Xcode on macOS, you'd have to hand-maintain three completely different sets of build files.

## CMake

As I said, CMake tries to solve this problem. It doesn't build the project itself, 
it generates the makefiles for you. This way, you can make your project work with many
different compilers.

A lot of C/C++ open source projects use it, and I think it has become a de-facto standard for open-source libraries.

Also, CMake is a Turing-complete language itself, and it comes with if/then/else, variables, functions and all
those things. Though, that's not necessarily an advantage. It makes it pretty powerful, but it also makes it a 
rabbit hole and you happen to debug your CMakeLists.txt from time to time.

There are other generators such as Meson, which is simpler and whose slogan is "non-Turing-complete". 
But I haven't tried it yet. Fun fact aside: CMake even comes with a Meson generator.

## CMake HelloWorld

CMake is configured via a text-file named `CMakeLists.txt`.

A minimal CMake:

```cmake
cmake_minimum_required(VERSION 3.24)
project(MyProject)
set(CMAKE_CXX_STANDARD 17)

add_executable(HelloWorld hello.cpp main.cpp)
```

To actually build it, you configure and build in two steps:

```sh
cmake -B build
cmake --build build
```

The first command generates the build files (a Makefile, a Ninja file, or a Visual Studio
solution, depending on your toolchain) into a `build` folder. The second one invokes that
underlying build tool for you, so you don't need to remember whether it's `make`, `ninja`
or something else.

### CMakePresets.json

Configuring `cmake` by passing parameters on the command line works fine for small projects, but that command
line grows fast, and grows differently on every platform. 

`CMakePresets.json` lets you name a configuration once and share it via a file
that lives next to your `CMakeLists.txt`, instead of everyone pasting their own `cmake -B
build -G Ninja -DCMAKE_BUILD_TYPE=Debug ...` into a README.

```json
{
  "version": 6,
  "configurePresets": [
    {
      "name": "default",
      "generator": "Ninja",
      "binaryDir": "${sourceDir}/build",
      "cacheVariables": {
        "CMAKE_BUILD_TYPE": "Debug"
      }
    }
  ]
}
```

With that in place, `cmake --preset default` and `cmake --build --preset default` replace
the manual flags, and everyone (and every CI job) configures the project the same way. See
the [CMakePresets.json reference](https://cmake.org/cmake/help/latest/manual/cmake-presets.7.html)
for the full schema, and Martin Fieber's [CMake Presets](https://martin-fieber.de/blog/cmake-presets/)
post linked below for a more hands-on walkthrough.

## Multiple folders

A common pattern is to organize your files in separate folders. In CMake, 
every folder gets its own `CMakeLists.txt`.

Then, you refer to the subdirectory like this: `add_subdirectory(src)`.

Say you have a small library living in `src/`. Its `CMakeLists.txt` could look like this:

```cmake
# src/CMakeLists.txt
add_library(mylib mylib.cpp)
target_include_directories(mylib PUBLIC ${CMAKE_CURRENT_SOURCE_DIR})
```

And in your top-level `CMakeLists.txt`, you pull it in and link it against your executable:

```cmake
add_subdirectory(src)

add_executable(HelloWorld main.cpp)
target_link_libraries(HelloWorld PRIVATE mylib)
```

`target_link_libraries` is how CMake wires targets together. It's the modern, target-based
way of doing things, and it beats sprinkling global `include_directories()` or
`link_directories()` calls across your project, since the dependency stays scoped to just
the targets that actually need it. `PRIVATE` means `mylib` is only used internally by
`HelloWorld`; use `PUBLIC` instead if something that links against `HelloWorld` also needs
to see `mylib`'s headers.

## Managing dependencies

Dependency management in C++ was always something I found pretty hard.

You have a couple of options:

- have the package installed in your system and hope your compiler finds it (this works best for unix-style OSes)
- include the package via git submodule
- download the packages (needs a decent internet connection)

### Finding the package on the system

CMake provides a `find_package()` command to make a system-installed package available to your project.

```cmake
find_package(SDL3)
```

When the package is not available, CMake stops here.
You can tell CMake where to look, via the `CMAKE_PREFIX_PATH` environment variable.

### git Submodules

```sh
git submodule add <url>

# pull
git pull --recurse-submodules

# clone
git clone --recurse-submodules <url>
```

They pin an exact commit, keep the dependency inside your own repo history, and work offline
once cloned. But every contributor has to remember `--recurse-submodules`, and forgetting it
is a classic source of "why is this header missing" confusion. I found them pretty cumbersome
to use.

### Downloading the packages

For the third option (download the library), CMake provides `FetchContent`. It is kind of a package downloading tool,
and it's not to be confused with actual C++ package managers like vcpkg or Conan. `FetchContent` just pulls source
from git and builds it alongside your project. It works like this:

```cmake
include(FetchContent)

FetchContent_Declare(
  fmt
  GIT_REPOSITORY "https://github.com/fmtlib/fmt.git"
  GIT_TAG 12.1.0
)

FetchContent_Declare(
  SDL3
  GIT_REPOSITORY "https://github.com/libsdl-org/SDL.git"
  GIT_TAG release-3.4.4
  FIND_PACKAGE_ARGS CONFIG GLOBAL
)

FetchContent_Declare(
  googletest
  GIT_REPOSITORY https://github.com/google/googletest.git
  GIT_TAG        703bd9caab50b139428cea1aaff9974ebee5742e # release-1.10.0
  FIND_PACKAGE_ARGS NAMES GTest GLOBAL
)

FetchContent_MakeAvailable(fmt SDL3 googletest)

add_executable(HelloWorld main.cpp)
target_link_libraries(HelloWorld PRIVATE fmt::fmt SDL3::SDL3)
```

Once `FetchContent_MakeAvailable` has run, the fetched targets behave just like anything
found via `find_package`.
It adds the library and include path to the project. You can link them via `target_link_libraries`, as usual.

But having to download a package from git is not cool when you have poor internet connectivity.
The `find_package` command is better in that case.

Since version 3.24, CMake integrated `find_package` into FetchContent via `FIND_PACKAGE_ARGS`. 
This way, it first looks if a package is installed in the system. If yes, it uses that. 
Otherwise, it downloads the repository and builds it from source.

After having worked a bit with the FetchContent method, I prefer to use the prebuilt
files. It takes quite a bit to compile SDL3 and SDL3_Image.

### `FIND_PACKAGE_ARGS` Parameters

The `NAMES` parameter is required when the official package name differs from what you provided as name in `FetchContent_Declare`. 
`CONFIG` tells it to look for a configuration CMake file (eg. `SDL3Config.cmake`).

`GLOBAL` makes the dependency available inside the whole project. This was added, because it's common to have the dependencies inside a vendor directory; so this flag makes it visible from outside the subdirectory. 

## CMake resources

CMake is cool, but it took me some time to understand it. 
In this blog article, I scratched the surface. I haven't even touched CTest or CPack, 
CMake's built-in tools for testing and packaging. Maybe a topic for a future post.

A good place to start is the official CMake website. It contains a tutorial to get you started.
Another resource that was particularly helpful was the blog by [Martin Fieber](https://martin-fieber.de), 
who provides very good in-depth articles covering CMake. 

Martin also provides application starters on [GitHub](https://github.com/MartinHelmut/), where he integrates
libraries like SDL, Dear ImGui and fmt. It is far more complete than this introductory article, as it contains
testing, app icon design starters, packaging and building installers. The projects are super nicely documented. 

If you want to go deeper, [Sinem Akinci](https://devblogs.microsoft.com/cppblog/author/sinemakinci/) writes
the CMake Tools extension release notes on the Microsoft C++ blog, which is where Presets support in VS Code
actually gets documented as it evolves. And [Nicole Mazzuca](https://www.kdab.com/why-we-love-and-hate-cmake-video/)'s
talk "Why We Love and Hate CMake" is a good watch for where CMake's rough edges are heading. She's also
behind [Rho](https://github.com/remarkable/rho-oss), a library that tries to make CMakeLists.txt files
less painful to write.

I haven't had a look at Rho yet, but really long for writing less CMake boilerplate.
So this is what I'm eager to try.

- [CMake website](https://cmake.org)
- [CMake: Using dependencies](https://cmake.org/cmake/help/latest/guide/using-dependencies/index.html)
- [My personal learn-sdl repo where I experiment with CMake](https://github.com/learosema/learn-sdl)
- [Martin Fieber: CMake & CPack for cross-platform distributables](https://martin-fieber.de/blog/cmake-cpack-cross-platform-distributables/)
- [Martin Fieber: Basic C++ setup with dependency management in CMake](https://martin-fieber.de/blog/basic-cpp-setup-with-dependency-management/)
- [Martin Fieber: CMake Presets](https://martin-fieber.de/blog/cmake-presets/)
- [Sinem Akinci: Visual Studio Code CMake Tools Extension 1.21 Release (CMake Presets v10 and more)](https://devblogs.microsoft.com/cppblog/visual-studio-code-cmake-tools-extension-1-21-release-multi-root-improvements-cmake-presets-v10-and-more/)
- [Nicole Mazzuca: Why We Love and Hate CMake](https://www.kdab.com/why-we-love-and-hate-cmake-video/)
