#!/bin/bash
# Image Management Script for Holy Matrimony Wedding Site
# Usage: ./scripts/images.sh [command]
#
# Commands:
#   validate  - Check all images exist and have correct format
#   fix       - Convert HEIC/JPEG files to PNG format
#   list      - List all images with their sizes and types
#   workflow  - Run full workflow: validate -> fix -> build -> deploy
#   preview   - Start dev server to preview changes
#   deploy    - Build and deploy to Firebase
#
# Image replacement guide:
#   1. Replace images in public/images/ folder
#   2. Run: ./scripts/images.sh fix
#   3. Run: ./scripts/images.sh deploy
#   4. Check your deployed site!

set -e
cd "$(dirname "$0")/.."

IMAGE_DIR="public/images"
REQUIRED_IMAGES=(
    "png_1.png"   # Hero background
    "png_2.png"   # Town carousel
    "png_3.png"   # Town carousel
    "png_4.png"   # Town carousel
    "png_5.png"   # Trinity Church venue
    "png_6.png"   # Benedict Hall venue
    "png_7.png"   # Gibson Inn venue
    "png_8.png"   # Footer/closing background
    "png_9.png"   # Town carousel
    "png_10.png"  # Town carousel
    "png_11.png"  # Town carousel
    "png_12.png"  # Town carousel
    "png_13.png"  # Town carousel
    "png_14.png"  # Town carousel
    "png_15.png"  # Town carousel
    "png_16.png"  # Town carousel
    "png_17.png"  # Town carousel
    "png_18.png"  # Town carousel
    "png_19.png"  # Town carousel
    "png_20.png"  # Town carousel
    "png_21.png"  # Town carousel
)

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_header() {
    echo ""
    echo -e "${BLUE}========================================${NC}"
    echo -e "${BLUE}  $1${NC}"
    echo -e "${BLUE}========================================${NC}"
    echo ""
}

