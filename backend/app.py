from flask import Flask, jsonify
from flask_cors import CORS
from ocr import ScreenOCR
import logging
import requests

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize Flask app
app = Flask(__name__)
CORS(app, resources={
    r"/api/*": {
        "origins": ["http://localhost:4000"]  # Allow React dev server
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

        # Fix: Convert the texts to a proper query string format
        texts = [result['text'] for result in filtered_results]

        # Create a proper JSON structure
        payload = {
            "texts": texts
        }
        
        try:
            response = requests.post("http://0.0.0.0:3000/predict", json=payload)
            response.raise_for_status()  # Raises an HTTPError for bad responses
            
            return jsonify({
                'success': True,
                'data': response.json()
            })
            
        except requests.exceptions.RequestException as e:
            logger.error(f"Error calling prediction service: {str(e)}")
            return jsonify({
                'success': False,
                'error': f"Prediction service error: {str(e)}"
            }), 500
        
    except Exception as e:
        logger.error(f"Error during screen scan: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True) 