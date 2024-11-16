from PIL import ImageGrab
import easyocr
from dataclasses import dataclass
from typing import List, Tuple
import numpy as np

@dataclass
class TextBlock:
    text: str
    coordinates: Tuple[int, int, int, int]  # x1, y1, x2, y2
    confidence: float

class ScreenOCR:
    def __init__(self, reader: easyocr.Reader = None):
        self.reader = reader if reader else easyocr.Reader(['en'])
        self.image = None

    @property
    def image(self):
        return self.image

    @image.setter
    def image(self, value):
        self.image = value

    def capture_screen(self) -> 'PIL.Image':
        """Capture the entire screen."""
        return ImageGrab.grab()
    
    def merge_text_blocks(self, blocks: List[TextBlock], y_threshold: int = 10, x_gap_threshold: int = 50) -> List[TextBlock]:
        """Merge text blocks that are on the same line and close to each other horizontally.
        
        Args:
            blocks: List of TextBlock objects to merge
            y_threshold: Maximum vertical distance between blocks to be considered on same line
            x_gap_threshold: Maximum horizontal gap between blocks to be merged
        
        Returns:
            List of merged TextBlock objects
        """
        if not blocks:
            return blocks

        # Sort blocks by y-coordinate (top to bottom) and then x-coordinate (left to right)
        sorted_blocks = sorted(blocks, key=lambda b: (b.coordinates[1], b.coordinates[0]))
        merged_blocks = []
        current_block = sorted_blocks[0]
        
        for next_block in sorted_blocks[1:]:
            # Check if blocks are on roughly the same line
            y_diff = abs(next_block.coordinates[1] - current_block.coordinates[1])
            
            # Calculate the horizontal gap between blocks
            current_end_x = current_block.coordinates[2]  # End x of current block
            next_start_x = next_block.coordinates[0]      # Start x of next block
            x_gap = next_start_x - current_end_x

            if y_diff <= y_threshold and x_gap <= x_gap_threshold:
                # Merge blocks
                current_block = TextBlock(
                    text=f"{current_block.text} {next_block.text}",
                    coordinates=(
                        current_block.coordinates[0],  # leftmost x
                        min(current_block.coordinates[1], next_block.coordinates[1]),  # topmost y
                        next_block.coordinates[2],     # rightmost x
                        max(current_block.coordinates[3], next_block.coordinates[3])   # bottom-most y
                    ),
                    confidence=(current_block.confidence + next_block.confidence) / 2
                )
            else:
                merged_blocks.append(current_block)
                current_block = next_block

        # Add the last block
        merged_blocks.append(current_block)
        return merged_blocks
    
    def process_image(self, image: 'PIL.Image') -> List[TextBlock]:
        """Process image and extract text with coordinates.
        
        Args:
            image: PIL Image object to process
            
        Returns:
            List of TextBlock objects containing text and coordinates
        """
        # Convert PIL Image to NumPy array
        image_np = np.array(image)

        # Get detailed OCR data
        ocr_data = self.reader.readtext(image_np)
        
        text_blocks = []
        
        for detection in ocr_data:
            coordinates = detection[0]
            text = detection[1]
            conf = detection[2]
            
            # Skip low confidence detections
            if conf < 0.4:  # Adjust confidence threshold as needed
                continue
                
            # Convert coordinates to (x1, y1, x2, y2) format
            x1, y1 = min(p[0] for p in coordinates), min(p[1] for p in coordinates)
            x2, y2 = max(p[0] for p in coordinates), max(p[1] for p in coordinates)
            
            text_blocks.append(TextBlock(
                text=text,
                coordinates=(int(x1), int(y1), int(x2), int(y2)),
                confidence=conf
            ))
        
        # Merge text blocks that are on the same line
        merged_blocks = self.merge_text_blocks(text_blocks)
        
        return merged_blocks
    
    def scan_screen(self) -> List[TextBlock]:
        """Capture screen and process it for text.
        
        Returns:
            List of TextBlock objects containing text and coordinates
        """
        self.image = self.capture_screen()
        return self.process_image(self.image)

def main():
    # Example usage
    ocr = ScreenOCR()  # Initialize with default reader
    text_blocks = ocr.scan_screen()
    
    print("Detected text blocks:")
    for block in text_blocks:
        print(f"\nText: {block.text}")
        print(f"Location: {block.coordinates}")
        print(f"Confidence: {block.confidence:.2f}%")

if __name__ == "__main__":
    main()