print_success() {
    echo -e "${GREEN}[OK]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if required commands are available
check_dependencies() {
    local missing=()

    if ! command -v convert &> /dev/null; then
        missing+=("imagemagick (for image conversion)")
    fi
    if ! command -v file &> /dev/null; then
        missing+=("file (for image type detection)")
    fi

    if [ ${#missing[@]} -gt 0 ]; then
        print_error "Missing dependencies:"
        for dep in "${missing[@]}"; do
            echo "  - $dep"
        done
        echo ""
        echo "Install with: apt-get install imagemagick file"
        return 1
    fi
    return 0
}

# List all images with details
list_images() {
    print_header "Image Inventory"

    echo "Key images used in the site:"
    echo ""
    echo "  png_1.png  -> Hero section background"
    echo "  png_2-4    -> Town carousel (Apalachicola photos)"
    echo "  png_5.png  -> Trinity Church (ceremony venue)"
    echo "  png_6.png  -> Benedict Hall (reception venue)"
    echo "  png_7.png  -> Gibson Inn (lodging)"
    echo "  png_8.png  -> Footer/closing section background"
    echo "  png_9-21   -> Town carousel (Apalachicola photos)"
    echo ""

    print_header "Current Files"

    local total_size=0

    for img in "${REQUIRED_IMAGES[@]}"; do
        local path="$IMAGE_DIR/$img"
        if [ -f "$path" ]; then
            local size=$(du -h "$path" | cut -f1)
            local size_bytes=$(stat -f%z "$path" 2>/dev/null || stat -c%s "$path" 2>/dev/null || echo 0)
            local type=$(file -b "$path" | cut -d',' -f1)
            printf "  %-14s %8s  %s\n" "$img" "$size" "$type"
            total_size=$((total_size + size_bytes))
        else
            printf "  %-14s ${RED}MISSING${NC}\n" "$img"
        fi
    done

    echo ""
    echo "Total: $(du -sh "$IMAGE_DIR" | cut -f1)"
}

# Validate all images
validate_images() {
    print_header "Validating Images"

    local errors=0
    local warnings=0

    # Check all required images exist
    for img in "${REQUIRED_IMAGES[@]}"; do
        local path="$IMAGE_DIR/$img"
        if [ ! -f "$path" ]; then
            print_error "Missing: $img"
            errors=$((errors + 1))
        else
            # Check if file is actually a PNG
            local type=$(file -b "$path")
            if [[ ! "$type" =~ ^PNG ]]; then
                print_warning "$img is $type (should be PNG)"
                warnings=$((warnings + 1))
            else
                print_success "$img"
            fi
        fi
    done

    echo ""
    if [ $errors -gt 0 ]; then
        print_error "$errors missing images"
        return 1
    elif [ $warnings -gt 0 ]; then
        print_warning "$warnings images need conversion (run: ./scripts/images.sh fix)"
        return 0
    else
        print_success "All images validated successfully!"
        return 0
    fi
}

# Fix images - convert HEIC/JPEG to PNG
fix_images() {
    print_header "Fixing Image Formats"

    if ! check_dependencies; then
        return 1
    fi

    local fixed=0

    for img in "${REQUIRED_IMAGES[@]}"; do
        local path="$IMAGE_DIR/$img"
        if [ -f "$path" ]; then
            local type=$(file -b "$path")

            # Check if it's JPEG with PNG extension
            if [[ "$type" =~ ^JPEG ]] && [[ "$path" =~ \.png$ ]]; then
                echo "Converting $img from JPEG to PNG..."
                convert "$path" -quality 90 "${path%.png}_temp.png"
                mv "${path%.png}_temp.png" "$path"
                print_success "Converted $img"
                fixed=$((fixed + 1))
            fi

            # Check if it's HEIC
            if [[ "$type" =~ HEIC ]] || [[ "$type" =~ heic ]]; then
                echo "Converting $img from HEIC to PNG..."
                convert "$path" -quality 90 "${path%.png}_temp.png" 2>/dev/null || \
                convert "$path[0]" -quality 90 "${path%.png}_temp.png"
                mv "${path%.png}_temp.png" "$path"
                print_success "Converted $img"
                fixed=$((fixed + 1))
            fi
        fi
    done

    # Also check for any HEIC files that might have been added with wrong extension
    for f in "$IMAGE_DIR"/*.heic "$IMAGE_DIR"/*.HEIC; do
        if [ -f "$f" ]; then
            local basename=$(basename "$f")
            local newname="${basename%.*}.png"
            echo "Converting $basename to $newname..."
            convert "$f" -quality 90 "$IMAGE_DIR/$newname"
            rm "$f"
            print_success "Converted $basename -> $newname"
            fixed=$((fixed + 1))
        fi
    done

    echo ""
    if [ $fixed -gt 0 ]; then
        print_success "Fixed $fixed images"
    else
        print_success "No images needed fixing"
    fi
}

# Start dev server for preview
preview() {
    print_header "Starting Dev Server"
    echo "Starting development server at http://localhost:5173"
    echo "Press Ctrl+C to stop"
    echo ""
    npm run dev
}

# Build and deploy
deploy() {
    print_header "Building and Deploying"

    echo "Step 1: Validating images..."
    if ! validate_images; then
        print_error "Please fix missing images before deploying"
        return 1
    fi

    echo ""
    echo "Step 2: Building..."
    npm run build

    echo ""
    echo "Step 3: Deploying to Firebase..."
    firebase deploy

    echo ""
    print_success "Deployment complete!"
}

# Full workflow
workflow() {
    print_header "Full Workflow"

    echo "This will: validate -> fix -> build -> deploy"
    echo ""

    # Step 1: Validate
    echo "Step 1/4: Validating images..."
    validate_images || true

    # Step 2: Fix
    echo ""
    echo "Step 2/4: Fixing image formats..."
    fix_images

    # Step 3: Build
    echo ""
    echo "Step 3/4: Building..."
    npm run build

    # Step 4: Deploy
    echo ""
    echo "Step 4/4: Deploying..."
    firebase deploy

    echo ""
    print_success "Workflow complete!"
}

# Show help
show_help() {
    echo "Image Management Script"
    echo ""
    echo "Usage: ./scripts/images.sh [command]"
    echo ""
    echo "Commands:"
    echo "  list      Show all images with sizes and types"
    echo "  validate  Check all images exist and have correct format"
    echo "  fix       Convert HEIC/JPEG files to PNG format"
    echo "  preview   Start dev server to preview changes"
    echo "  deploy    Build and deploy to Firebase"
    echo "  workflow  Run full: validate -> fix -> build -> deploy"
    echo ""
    echo "Quick workflow to replace images:"
    echo "  1. Replace images in public/images/ folder"
    echo "  2. Run: ./scripts/images.sh workflow"
    echo "  3. Check your deployed site!"
}

# Main
case "${1:-help}" in
    list)
        list_images
        ;;
    validate)
        validate_images
        ;;
    fix)
        fix_images
        ;;
    preview)
        preview
        ;;
    deploy)
        deploy
        ;;
    workflow)
        workflow
        ;;
    help|--help|-h)
        show_help
        ;;
    *)
        print_error "Unknown command: $1"
        echo ""
        show_help
        exit 1
        ;;
esac
