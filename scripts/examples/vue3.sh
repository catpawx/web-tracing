#!/usr/bin/env sh

set -e

# 进入生成的文件夹
cd examples-copy/vue3

git init
git add -A
git commit -m 'deploy'

git push -f git@github.com:catpawx/web-tracing-examples-vue3.git main

cd -