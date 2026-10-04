#!/bin/sh
# Rebuild the interactive app preview (app/demo-sl.html, app/demo-en.html) from
# the HuntersFeeder-V3 firmware repo.
#
# The source of truth is V3's "huntersfeeder-ui" package. Its build has a demo
# profile: one self-contained HTML file with the demo backend (80-mock.js)
# inlined, so the real app runs in a browser with no device behind it. This
# script builds that profile from V3's last COMMIT (git archive), not from the
# working tree, so half-finished local edits in V3 never reach the website.
#
#   sh tools/update-app-demo.sh                       # V3 at ~/HuntersFeeder-V3
#   sh tools/update-app-demo.sh /path/to/HuntersFeeder-V3
#
# Needs Python 3 (PlatformIO's own is used when no other is on PATH).
set -e

V3="${1:-$HOME/HuntersFeeder-V3}"
PKG="HuntersFeeder Web GUI esp32 oriented V2/huntersfeeder-ui"
HERE="$(cd "$(dirname "$0")/.." && pwd)"

PY=""
for c in "$HOME/.platformio/penv/Scripts/python.exe" "$HOME/.platformio/penv/bin/python" python3 python; do
  if "$c" -c "import sys; sys.exit(sys.version_info < (3,6))" >/dev/null 2>&1; then PY="$c"; break; fi
done
[ -n "$PY" ] || { echo "no Python 3 found"; exit 1; }

# Short temp path: the package folder name is long and Windows tools choke
# on deep paths.
TMP="${TMPDIR:-${TEMP:-/tmp}}/hfdemo.$$"
rm -rf "$TMP"; mkdir -p "$TMP"
trap 'rm -rf "$TMP"' EXIT

git -C "$V3" archive HEAD "$PKG" | tar -x -C "$TMP"
mv "$TMP/$PKG" "$TMP/ui"
REV="$(git -C "$V3" log -1 --format='%h %ad %s' --date=short)"

# Demo-only fix for a V3 bug (since 1542229, 2026-09-21): when the first
# /api/state fails, 20-api.js switches to the mock and calls pollOnce() while
# `inflight` is still true, so it gets its own pending promise back - a cycle
# that rejects and leaves the app with no data, ever. The device build has no
# mock, so only the demo hangs. Clearing the flag first is the fix; this does
# nothing once V3 has it.
API="$TMP/ui/ui/src/kernel/20-api.js"
sed 's/HF\.mock\.enable(); return pollOnce();/HF.mock.enable(); inflight = false; return pollOnce();/' \
  "$API" > "$API.new" && mv "$API.new" "$API"

for L in sl en; do
  ( cd "$TMP/ui" && "$PY" tools/build_ui.py --with-mock --no-split-dev \
      --device-chrome on --no-headers --max-bytes 400000 --lang "$L" \
      --emit-html "$TMP/demo-$L.html" )
  cp "$TMP/demo-$L.html" "$HERE/app/demo-$L.html"
done

printf '%s\n' "$REV" > "$HERE/app/SOURCE.txt"
echo "app/demo-sl.html + app/demo-en.html <- V3 $REV"
