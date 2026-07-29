import fitz
import os
import json

def extract_content(pdf_path, output_dir, start_page, end_page, section_name):
    """
    Extracts text and images from a range of pages in a PDF.
    """
    os.makedirs(output_dir, exist_ok=True)
    images_dir = os.path.join(output_dir, "images")
    os.makedirs(images_dir, exist_ok=True)
    
    doc = fitz.open(pdf_path)
    
    extracted_text = ""
    image_count = 0
    
    for page_num in range(start_page - 1, end_page):
        page = doc.load_page(page_num)
        
        # Extract Text
        text = page.get_text("text")
        extracted_text += f"\n--- Page {page_num + 1} ---\n"
        extracted_text += text
        
        # Extract Images
        image_list = page.get_images(full=True)
        for img_index, img in enumerate(image_list):
            xref = img[0]
            base_image = doc.extract_image(xref)
            image_bytes = base_image["image"]
            image_ext = base_image["ext"]
            
            # Save image
            image_filename = f"{section_name}_p{page_num+1}_{img_index}.{image_ext}"
            image_path = os.path.join(images_dir, image_filename)
            with open(image_path, "wb") as f:
                f.write(image_bytes)
            image_count += 1
            
            extracted_text += f"\n[IMAGE EXTRACTED: {image_filename}]\n"

    # Save extracted text
    text_path = os.path.join(output_dir, f"{section_name}_raw.txt")
    with open(text_path, "w", encoding="utf-8") as f:
        f.write(extracted_text)
        
    print(f"Extracted {image_count} images and text to {output_dir}")

if __name__ == "__main__":
    pdf_file = "Rules-of-the-road.pdf"
    
    # Section 6 & 7: Signs and Signals (approx 66 - 110)
    extract_content(pdf_file, "extracted_data", 66, 75, "sec6_signs") # Just first 10 pages of signs to avoid millions of images
    
    # Section 8: Speed limits (approx 111 - 122)
    extract_content(pdf_file, "extracted_data", 111, 115, "sec8_speed")
    
    # Section 10: Parking / Maneuvers (approx 136 - 140)
    extract_content(pdf_file, "extracted_data", 136, 140, "sec10_parking")
