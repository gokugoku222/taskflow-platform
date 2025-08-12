#!/bin/bash
echo "=== TASKFLOW PROJECT STRUCTURE ==="
echo "Root directory:"
ls -la | head -20

echo -e "\n=== KEY DIRECTORIES ==="
for dir in backend frontend database docker docs tests; do
    if [ -d "$dir" ]; then
        echo -e "\n--- $dir/ ---"
        ls -la $dir/ | head -10
        
        if [ "$dir" = "backend" ]; then
            echo -e "\n--- backend/src/ ---"
            ls -la backend/src/ 2>/dev/null | head -10
            echo -e "\n--- backend/prisma/ ---"
            ls -la backend/prisma/ 2>/dev/null | head -10
        fi
    fi
done

echo -e "\n=== IMPORTANT FILES ==="
find . -maxdepth 2 -name "*.json" -o -name "*.md" -o -name "*.yml" -o -name "*.yaml" | grep -v node_modules | head -10
