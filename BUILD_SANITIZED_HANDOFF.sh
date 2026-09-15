#!/usr/bin/env bash
set -euo pipefail

# Rebuilds source trees in this handoff without writing to any source project.
# The generated documentation at this handoff root is deliberately preserved.

readonly HANDOFF_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
readonly CRM_SOURCE="/home/praneon/Desktop/agamagizh-misc/chatwoot-phase1"
readonly VUE_REFERENCE_SOURCE="/home/praneon/Desktop/vue-reference"
readonly STUDIO_ARCHIVE="/home/praneon/Desktop/agamagizh-console.zip"
readonly HOSPITAL_SOURCE="/home/praneon/Desktop/Stuff/agamagizh-clinic"

require_source() {
  if [[ ! -e "$1" ]]; then
    echo "Missing required source: $1" >&2
    exit 1
  fi
}

require_source "$CRM_SOURCE"
require_source "$VUE_REFERENCE_SOURCE"
require_source "$STUDIO_ARCHIVE"
require_source "$HOSPITAL_SOURCE"

declare -a COMMON_EXCLUDES=(
  --exclude='.git/'
  --exclude='.env'
  --exclude='.env.*'
  --exclude='config/secrets.yml'
  --exclude='bin/*-secrets'
  --exclude='*.pem'
  --exclude='*.key'
  --exclude='*.p12'
  --exclude='*.pfx'
  --exclude='*.jks'
  --exclude='secrets/'
  --exclude='node_modules/'
  --exclude='vendor/bundle/'
  --exclude='.pnpm-store/'
  --exclude='dist/'
  --exclude='build/'
  --exclude='.next/'
  --exclude='coverage/'
  --exclude='tmp/'
  --exclude='cache/'
  --exclude='log/'
  --exclude='logs/'
  --exclude='storage/'
  --exclude='backups/'
  --exclude='*.sqlite'
  --exclude='*.sqlite3'
  --exclude='*.sql.gz'
  --exclude='*.dump'
  --exclude='*.bak'
  --exclude='*.swp'
  --exclude='*.tmp'
  --exclude='playwright-report/'
  --exclude='test-results/'
  --exclude='screenshots/'
  --exclude='blob-report/'
)

copy_tree() {
  local source="$1"
  local destination="$2"
  mkdir -p "$destination"
  rsync -a --delete "${COMMON_EXCLUDES[@]}" "$source/" "$destination/"
}

copy_tree "$CRM_SOURCE" "$HANDOFF_ROOT/crm/chatwoot-phase1"
find "$HANDOFF_ROOT/crm/chatwoot-phase1" -type f -path '*/config/secrets.yml' -delete
rm -rf "$HANDOFF_ROOT/crm/chatwoot-phase1/public/assets" \
  "$HANDOFF_ROOT/crm/chatwoot-phase1/public/packs" \
  "$HANDOFF_ROOT/crm/chatwoot-phase1/public/vite" \
  "$HANDOFF_ROOT/crm/chatwoot-phase1/public/vite-dev" \
  "$HANDOFF_ROOT/crm/chatwoot-phase1/public/vite-test" \
  "$HANDOFF_ROOT/crm/chatwoot-phase1/public/downloads"

copy_tree "$VUE_REFERENCE_SOURCE" "$HANDOFF_ROOT/frontend-reference"
# These are approved visual-reference assets, not Playwright runtime output.
if [[ -d "$VUE_REFERENCE_SOURCE/screenshots" ]]; then
  rsync -a --delete "$VUE_REFERENCE_SOURCE/screenshots/" \
    "$HANDOFF_ROOT/frontend-reference/screenshots/"
fi

rm -rf "$HANDOFF_ROOT/studio-original"
mkdir -p "$HANDOFF_ROOT/studio-original"
unzip -q "$STUDIO_ARCHIVE" -d "$HANDOFF_ROOT/studio-original"
find "$HANDOFF_ROOT/studio-original" -type f \( -name '.env' -o -name '.env.*' -o -name '*.pem' -o -name '*.key' -o -name '*.p12' -o -name '*.pfx' \) -delete
find "$HANDOFF_ROOT/studio-original" -type d \( -name node_modules -o -name dist -o -name build -o -name .next -o -name coverage -o -name tmp -o -name cache -o -name logs \) -prune -exec rm -rf {} +

copy_tree "$HOSPITAL_SOURCE" "$HANDOFF_ROOT/hospital-platform"
find "$HANDOFF_ROOT/hospital-platform/bin" -maxdepth 1 -type f -name '*-secrets' -delete
rm -rf "$HANDOFF_ROOT/hospital-platform/bahmni/upstream" \
  "$HANDOFF_ROOT/hospital-platform/agamagizh-wacrm"

copy_tree "$HOSPITAL_SOURCE/agamagizh-wacrm" "$HANDOFF_ROOT/references/agamagizh-wacrm"

template_environment() {
  local source="$1"
  local scope="$2"
  local relative
  local destination
  while IFS= read -r -d '' source_file; do
    relative="${source_file#"$source/"}"
    destination="$HANDOFF_ROOT/generated-env-templates/$scope/${relative}.studio"
    mkdir -p "$(dirname "$destination")"
    {
      echo "# Variable names only. Values were intentionally not copied."
      awk -F= '/^[A-Za-z_][A-Za-z0-9_]*=/{ print $1 "=<REDACTED>" }' "$source_file"
    } >"$destination"
  done < <(find "$source" -type f \( -name '.env.example' -o -name '*.env.example' -o -name '.env.*.example' \) -print0)
}

rm -rf "$HANDOFF_ROOT/generated-env-templates"
mkdir -p "$HANDOFF_ROOT/generated-env-templates"
template_environment "$CRM_SOURCE" crm
template_environment "$VUE_REFERENCE_SOURCE" frontend-reference
template_environment "$HOSPITAL_SOURCE" hospital-platform

echo "Sanitized source handoff rebuilt at: $HANDOFF_ROOT"
