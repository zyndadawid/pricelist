import json
import tempfile
import unittest
from pathlib import Path
from export_artworks import export, render_artworks

class ExportTests(unittest.TestCase):
    def test_values_and_escaping(self):
        title='Łódź "blue"\nétude'
        manifest={'artworks':[{'id':'lodz','title':title,'images':[{'variants':{'large':{'path':'lodz/photo 1.webp'}}}]}]}
        text=render_artworks(manifest)
        data=json.loads(text.split('export const artworks: ArtworkDraft[] = ',1)[1].removesuffix(';\n'))
        self.assertEqual(data[0]['title'],title)
        self.assertEqual(data[0]['medium'], {'PL':'','EN':'','FR':''})
        self.assertEqual(data[0]['description'], {'PL':'','EN':'','FR':''})
        self.assertIsNone(data[0]['prices']['PLN']); self.assertIsNone(data[0]['status'])
        self.assertEqual(data[0]['images'][0]['src'],'/artworks/lodz/photo%201.webp')
        with tempfile.TemporaryDirectory() as tmp:
            source=Path(tmp)/'manifest.json';target=Path(tmp)/'artworks.ts'
            source.write_text(json.dumps(manifest))
            export(source,target)
            target.write_text('user edits')
            with self.assertRaises(FileExistsError):export(source,target)
            self.assertEqual(target.read_text(),'user edits')
    def test_actual_manifest(self):
        # Real manifests are checked separately; no machine-specific paths in tests.
        with self.assertRaises(ValueError):render_artworks({'artworks':[]},'https://example.com')

if __name__=='__main__':unittest.main()
