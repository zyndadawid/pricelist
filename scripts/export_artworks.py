#!/usr/bin/env python3
"""Generate an editable TypeScript catalogue from a photo manifest, without resizing."""
import argparse
import json
from pathlib import Path
from urllib.parse import quote


def render_artworks(manifest, public_prefix='/artworks'):
    if not public_prefix.startswith('/') or public_prefix.startswith('//') or '?' in public_prefix or '#' in public_prefix:
        raise ValueError('Public prefix must be a local URL path, such as /artworks.')
    prefix = public_prefix.rstrip('/')
    records = []
    for work in manifest['artworks']:
        images = []
        for index, image in enumerate(work['images'], 1):
            relative = image['variants']['large']['path']
            if relative.startswith('/') or '..' in relative.split('/') or '\\' in relative:
                raise ValueError(f'Unsafe image path in manifest: {relative}')
            images.append({'src':prefix + '/' + quote(relative, safe='/'),
                           'alt':f"{work['title']} — photo {index}"})
        records.append({'id':work['id'], 'title':work['title'], 'year':None,
                        'dimensions':'', 'medium':{'PL':'','EN':'','FR':''}, 'prices':{'PLN':None,'EUR':None},
                        'status':None, 'description':{'PL':'','EN':'','FR':''}, 'images':images})
    header = '''// EDITABLE DRAFT — fill every null and empty field before publishing.
// Copy completed records into src/data/artworks.ts, replacing the sample array
// AND its trailing .map(...) (which otherwise replaces these photo paths).
// Copy the generated artwork image folders into public/artworks/.
// Paths below use the large (1920 px longest edge) image variant.
// Review alt text for each photograph; titles are preserved from folder names.
// Set PLN and EUR prices independently. Null means price on request.
// Write medium and description translations directly in their PL / EN / FR fields.

export type ArtworkDraft = {
  id: string;
  title: string;
  year: number | null; // TODO: creation year
  dimensions: string; // TODO: physical dimensions, e.g. "30 × 25 × 20 cm"
  medium: Record<'PL' | 'EN' | 'FR', string>; // TODO: material / technique in each language
  prices: { PLN: number | null; EUR: number | null }; // TODO: independent prices
  status: 'available' | 'reserved' | 'exhibition' | 'sold' | null; // TODO
  description: Record<'PL' | 'EN' | 'FR', string>; // TODO: description in each language
  images: { src: string; alt: string }[];
};

export const artworks: ArtworkDraft[] = '''
    return header + json.dumps(records, ensure_ascii=False, indent=2).replace('\u2028','\\u2028').replace('\u2029','\\u2029') + ';\n'


def export(manifest_path, output, public_prefix='/artworks'):
    content = render_artworks(json.loads(Path(manifest_path).read_text(encoding='utf-8')), public_prefix)
    # Exclusive creation protects a catalogue the user may already have edited.
    with Path(output).open('x', encoding='utf-8') as target:
        target.write(content)


def main():
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('manifest',type=Path)
    parser.add_argument('output',type=Path)
    parser.add_argument('--public-prefix',default='/artworks')
    args=parser.parse_args()
    try:
        export(args.manifest,args.output,args.public_prefix)
    except (OSError,ValueError,KeyError,TypeError) as exc:
        parser.exit(1,f'Error: {exc}\n')
    print(f'Created editable catalogue: {args.output}')

if __name__=='__main__':
    main()
