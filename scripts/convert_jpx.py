import os
from PIL import Image

folder = r"C:\Users\Investigador\Driving Test\public\images\extracted"

for filename in os.listdir(folder):
    if filename.endswith(".jpx") or filename.endswith(".png"):
        file_path = os.path.join(folder, filename)
        jpg_path = os.path.join(folder, filename.split('.')[0] + ".jpg")
        try:
            with Image.open(file_path) as img:
                if img.mode == 'CMYK':
                    img = img.convert('RGB')
                img.save(jpg_path, "JPEG")
            print(f"Converted {filename} to JPG")
            os.remove(file_path)
        except Exception as e:
            print(f"Failed to convert {filename}: {e}")
