#!/bin/bash

# Script to update all HTML files to use component structure
# This script will be run to batch update the remaining files

FILES=("tarifs.html" "conditions.html" "politique.html")

for file in "${FILES[@]}"; do
    echo "Updating $file..."
    
    # Add componentLoader.js script after tailwindcss
    sed -i '' 's|<script src="https://cdn.tailwindcss.com"></script>|<script src="https://cdn.tailwindcss.com"></script>\
    <script src="components/componentLoader.js"></script>|' "$file"
    
    # Replace header section with placeholder
    # This is a complex replacement, better to do manually for each file
    echo "Please manually update the header and footer sections in $file"
done

echo "Script completed. Manual updates still needed for header/footer replacements."
