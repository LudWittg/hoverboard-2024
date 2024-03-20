#!/bin/bash

# Thank you Mr. GPT-4 :D

# Colors
original_color='#34a853'  
new_color='#c62828'

for file in *.png; do
    output_file="${file}"
    convert "$file" -fuzz "50%" -fill "$new_color" -opaque "$original_color" "$output_file" 
    echo "[info] :: Processed $file -> $output_file"
done

echo "All PNG files have been processed."
