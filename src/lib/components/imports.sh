#!/bin/bash

# Create a list of all files in the current directory
files=(*)

# Create an associative array to store dependencies
declare -A imports

# Loop through each file
for file in "${files[@]}"; do
	# Check if it is a regular file
	[[ -f "$file" ]] || continue

	# Extract imported filenames matching the pattern and check if the file exists
	matches=()
	while IFS= read -r line; do
		if [[ $line =~ import.*\'./(.+)\'\; ]]; then
			imported="${BASH_REMATCH[1]}"
			# Check if the imported file exists in the current directory
			[[ -f "$imported" ]] && matches+=(" $imported")
		fi
	done <"$file"

	# Store results
	if [[ ${#matches[@]} -gt 0 ]]; then
		imports["$file"]=$(
			IFS=,
			echo "${matches[*]}"
		)
	fi
done

# Print output
for file in "${!imports[@]}"; do
	echo "$file:${imports[$file]}"
done
