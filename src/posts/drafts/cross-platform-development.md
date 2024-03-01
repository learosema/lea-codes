---
title: Cross platform development 101
tags:
 - c/c++
 - build-tools
 - cross-platform development
---
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

Makefiles come to the rescue. You can define several build steps in a Makefile.
The syntax of a Makefile is as follow:

```sh
hello:
  echo Hello Lea!

compile:
  touch output.txt

clean:
  rm output.txt
```

When running `make`, you can see `echo Hello Lea!` is run.  By default, only the first step is run.

The Makefile above has also an additional build step `compile` to generate some kind of output (in this case, a 0-byte file named `output.txt` is generated).

Another common build step is one for cleaning up: `make clean` cleans up the folder, so you can create a clean build afterwards.

In-depth tutorial on Makefiles: <https://opensource.com/article/18/8/what-how-makefile>

### A Makefile for Watcom C

```txt
obj = hello.obj
bin = hello.exe

CC = wcc
CFLAGS = -zq
LD = wlink

$(bin): $(obj)
        $(LD) name $(bin) file { $(obj) }

.c.obj:
        $(CC) -fo=$@ $(CFLAGS) $<

clean: .symbolic
        del *.obj
        del $(bin)
```

When building with OpenWatcom C and MS-DOS, there are also differences in the Makefile. For example, `del` is used to delete files in DOS while `rm` is used to delete file in a UNIX-like OS. Also, the command line interface is different.

## OWCC to the rescue

OpenWatcom v2 comes with `owcc` which has a command-line interface which is compatible to `gcc`.

## GNU autotools

GNU systems such with GNU/Linux or Mingw come with build tools which can create platform

In depth resources:

- [Tutorial](https://opensource.com/article/19/7/introduction-gnu-autotools)
- [GNU autoconf](https://www.gnu.org/savannah-checkouts/gnu/autoconf/manual/autoconf-2.72/autoconf.html)
