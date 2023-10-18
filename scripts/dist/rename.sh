#!/usr/bin/env bash

# Rename executables.
mv dist/bin/$1-linux    dist/bin/$1-$2-linux-x64
mv dist/bin/$1-macos    dist/bin/$1-$2-macos-x64
mv dist/bin/$1-win.exe  dist/bin/$1-$2-win32-x64.exe
