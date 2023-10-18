#!/usr/bin/env bash

# Zip executables for distribution.
zip -9 dist/$1-$2-linux-x64.zip dist/$1-$2-linux-x64
zip -9 dist/$1-$2-macos-x64.zip dist/$1-$2-macos-x64
zip -9 dist/$1-$2-win32-x64.zip dist/$1-$2-win32-x64.exe
