import contextlib
import io
import json
import tempfile
import unittest
from pathlib import Path
from PIL import Image, ImageCms
from prepare_photos import prepare, SRGB

class PhotoTests(unittest.TestCase):
    def test_orientation_sizes_profile_order_and_originals(self):
        with tempfile.TemporaryDirectory() as tmp:
            root=Path(tmp); source=root/'originals'; folder=source/'Łódź été'; folder.mkdir(parents=True)
            image=Image.new('RGB',(1800,1200),'#987654'); exif=Image.Exif();exif[274]=6;exif[315]='private camera owner'
            for name in ['photo10.jpg','photo2.jpg']:
                image.save(folder/name,exif=exif,icc_profile=SRGB.tobytes())
            originals={p.name:p.read_bytes() for p in folder.iterdir()}
            with contextlib.redirect_stdout(io.StringIO()):prepare(source,root/'web')
            manifest=json.loads((root/'web/manifest.json').read_text())
            work=manifest['artworks'][0]
            self.assertEqual(work['title'],'Łódź été');self.assertEqual(work['id'],'lodz-ete')
            self.assertEqual([i['sourceName'] for i in work['images']],['photo2.jpg','photo10.jpg'])
            for record in work['images']:
                self.assertEqual((record['width'],record['height']),(1200,1800))
                for name, variant in record['variants'].items():
                    with Image.open(root/'web'/variant['path']) as exported:
                        self.assertEqual(exported.size,(variant['width'],variant['height']))
                        self.assertLessEqual(max(exported.size),1800)
                        self.assertAlmostEqual(exported.width/exported.height,2/3,places=2)
                        self.assertFalse(exported.getexif())
                        self.assertIn('sRGB',ImageCms.getProfileDescription(ImageCms.ImageCmsProfile(io.BytesIO(exported.info['icc_profile']))))
            self.assertEqual(originals,{p.name:p.read_bytes() for p in folder.iterdir()})
            with self.assertRaises(ValueError):prepare(source,root/'web')
            with self.assertRaises(ValueError):prepare(source,source/'web')
    def test_dry_run_and_failure_cleanup(self):
        with tempfile.TemporaryDirectory() as tmp:
            root=Path(tmp);source=root/'originals';folder=source/'work';folder.mkdir(parents=True)
            (folder/'bad.jpg').write_bytes(b'invalid')
            with contextlib.redirect_stdout(io.StringIO()):prepare(source,root/'web',dry_run=True)
            self.assertFalse((root/'web').exists())
            with self.assertRaises(OSError),contextlib.redirect_stdout(io.StringIO()):prepare(source,root/'web')
            self.assertFalse((root/'web').exists());self.assertEqual(list(root.glob('.photo-prep-*')),[])

if __name__=='__main__':unittest.main()
