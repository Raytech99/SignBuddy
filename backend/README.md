# Hand Tracking with MediaPipe

This project implements real-time hand tracking using MediaPipe Hands and OpenCV.

## Setup Instructions

1. Create a virtual environment (recommended):

```bash
python -m venv venv
source venv/bin/activate  # On macOS/Linux
```

2. Install the required packages:

```bash
pip install -r requirements.txt
```

## Usage

Run the hand tracking demo:

```bash
python hand_tracking.py
```

- Press 'q' to quit the application
- The application will show FPS and track hand landmarks in real-time
- Green lines show hand connections
- Purple dots show landmark points

## Features

- Real-time hand tracking
- FPS display
- Support for tracking multiple hands
- Landmark visualization
- Easy to integrate into other projects

## Requirements

- Python 3.8+
- OpenCV
- MediaPipe
- Webcam access
