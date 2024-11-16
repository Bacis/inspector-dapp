from dotenv import load_dotenv
import torch
from transformers import AutoModelForSequenceClassification, AutoTokenizer


# Load AWS credentials from .env file
load_dotenv()

model_directory = "./model"

model = AutoModelForSequenceClassification.from_pretrained(model_directory)
tokenizer = AutoTokenizer.from_pretrained(model_directory)

def classify_text(text):
    # Tokenize the input
    inputs = tokenizer(text, return_tensors="pt", truncation=True, padding=True, max_length=512)
    
    # Make predictions
    with torch.no_grad():
        outputs = model(**inputs)
        logits = outputs.logits
        predicted_class = torch.argmax(logits, dim=1).item()
    return predicted_class
