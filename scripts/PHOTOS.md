# Artwork photograph preparation

Install Pillow in a virtual environment, then run the script from the project folder:

```sh
python3 -m venv .venv-photos
.venv-photos/bin/pip install -r scripts/requirements-photos.txt
.venv-photos/bin/python scripts/prepare_photos.py "/path/to/originals" "/path/to/web-photos" --dry-run
.venv-photos/bin/python scripts/prepare_photos.py "/path/to/originals" "/path/to/web-photos"
```

The source contains one direct subfolder per artwork. Its folder name becomes the title. Files use natural filename order: photo2 precedes photo10. Rename originals manually with prefixes such as 01-front, 02-detail if you want a specific order; the script itself never renames originals. A new output directory is required on each run. Choose a sibling of the source, not a directory inside it.

Example: `originals/Quiet arrangement/01-front.jpg` produces `web-photos/quiet-arrangement/quiet-arrangement-01-large.webp` and three other variants. Names with accents are transliterated for URLs; folder titles retain accents in the manifest. Conflicting slugs stop processing rather than merging works.

Defaults, measured on the longest edge:
- thumb: 480 px, WebP quality 85
- small: 1280 px, WebP quality 88
- large: 1920 px, WebP quality 88
- zoom: 3200 px, WebP quality 92

Each variant is independently resized from the source. No cropping, upscaling, sharpening, or automatic contrast/saturation adjustment. Small sources may produce duplicate-size variants. EXIF orientation is applied before resizing. Valid embedded ICC profiles are converted to sRGB and an sRGB profile is embedded. EXIF/XMP metadata is not copied. Untagged RGB is assumed sRGB with a warning; untagged CMYK and invalid profiles fail rather than silently risking the colours. This is an 8-bit web workflow; export RAW, HEIC and high-bit-depth masters to colour-managed, tagged RGB JPEG/PNG/TIFF first. Unsupported files are reported; supported multi-frame files fail. Symlinks are skipped.

`manifest.json` contains original titles and filenames, source checksums, oriented dimensions, variant paths, byte sizes, and encoding quality. Paths are relative to the output directory, not automatically public URLs. The manifest does not contain prices or availability, and does not replace the existing artwork catalogue. Avoid publishing it if source filenames are private.

## Quality review

Try a representative batch first: smooth gradients, dark paintings, saturated colours, fine brushwork and canvas texture. Compare resized originals against exports at actual display size and 100%. Check on a colour-managed display; a profile cannot correct inaccurate photography or a miscalibrated screen. Zoom quality 92 is a starting point, not a guarantee. Use `--quality 92 --zoom-quality 95` for a higher-quality comparison in a new output directory. WebP is lossy, including chroma detail; keep originals and consider a lossless detail image for work that still shows artifacts. Do not enforce a byte limit at the expense of brushwork.

## Website integration

Serve small/large variants via `srcset` with the actual width values from the manifest and a `sizes` attribute matching the feed width. Never use the longest-edge value as a width descriptor for portrait photos. Load zoom images only when opening a detail/zoom view; do not download every 3200 px image with the feed. Use thumbnails only in thumbnail controls or grids, never stretch them into the main artwork image. Preserve the complete artwork with `object-fit: contain` or natural dimensions. Current mockup uses `object-fit: cover`; update that when real photographs are integrated.

With these pre-encoded variants, use native responsive images or a custom Next.js image loader that selects these files, avoiding needless second compression. Alternatively use Next.js automatic image optimization from a high-quality master and let it create responsive variants instead. The script does not change the feed or implement zoom by itself.

## Editable catalogue output

New conversions also generate `artworks.ts` beside `manifest.json`. It has the same record fields as the portfolio, with titles, IDs and large image paths prefilled. Fill all nulls and empty strings before copying the records into the application's typed `Artwork[]` array. Unknown year, price and status are deliberately nullable in the draft. Check both PLN and EUR prices and replace generic alt text with photo-specific descriptions.

Copy the image subfolders to `public/artworks/`. Replace the sample array **and its trailing `.map(...)`**, since that demo mapping would overwrite your photo paths. Keep the app's original `Artwork` type. The draft itself is not a ready-to-publish catalogue; it uses `ArtworkDraft` so unfinished fields are explicit. Fill the PL, EN and FR keys directly inside each medium and description object. Titles remain unchanged.

For already processed photos, do not resize again:

```sh
python3 scripts/export_artworks.py "/path/to/works-web/manifest.json" "/path/to/artworks-draft.ts"
```

This command uses only the Python standard library. Optionally set `--public-prefix /artworks` to match the URL where photos will be served. It refuses to overwrite an existing file, protecting manual edits. When copying the updated resizer elsewhere, copy `export_artworks.py` alongside it as well.
