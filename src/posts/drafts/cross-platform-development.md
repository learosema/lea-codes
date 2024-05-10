---
title: Cross platform development 101
tags:
 - c/c++
 - build-tools
 - cross-platform development
---
This is random gibberish written together. I have to sort things :)

One thing I love about the web platform is that its cross-platform compatibility. Many (most) common operating system comes with a browser preinstalled. You can take a piece of HTML, CSS and JavaScript and it will work (mostly) everywhere.

How does it work?

You can create a program and compile it everywhere. Take this helloworld.c for example:

```c
#include <stdio.h>

int main(int argc, char *argv[]) {
  printf("Hello World!\n");
  return 0;
}
```

This program will compile on pretty much every platform where standard C is available.
The build step may differ a bit from platform to platform:

```sh
# On GNU systems such as GNU/Linux or MINGW (Minimalist GNU for Windows):
gcc -o hello helloworld.c

# On a Mac:
clang -o hello helloworld.c

# On FreeDOS or DOSBox, using OpenWatcom 2.0:
wcc helloworld.c
wlink name hello.exe file { hello.obj }

# On FreeDOS or DOSBox, using DJGPP:
djgpp -o hello.exe helloworld.c
```

As you can already see, the build process slightly different from platform to platform. But things can be automated. The gcc command will also work on a mac as it is linked to clang. Also, the clang compiler command line interface is compatible with gcc.

## Makefiles

As projects grow larger and pull in multiple dependencies, the build process can get more complex.

This is where Makefiles come in. You can define several steps for building a project there.

```sh
.PHONY: hello cleab

hello:
  echo Hello Lea!

output.o:
  gcc output.c

clean:
  rm output.txt
```

When running `make`, you can see `echo Hello Lea!` is run.  By default, only the first step is run.

The Makefile above has also an additional build step `compile` to generate some kind of output (in this case, a 0-byte file named `output.txt` is generated).

Another common build step is one for cleaning up: `make clean` cleans up the folder, so you can create a clean build afterwards.

In-depth tutorial on Makefiles: <https://opensource.com/article/18/8/what-how-makefile>

## A common unix-like Makefile

```txt
# Usage:
# make        # compile all binary
# make clean  # remove ALL binaries and objects

.PHONY = all clean postbuild

CC = owcc

LINKERFLAG = -lm

SRCS := $(wildcard *.c)
BINS := $(SRCS:%.c=%)

all: ${BINS}

postbuild:
  @echo "Post build steps.."

%: %.o
  @echo "Checking.."
  ${CC} ${LINKERFLAG} $< -o $@

%.o: %.c
  @echo "Creating object.."
  ${CC} ${CFLAGS} -c $<

clean:
  @echo "Cleaning up..."
  rm -rvf *.o ${BINS}
```

- `PHONY` targets: all build targets that aren't files, can be used for additional build steps, such as `clean` or `postbuild` 
- `%`: wildcard
- `$@`,  `$<`, no idea yet, but used for inserting that above wildcard.

https://stackoverflow.com/a/37701195/388201

## Other formats?

Yes, there are a bunch of other formats. For Example

- Visual Studio Project Files
- Watcom WMake
- XCode
- Ninja (used by Chromium)

How do we overcome all these different formats?

## CMake to the rescue

CMake is a tool which can generate Makefiles in different formats in a way that it fits to your build environment.

See <https://cmake.org/cmake/help/book/mastering-cmake/chapter/Why%20CMake.html>

- Advantages: it works without having a bunch of unix tools installed (autoconf, m4, perl).
- It can look for packages preinstalled on the system via `find_package`
- It has a FetchContent extension, which can make it work a bit like `npm install`, where you can download and build dependencies for your project.

```txt
cmake_minimum_required(VERSION 3.28 FATAL_ERROR)
project(fmttest LANGUAGES CXX)

# add compilation flags
set(CMAKE_CXX_STANDARD 20)
# add_definitions(-DDATA_PATH="${PROJECT_SOURCE_DIR}/data")

include(FetchContent)

# download the project to be made part of the build
# note: SOURCE_DIR and a local path to a project can be used instead
# of GIT_REPOSITORY - this is very useful for local iterative development
# if you are working on the libary and application together
FetchContent_Declare(
    fmtlib
    GIT_REPOSITORY https://github.com/fmtlib/fmt.git
    GIT_TAG 10.2.1
)
# utility to setup the downloaded library for use
FetchContent_MakeAvailable(fmtlib)

# define targets
add_executable(fmttest fmttest.cc)
target_link_libraries(fmttest PRIVATE fmt::fmt)
```

See also the [full guide on dependencies in CMake](https://cmake.org/cmake/help/latest/guide/using-dependencies/index.html).


### Creating a WMAKE Makefile

```sh
cmake -G "Watcom WMake" -D CMAKE_SYSTEM_NAME=DOS
```

## GNU autotools

GNU systems such with GNU/Linux or Mingw come with build tools which can create platform. This is very common in the GNU/Linux ecosystem.

The process for building an autotools project is always like this:

```sh
configure
make
make install
```

The configure script runs a couple of tests and sets compiler definitions accordingly; this way it can be made compatible to different operating systems like Linux, BSD or Windows.

In depth resources:

- [Tutorial](https://opensource.com/article/19/7/introduction-gnu-autotools)
- [GNU autoconf](https://www.gnu.org/savannah-checkouts/gnu/autoconf/manual/autoconf-2.72/autoconf.html)
