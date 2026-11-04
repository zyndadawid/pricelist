#!/usr/bin/env python3
"""Create web derivatives from one folder per artwork; never modify originals."""
import argparse
import hashlib
import io
import json
import re
import shutil
import sys
import tempfile
import unicodedata
from pathlib import Path
from export_artworks import render_artworks
from PIL import Image, ImageCms, ImageOps, features

SUPPORTED = {'.jpg', '.jpeg', '.png', '.tif', '.tiff', '.webp'}
VARIANTS = [('thumb', 480, 85), ('small', 1280, 88), ('large', 1920, 88), ('zoom', 3200, 92)]
SRGB = ImageCms.ImageCmsProfile(ImageCms.createProfile('sRGB'))

def slug(text):
    text = text.replace('ł', 'l').replace('Ł', 'L')
    text = unicodedata.normalize('NFKD', text).encode('ascii', 'ignore').decode().lower()
    return re.sub(r'[^a-z0-9]+', '-', text).strip('-') or 'artwork'

def natural(path):
    return [ (0, int(part)) if part.isdigit() else (1,part.casefold()) for part in re.split(r'(\d+)',path.name)]

def load_photo(path):
    with Image.open(path) as source:
        if getattr(source, 'n_frames', 1) != 1:
            raise ValueError(f'Multi-frame image is not supported: {path.name}')
        icc = source.info.get('icc_profile')
        image = ImageOps.exif_transpose(source)
        if image.mode not in ('RGB','RGBA','L','LA','CMYK','P'):
            raise ValueError(f'Export {path.name} as an 8-bit RGB image first (mode: {image.mode}).')
        alpha = image.convert('RGBA').getchannel('A') if image.mode in ('RGBA','LA','P') else None
        if icc:
            profile = ImageCms.ImageCmsProfile(io.BytesIO(icc))
            base = image if image.mode in ('RGB','L','CMYK') else image.convert('RGB')
            image = ImageCms.profileToProfile(base, profile, SRGB, outputMode='RGB', renderingIntent=1)
            warning = None
        else:
            if image.mode == 'CMYK':
                raise ValueError(f'{path.name}: untagged CMYK; export to tagged sRGB before processing.')
            image = image.convert('RGB')
            warning = 'No embedded ICC profile: assumed sRGB. Check colour against the original.'
        if alpha is not None:
            image.putalpha(alpha)
        # New pixel buffer removes EXIF/XMP/GPS metadata; export only the sRGB ICC profile.
        clean = Image.new(image.mode, image.size)
        clean.paste(image)
        return clean, warning

