---
title: Getting started with CMake
date: 2026-08-06
tags:
  - c++
  - build-system
  - package-management
---
**TL;DR:** CMake isn't a build system, it's a build system *generator*. You describe your
project once in a `CMakeLists.txt`, and it generates Makefiles, Ninja files, or a Visual
Studio solution for you. This post covers the basics: a minimal `CMakeLists.txt`, wiring up
multi-folder projects with `target_link_libraries`, and the three ways to pull in
dependencies (`find_package`, git submodules, `FetchContent`).

Usually, I'm a web developer with a focus on web standards and accessibility, but from time to time I return to my roots in C/C++.

It's what I grew up with, and I still enjoy coding in C, C++ or a combination of both.

Going beyond HelloWorld in C/C++ is where it gets hard. How do you build a project with more
than one file, manage dependencies, and keep it cross-platform? I've used Visual Studio and
free software like gcc and MinGW over the years, and every one of them handled multi-file
projects differently.

Even "standard" unix-style Makefiles aren't that standard. Some include platform-specific shell commands.

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

That's where CMake comes into play.

I picked CMake for my own projects because it seems to
be the one that most C/C++ projects converge on nowadays. 

A lot of C/C++ open source projects
use it, and I think it has become a de-facto standard for open-source libraries.

Also, CMake is a Turing-complete language itself, and it comes with if/then/else, variables, functions and all
those things. That makes it a rabbit hole and you happen to debug your CMakeLists.txt from time to time.

There are other generators such as Meson, which is simpler and whose slogan is "non-Turing-complete". 
I haven't tried it yet.

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
and it's not to be confused with actual C++ package managers like vcpkg or Conan — `FetchContent` just pulls source
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
  FIND_PACKAGE_ARGS CONFIG
)

FetchContent_Declare(
  googletest
  GIT_REPOSITORY https://github.com/google/googletest.git
  GIT_TAG        703bd9caab50b139428cea1aaff9974ebee5742e # release-1.10.0
  FIND_PACKAGE_ARGS NAMES GTest
)

FetchContent_MakeAvailable(fmt SDL3 googletest)

add_executable(HelloWorld main.cpp)
target_link_libraries(HelloWorld PRIVATE fmt::fmt SDL3::SDL3)
```

Once `FetchContent_MakeAvailable` has run, the fetched targets behave just like anything
found via `find_package` — link them the same way with `target_link_libraries`.

But having to download a package from git is not cool when you have poor internet connectivity.
The `find_package` command is better in that case.

Since version 3.24, CMake integrated `find_package` into FetchContent via `FIND_PACKAGE_ARGS`. The NAMES parameter is required when 
the official package name differs from what you provided as name in `FetchContent_Declare`. `CONFIG` tells it to look for a configuration
CMake file (eg. `SDL3Config.cmake`).

None of these three approaches is strictly "the right one" — which you reach for depends on
how your users will build the project, and how reliable their internet connection is. I tend
to start with `find_package`, and fall back to `FetchContent` for anything that isn't
packaged for the platform I'm targeting.

## CMake resources

CMake is cool, but it took me some time to understand it. 
In this blog article, I scratched the surface — I haven't even touched CTest or CPack, 
CMake's built-in tools for testing and packaging. Maybe a topic for a future post.

A good place to start is the official CMake website. It contains a tutorial to get you started.
Another resource that was particularly helpful was the blog by [Martin Fieber](https://martin-fieber.de), 
who provides very good in-depth articles covering CMake. Martin also provides application starters on the GitHub repository.

If you want to go deeper, [Sinem Akinci](https://devblogs.microsoft.com/cppblog/author/sinemakinci/) writes
the CMake Tools extension release notes on the Microsoft C++ blog, which is where Presets support in VS Code
actually gets documented as it evolves. And [Nicole Mazzuca](https://www.kdab.com/why-we-love-and-hate-cmake-video/)'s
talk "Why We Love and Hate CMake" is a good watch for where CMake's rough edges are heading — she's also
behind [Rho](https://github.com/remarkable/rho-oss), a library that tries to make CMakeLists.txt files
less painful to write.

- [CMake website](https://cmake.org)
- [Martin Fieber: CMake & CPack for cross-platform distributables](https://martin-fieber.de/blog/cmake-cpack-cross-platform-distributables/)
- [Martin Fieber: Basic C++ setup with dependency management in CMake](https://martin-fieber.de/blog/basic-cpp-setup-with-dependency-management/)
- [Martin Fieber: CMake Presets](https://martin-fieber.de/blog/cmake-presets/)
- [Sinem Akinci: Visual Studio Code CMake Tools Extension 1.21 Release (CMake Presets v10 and more)](https://devblogs.microsoft.com/cppblog/visual-studio-code-cmake-tools-extension-1-21-release-multi-root-improvements-cmake-presets-v10-and-more/)
- [Nicole Mazzuca: Why We Love and Hate CMake](https://www.kdab.com/why-we-love-and-hate-cmake-video/)
