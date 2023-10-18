#!/usr/bin/env bash

{
    pnpm build || npm build
} && {
    scripts/dist/zip.sh $1 $2
}
