import fitz
import sys

def main():
    try:
        doc = fitz.open("Rules-of-the-road.pdf")
        print(f"Total Pages: {doc.page_count}")
        toc = doc.get_toc()
        if toc:
            print("Table of Contents:")
            for level, title, page in toc:
                indent = "  " * (level - 1)
                print(f"{indent}- {title} (Page {page})")
        else:
            print("No Table of Contents found.")
    except Exception as e:
        print(f"Error reading PDF: {e}")

if __name__ == "__main__":
    main()
