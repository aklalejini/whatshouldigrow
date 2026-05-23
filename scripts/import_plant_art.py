"""Convert local plant plate PNGs into site-ready WebP assets.

The source-of-truth for names, aliases, crop positions, and output files is
src/data/plantArt.json. By default this script looks in the user's OneDrive
Plant Photos folder, skips images that are already current, and keeps output
bounded so result cards stay fast.
"""

from __future__ import annotations

import argparse
import json
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

from PIL import Image, ImageOps


ROOT = Path(__file__).resolve().parents[1]
MANIFEST = ROOT / "src" / "data" / "plantArt.json"
OUT_DIR = ROOT / "public" / "plant-art"
DEFAULT_SOURCE_DIR = Path.home() / "OneDrive" / "Documents" / "Plant Photos"


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Import botanical plant art.")
    parser.add_argument("--source-dir", type=Path, default=DEFAULT_SOURCE_DIR)
    parser.add_argument("--manifest", type=Path, default=MANIFEST)
    parser.add_argument("--out-dir", type=Path, default=OUT_DIR)
    parser.add_argument("--max-edge", type=int, default=1200)
    parser.add_argument("--quality", type=int, default=80)
    parser.add_argument("--method", type=int, default=4)
    parser.add_argument("--force", action="store_true")
    parser.add_argument("--verbose", action="store_true")
    parser.add_argument("--workers", type=int, default=4)
    return parser.parse_args()


def load_entries(manifest: Path) -> list[dict]:
    with manifest.open("r", encoding="utf-8") as handle:
        return json.load(handle)


def needs_update(source: Path, target: Path, force: bool) -> bool:
    if force or not target.exists():
        return True
    return source.stat().st_mtime > target.stat().st_mtime


def resize_to_max_edge(image: Image.Image, max_edge: int) -> Image.Image:
    width, height = image.size
    longest = max(width, height)
    if longest <= max_edge:
        return image
    scale = max_edge / longest
    size = (round(width * scale), round(height * scale))
    return image.resize(size, Image.Resampling.LANCZOS)


def convert_entry(entry: dict, args: argparse.Namespace) -> tuple[str, str]:
    source_name = entry.get("source")
    image_name = entry.get("image")
    if not source_name or not image_name:
        return ("skipped", f"{entry.get('id', '<unknown>')}: missing source or image")

    source = args.source_dir / source_name
    target = args.out_dir / image_name
    if not source.exists():
        return ("missing", f"{entry['id']}: source not found ({source.name})")

    if not needs_update(source, target, args.force):
        return ("current", target.name)

    args.out_dir.mkdir(parents=True, exist_ok=True)
    with Image.open(source) as original:
        image = ImageOps.exif_transpose(original).convert("RGB")
        image = resize_to_max_edge(image, args.max_edge)
        image.save(target, "WEBP", quality=args.quality, method=args.method)

    return ("wrote", f"{target.name} ({target.stat().st_size:,} bytes)")


def main() -> None:
    args = parse_args()
    entries = load_entries(args.manifest)

    counts = {"wrote": 0, "current": 0, "missing": 0, "skipped": 0}
    with ThreadPoolExecutor(max_workers=max(1, args.workers)) as executor:
        futures = [executor.submit(convert_entry, entry, args) for entry in entries]
        for future in as_completed(futures):
            status, message = future.result()
            counts[status] += 1
            if status == "wrote" or args.verbose:
                print(f"{status} {message}")

    print(
        "done: "
        f"{counts['wrote']} wrote, "
        f"{counts['current']} current, "
        f"{counts['missing']} missing sources, "
        f"{counts['skipped']} skipped"
    )


if __name__ == "__main__":
    main()
