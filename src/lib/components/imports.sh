#!/bin/bash

# ANSI color codes
colors=(
	"\033[0;31m" # Red
	"\033[0;32m" # Green
	"\033[0;33m" # Yellow
	"\033[0;34m" # Blue
	"\033[0;35m" # Magenta
	"\033[0;36m" # Cyan
	"\033[1;31m" # Light Red
	"\033[1;32m" # Light Green
	"\033[1;33m" # Light Yellow
	"\033[1;34m" # Light Blue
)

reset="\033[0m"

# Create a list of all files in the current directory
files=(*.svelte)

# Create associative arrays
declare -A imports
declare -A color_map

# Assign a unique color to each filename
color_index=0
for file in "${files[@]}"; do
	if [[ -f "$file" && -z "${color_map[$file]}" ]]; then
		color_map["$file"]="${colors[$((color_index % ${#colors[@]}))]}"
		((color_index++))
	fi
done

# Loop through each file
for file in "${files[@]}"; do
	[[ -f "$file" ]] || continue

	matches=()
	while IFS= read -r line; do
		if [[ $line =~ import.*\'./(.+)\'\; ]]; then
			imported="${BASH_REMATCH[1]}"
			[[ -f "$imported" ]] && matches+=("$imported")
		fi
	done <"$file"

	if [[ ${#matches[@]} -gt 0 ]]; then
		imports["$file"]="${matches[*]}"
	else
		imports["$file"]="NONE"
	fi
done

# Print output with colorized filenames
for file in "${!imports[@]}"; do
	color_file="${color_map[$file]}$file$reset"
	if [[ ${imports[$file]} == "NONE" ]]; then
		echo -e "$color_file: NONE"
	else
		color_imports=""
		for imported in ${imports[$file]}; do
			color_imports+="${color_map[$imported]}$imported$reset "
		done
		echo -e "$color_file: ${color_imports}"
	fi
done
