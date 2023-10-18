#!/usr/bin/env bash

rm -rf dist/release/

# Zip executables for distribution.
zip -9 dist/release/$1-$2-linux-x64.zip dist/bin/$1-$2-linux-x64
zip -9 dist/release/$1-$2-macos-x64.zip dist/bin/$1-$2-macos-x64
zip -9 dist/release/$1-$2-win32-x64.zip dist/bin/$1-$2-win32-x64.exe