def prepare(source, destination, quality=None, zoom_quality=None, dry_run=False):
    source, destination = Path(source).resolve(), Path(destination).resolve()
    if not source.is_dir():
        raise ValueError('Source must be a directory containing one folder per artwork.')
    if destination == source or source in destination.parents or destination in source.parents:
        raise ValueError('Output must be separate from the originals, not inside or above them.')
    if destination.exists():
        raise ValueError('Output already exists. Choose a new directory; nothing will be overwritten.')
    plan, used, warnings = [], set(), []
    for folder in sorted(source.iterdir(), key=natural):
        if folder.is_symlink():
            warnings.append(f'Skipped symbolic link: {folder.name}')
            continue
        if not folder.is_dir():
            if not folder.name.startswith('.'):
                warnings.append(f'Skipped loose file: {folder.name}; place images in an artwork folder.')
            continue
        if folder.name.startswith('.'):
            continue
        files = []
        for item in sorted(folder.iterdir(), key=natural):
            if item.name.startswith('.'):
                continue
            if item.is_file() and not item.is_symlink() and item.suffix.lower() in SUPPORTED:
                files.append(item)
            else:
                warnings.append(f'Skipped unsupported file, link or nested folder: {folder.name}/{item.name}')
        if not files:
            warnings.append(f'No supported photographs in: {folder.name}')
            continue
        identifier = slug(folder.name)
        if identifier in used:
            raise ValueError(f'Folder names produce the same URL slug: {identifier}. Rename one folder.')
        used.add(identifier)
        plan.append((folder, identifier, files))
    if not plan:
        raise ValueError('No supported photographs found in artwork folders. HEIC and RAW need an RGB export first.')
    for warning in warnings:
        print(f'WARNING: {warning}', file=sys.stderr)
    if dry_run:
        for folder, identifier, files in plan:
            print(f'{folder.name} -> {identifier}/ ({len(files)} images, {len(files)*4} derivatives)')
        return
    if not features.check('webp'):
        raise ValueError('This Pillow installation lacks WebP support.')
    destination.parent.mkdir(parents=True, exist_ok=True)
    staging = Path(tempfile.mkdtemp(prefix='.photo-prep-', dir=destination.parent))
    manifest = {'version':1, 'format':'webp', 'colourSpace':'sRGB', 'sizeRule':'longest edge, no upscaling', 'warnings':warnings, 'artworks':[]}
    try:
        for folder, identifier, files in plan:
            target = staging / identifier
            target.mkdir()
            record = {'id':identifier, 'title':folder.name, 'images':[]}
            for number, path in enumerate(files, 1):
                print(f'{folder.name}: {number}/{len(files)} — {path.name}', flush=True)
                photo, warning = load_photo(path)
                entry = {'sourceName':path.name, 'sourceSha256':hashlib.sha256(path.read_bytes()).hexdigest(), 'sourceBytes':path.stat().st_size, 'width':photo.width, 'height':photo.height, 'variants':{}}
                if warning:
                    entry['warning'] = warning
                    print(f'WARNING: {path.name}: {warning}', file=sys.stderr)
                for name, edge, default_quality in VARIANTS:
                    q = (zoom_quality if name=='zoom' else quality) or default_quality
                    resized = photo.copy()
                    resized.thumbnail((edge, edge), Image.Resampling.LANCZOS)
                    filename = f'{identifier}-{number:02d}-{name}.webp'
                    output = target / filename
                    resized.save(output, 'WEBP', quality=q, method=6, icc_profile=SRGB.tobytes())
                    entry['variants'][name] = {'path':f'{identifier}/{filename}', 'width':resized.width, 'height':resized.height, 'bytes':output.stat().st_size, 'quality':q}
                    resized.close()
                photo.close()
                record['images'].append(entry)
            manifest['artworks'].append(record)
        (staging/'manifest.json').write_text(json.dumps(manifest, ensure_ascii=False, indent=2)+'\n',encoding='utf-8')
        (staging/'artworks.ts').write_text(render_artworks(manifest), encoding='utf-8')
        if destination.exists():
            raise ValueError('Output appeared during processing; refusing to overwrite it.')
        staging.rename(destination)
    except BaseException:
        shutil.rmtree(staging, ignore_errors=True)
        raise
    print(f'Done: {len(plan)} artworks. Output: {destination}')

def quality_arg(value):
    value = int(value)
    if not 1 <= value <= 100:
        raise argparse.ArgumentTypeError('Quality must be between 1 and 100.')
    return value

def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('source',type=Path)
    parser.add_argument('output',type=Path)
    parser.add_argument('--quality',type=quality_arg,help='Override thumbnail/small/large quality (defaults: 85/88/88).')
    parser.add_argument('--zoom-quality',type=quality_arg,help='Override zoom quality (default: 92).')
    parser.add_argument('--dry-run',action='store_true',help='List naming plan without writing or decoding images.')
    args = parser.parse_args()
    try:
        prepare(args.source,args.output,args.quality,args.zoom_quality,args.dry_run)
    except (ValueError,OSError,ImageCms.PyCMSError) as exc:
        parser.exit(1,f'Error: {exc}\n')

if __name__=='__main__':
    main()
