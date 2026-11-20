#!/usr/bin/env bash
set -euo pipefail

repo_dir="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
source_dir="${1:-$repo_dir/../../Documents/resumes}"
asset_dir="$repo_dir/assets/cv"
staging_dir="$(mktemp -d "$asset_dir/.pdf-update.XXXXXX")"
trap 'rmdir -- "$staging_dir" 2>/dev/null || rm -r -- "$staging_dir"' EXIT

for document in CV Resume; do
  source_pdf="$source_dir/Manuel-Martinez-Garcia-$document.pdf"
  staged_pdf="$staging_dir/ManuelMartinezGarcia${document}2026.pdf"
  cp -- "$source_pdf" "$staged_pdf"
  pdfinfo "$staged_pdf" >/dev/null
done

for document in CV Resume; do
  filename="ManuelMartinezGarcia${document}2026.pdf"
  mv -- "$staging_dir/$filename" "$asset_dir/$filename"
done
printf 'Updated CV and resume PDFs in %s\n' "$asset_dir"
