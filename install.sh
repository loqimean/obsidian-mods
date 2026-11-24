#!/bin/bash
# Usage: ./install.sh "/path/to/vault"
# Copies every plugin in plugins/ into the vault. Enable new ones in Settings → Community plugins.
set -euo pipefail
vault=${1:?usage: ./install.sh /path/to/vault}
[ -d "$vault/.obsidian" ] || { echo "not an Obsidian vault: $vault" >&2; exit 1; }
root=$(cd "$(dirname "$0")" && pwd)
for dir in "$root"/plugins/*/; do
  id=$(sed -n 's/.*"id": *"\([^"]*\)".*/\1/p' "$dir/manifest.json")
  dest="$vault/.obsidian/plugins/$id"
  mkdir -p "$dest"
  cp "$dir"/{main.js,manifest.json} "$dest/"
  [ -f "$dir/styles.css" ] && cp "$dir/styles.css" "$dest/"
  echo "installed $id → $dest"
done
