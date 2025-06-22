#!/bin/bash

cd $(dirname "$0")

for file in *.typ; do
	if [[ -f "$file" ]]; then
		echo "Compiling $file"
		typst compile "$file"
	fi
done
