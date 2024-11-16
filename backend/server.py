from flask import Flask, jsonify
from flask_cors import CORS
from ocr import ScreenOCR
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

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
        
        return jsonify({
            'success': True,
            'data': results
        })
        
    except Exception as e:
        logger.error(f"Error during screen scan: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True) 