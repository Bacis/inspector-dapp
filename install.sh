#!/bin/bash

# Check if Python is installed
if ! command -v python3 &> /dev/null
then
    echo "Python is not installed. Please install Python 3."
    exit 1
fi

# Check if pip is installed
if ! command -v pip3 &> /dev/null
then
    echo "pip is not installed. Please install pip for Python 3."
    exit 1
fi

# Create a virtual environment
echo "Creating a virtual environment..."
python3 -m venv venv

# Activate the virtual environment
source venv/bin/activate

# Install the required packages
echo "Installing required packages..."
pip install -r requirements.txt

# Run the Python application
echo "Running the Python application..."
python image.py &  # Run in the background

# Deactivate the virtual environment
deactivate

echo "Installation complete."
