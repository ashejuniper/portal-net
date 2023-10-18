#!/usr/bin/env bash

# Rename executables.
mv dist/$1-linux    dist/$1-$2-linux-x64
mv dist/$1-macos    dist/$1-$2-macos-x64
mv dist/$1-win.exe  dist/$1-$2-win32-x64.exe
