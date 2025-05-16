---
title: My Retro coding journey
date: 2025-05-17
description: I'm a newbie when it comes to retrocoding in C for DOS, and it's been quite a ride so far.
tags:
  - retrocoding
  - dos
  - fun
---
I'm a newbie when it comes to retrocoding in C for DOS, and it's been quite a ride so far.

It took me two weeks to debug a problem with my font-loading function, and it turned out I simply wasn't allocating enough memory. The culprit? My DPMI allocation function. I need to convert the memory size to paragraphs (1 paragraph = 16 bytes), but I accidentally divided by 16 twice. Facepalm.

To be fair, the two weeks is partly because I don't do DOS development full-time. That wouldn't pay my bills.

## Want Some Retro Trivia?

Ever heard of DPMI? Wondering why I needed my own memory allocation function? Let's dig in.

## What is DPMI?

DPMI stands for DOS Protected Mode Interface. It allows you to write 32-bit applications for DOS while still accessing BIOS functions. Pretty wild, huh? BIOS (Basic Input/Output System) is the low-level system that helps your machine boot up. On modern systems, BIOS has been mostly replaced by UEFI, but back in the day, it was the gatekeeper for hardware control.

## Why Do We Need DPMI for Memory Allocation?

Here's the deal: all the BIOS stuff lives in the lower memory block, the first 640KB of RAM. My C program, which is a 32-bit application, is loaded into the upper memory block. But there's a catch: BIOS is still 16-bit. If I want it to read or write to memory, it can only access that lower chunk of RAM.

This is where DPMI steps in. Normal malloc() from C won't cut it here—I need to allocate memory in the lower block and create a descriptor. Think of it as a bridge that lets my 32-bit code talk to 16-bit BIOS routines.

```c
// Data structure holding my DOS lower memory block
typedef struct dos_block_s {
    uint16_t segment;   // Real mode segment for ES
    uint16_t selector;  // Protected mode selector for direct access
} dos_block_t;

#if defined __DOS__ && defined __386__

dos_block_t dpmi_alloc_dos_block(uint32_t size)
{
    dos_block_t dblk = {0, 0};
    union REGS regs;

    regs.x.eax = 0x0100; // DPMI function: Allocate DOS memory block
    regs.x.ebx = (size + 15) >> 4; // convert to paragraphs (1 paragraph = 16 bytes)

    int386(0x31, &regs, &regs);

    if (regs.x.cflag)
        return dblk; // Failure, return {0, 0}

    dblk.segment = regs.w.ax;
    dblk.selector = regs.w.dx;
    return dblk;
}
```

## Why Go Through All This Trouble?

For fonts! I wanted to use a custom font for my text-mode application. I designed a sans-serif 8x8 raster font, which really changes the look and feel of the classic DOS screen.

The cool part: text-mode graphics and raster fonts are still a huge deal in the indie gamedev scene. There's something incredibly satisfying about pushing chunky pixels directly and seeing the result instantly on the screen.

## What's the big picture?

The big picture is to build a basic music application in textmode that runs everywhere, using the old OPL2 chip that was used in Ad Lib and soundblaster
cards.

Why? Because my elder brother built a music application in the 90s
in Pascal. It had MIDI support and everything!

He has always been a role model to me.

Why DOS? It's easier to start with DOS for me. It's a limiting choice. But this way, I won't feel overwhelmed by the drive to build it for Windows, Linux, Mac and the Web simultaneously. Maybe just to get a foot in the door about non-web UI development. Or, to keep it short: for fun.

The code for it is still in an early stage. I'm putting together puzzle pieces here:

- <https://github.com/learosema/muzimake/>
- The special font loading experiment I talked about: <https://github.com/learosema/muzimake/blob/main/tests/test_fnt.cpp>

## Wrapping Up

This journey into DPMI and custom fonts has been a massive learning experience. It might not be the smoothest path, but debugging this low-level stuff really makes you appreciate the magic of modern OS memory handling.

Next on my list? Building a proper text-mode UI for my application. Let's see how deep this rabbit hole goes...
