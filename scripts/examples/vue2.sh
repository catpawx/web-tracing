#!/usr/bin/env sh

set -e

# 进入生成的文件夹
cd examples-copy/vue2

git init
git add -A
git commit -m 'deploy'

git push -f git@github.com:catpawx/web-tracing-examples-vue2.git main

cd -