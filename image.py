import boto3
import os
from PIL import Image, ImageGrab
import io
import time
import ctypes
from dotenv import load_dotenv
import torch
from transformers import AutoModelForSequenceClassification, AutoTokenizer


# Load AWS credentials from .env file
load_dotenv()

# AWS credentials and region
AWS_ACCESS_KEY_ID = os.environ.get('AWS_ACCESS_KEY_ID')
AWS_SECRET_ACCESS_KEY = os.environ.get('AWS_SECRET_ACCESS_KEY')
REGION_NAME = os.environ.get('AWS_REGION', 'us-east-1')

# Initialize the Rekognition client
rekognition = boto3.client('rekognition', 
    aws_access_key_id=AWS_ACCESS_KEY_ID, 
    aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
    region_name=REGION_NAME
)

# Load model and tokenizer from local directory
model_directory = "./local_model"
model = AutoModelForSequenceClassification.from_pretrained(model_directory)
tokenizer = AutoTokenizer.from_pretrained(model_directory)

def capture_screenshot():
    # Capture the entire screen
    screenshot = ImageGrab.grab()
    return screenshot

def detect_text(image):
    # Convert PIL Image to bytes
    img_byte_arr = io.BytesIO()
    image.save(img_byte_arr, format='PNG')
    img_byte_arr = img_byte_arr.getvalue()

    # Call Amazon Rekognition
    response = rekognition.detect_text(Image={'Bytes': img_byte_arr})
    return response['TextDetections']
def analyze_text(text_detections):
    paragraphs = []
    current_paragraph = ""
    word_count = 0

    for text in text_detections:
        if text['Type'] == 'LINE':
            detected_text = text['DetectedText']
            words = detected_text.split()
            word_count += len(words)
            
            if word_count <= 200:
                current_paragraph += " " + detected_text
            else:
                paragraphs.append(current_paragraph.strip())
                current_paragraph = detected_text
                word_count = len(words)
    
    if current_paragraph:
        paragraphs.append(current_paragraph.strip())
    
    return paragraphs

def check_screen_change():
    # Check if the screen has changed by comparing the current screenshot with the previous one
    previous_screenshot = ImageGrab.grab()
    time.sleep(1)  # Wait for a short period to allow for potential screen changes
    current_screenshot = ImageGrab.grab()
    if previous_screenshot.tobytes() != current_screenshot.tobytes():
        print("Screen has changed!")
        return True
    else:
        return False
    
def classify_text(text):
    # Tokenize the input
    inputs = tokenizer(text, return_tensors="pt", truncation=True, padding=True, max_length=512)
    
    # Make predictions
    with torch.no_grad():
        outputs = model(**inputs)
        logits = outputs.logits
        predicted_class = torch.argmax(logits, dim=1).item()
    
    # Interpret results
    labels = ["legitimate", "scam"]
    prediction = labels[predicted_class]
    
    return prediction

def main():
    try:
        while True:
            if check_screen_change():
                screenshot = capture_screenshot()
                text_detections = detect_text(screenshot)
                results = analyze_text(text_detections)
                print(results)
            time.sleep(1)  # Check for screen changes every second
    except KeyboardInterrupt:
        print("Monitoring stopped.")

if __name__ == "__main__":
    main()
