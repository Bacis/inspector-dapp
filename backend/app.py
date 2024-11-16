from flask import Flask, jsonify
from flask_cors import CORS
from ocr import ScreenOCR
import logging
import requests
from PIL import ImageGrab, Image
import base64
import io

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize Flask app
app = Flask(__name__)
CORS(app, resources={
    r"/api/*": {
        "origins": ["http://localhost:3001"]  # Allow React dev server
    }
})

# Initialize OCR
ocr = ScreenOCR()

@app.route('/api/scan-screen', methods=['GET'])
def scan_screen():
    """
    Endpoint to scan the screen and return detected text blocks.
    Returns JSON with detected text blocks and their coordinates.
    """
    try:
        # Scan screen using OCR
        text_blocks = ocr.scan_screen()
        screenshot = ImageGrab.grab()
        max_dimension = 800  # Adjust this value based on your needs
        ratio = min(max_dimension / screenshot.width, max_dimension / screenshot.height)
        new_size = (int(screenshot.width * ratio), int(screenshot.height * ratio))
        screenshot = screenshot.resize(new_size, Image.Resampling.LANCZOS)

       # Convert RGBA to RGB before saving
        if screenshot.mode == 'RGBA':
            screenshot = screenshot.convert('RGB')
        # Convert TextBlocks to dictionary format
        results = [
            {
                'text': block.text,
                'coordinates': {
                    'x1': block.coordinates[0],
                    'y1': block.coordinates[1],
                    'x2': block.coordinates[2],
                    'y2': block.coordinates[3]
                },
                'confidence': block.confidence
            }
            for block in text_blocks
        ]

        # Filter the results to only those with confidence > 0.5 and length > 5
        filtered_results = [result for result in results if result['confidence'] > 0.5 and len(result['text'].split(' ')) > 5]

        buffer = io.BytesIO()
        screenshot.save(buffer, format="JPEG", quality=70, optimize=True)
        encoded_screenshot = base64.b64encode(buffer.getvalue()).decode()

        # Prepare response
        return jsonify({
            'success': True,
            'data': {
                'predictions': [
                    [result['text'], result['confidence']] 
                    for result in filtered_results
                ]
            },
            'screenshot': encoded_screenshot
        })
    except Exception as e:
        logger.error(f"Error during screen scan: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True) 