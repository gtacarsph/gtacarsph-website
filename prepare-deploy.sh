#!/bin/bash
# Deployment Preparation Script for GTACarsPH Website
# Run this before uploading to .com domain

echo "🚗 GTACarsPH Website Deployment Prep"
echo "====================================="
echo ""

# Check if domain provided
if [ -z "$1" ]; then
    echo "Usage: ./prepare-deploy.sh yourdomain.com"
    echo ""
    echo "Example:"
    echo "  ./prepare-deploy.sh gtacarsph.com"
    exit 1
fi

DOMAIN=$1
echo "Preparing files for: https://$DOMAIN"
echo ""

# Update all HTML files
for file in *.html; do
    if [ -f "$file" ]; then
        echo "Updating $file..."
        
        # Replace GitHub URLs with domain
        sed -i "s|gtacarsph.github.io/gtacarsph-website|$DOMAIN|g" "$file"
        sed -i "s|gtacarsph.github.io|$DOMAIN|g" "$file"
        
        echo "  ✓ Updated"
    fi
done

echo ""
echo "====================================="
echo "✅ Files prepared for deployment!"
echo ""
echo "Next steps:"
echo "1. Review changes: git diff"
echo "2. Commit changes: git add -A && git commit -m 'Update for .com deployment'"
echo "3. Upload to your hosting via FTP/cPanel"
echo "4. Configure domain DNS"
echo "5. Enable SSL certificate"
echo ""
echo "📖 See DEPLOYMENT_GUIDE.md for detailed instructions"