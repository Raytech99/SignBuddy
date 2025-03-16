from flask import Flask, Response, jsonify, request
from flask_cors import CORS
import cv2
import numpy as np
from sign_detector import SignLanguageDetector
from sign_classifier import SignClassifier
import json
import base64
import logging
import os

app = Flask(__name__)
CORS(app)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize detector and classifier
detector = SignLanguageDetector()
classifier = SignClassifier()

def generate_frames():
    logger.info("Client connected to video feed")
    cap = cv2.VideoCapture(0)
    
    try:
        while True:
            ret, frame = cap.read()
            if not ret:
                logger.error("Failed to capture frame")
                break
                
            # Flip the frame horizontally before detection
            frame = cv2.flip(frame, 1)
            
            # Detect hands and get landmarks
            frame, landmarks = detector.detect_hands(frame)
            
            # Flip the frame for display (after detection)
            frame = cv2.flip(frame, 1)
            
            # Add status text
            status_text = "No hand detected"
            detected_sign = None
            confidence = 0.0
            
            if landmarks is not None:
                status_text = "Hand detected"
                # Recognize sign
                sign, conf = classifier.recognize_sign(landmarks)
                if sign:
                    detected_sign = sign
                    confidence = conf
                    status_text = f"Detected: {sign} ({conf:.2f})"
                    
            # Add text to frame
            cv2.putText(frame, status_text, 
                        (10, frame.shape[0] - 20),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 1)
            
            # Convert frame to bytes
            ret, buffer = cv2.imencode('.jpg', frame)
            frame_bytes = buffer.tobytes()
            
            # Yield the frame and detection data
            data = {
                'status': status_text,
                'detected_sign': detected_sign,
                'confidence': float(confidence) if confidence else 0.0
            }
            
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n'
                   b'X-Detection-Data: ' + json.dumps(data).encode() + b'\r\n\r\n' + 
                   frame_bytes + b'\r\n')
                   
    except GeneratorExit:
        logger.info("Client disconnected from video feed")
    finally:
        logger.info("Releasing camera")
        cap.release()

@app.route('/video_feed')
def video_feed():
    logger.info("New video feed request")
    return Response(generate_frames(),
                   mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/calibrate/<letter>', methods=['POST'])
def calibrate_letter(letter):
    cap = cv2.VideoCapture(0)
    ret, frame = cap.read()
    cap.release()
    
    if not ret:
        return jsonify({'success': False, 'error': 'Failed to capture frame'})
    
    frame = cv2.flip(frame, 1)
    frame, landmarks = detector.detect_hands(frame)
    
    if landmarks is None:
        return jsonify({'success': False, 'error': 'No hand detected'})
    
    if classifier.add_reference_sign(letter, landmarks):
        return jsonify({'success': True, 'message': f'Calibrated letter {letter}'})
    else:
        return jsonify({'success': False, 'error': 'Failed to add reference sign'})

@app.route('/save_calibration', methods=['POST'])
def save_calibration():
    if classifier.save_references():
        return jsonify({'success': True, 'message': 'Calibration saved'})
    return jsonify({'success': False, 'error': 'Failed to save calibration'})

@app.route('/save_default', methods=['POST'])
def save_default():
    if classifier.save_as_default():
        return jsonify({'success': True, 'message': 'Saved as default'})
    return jsonify({'success': False, 'error': 'Failed to save as default'})

@app.route('/reset_default', methods=['POST'])
def reset_default():
    if classifier.reset_to_default():
        return jsonify({'success': True, 'message': 'Reset to default'})
    return jsonify({'success': False, 'error': 'No default calibration available'})

@app.route('/detect_letter', methods=['POST'])
def detect_letter():
    logger.info("Received detect_letter request")
    try:
        # Get image data from request
        image_data = request.get_json()['image']
        
        # Convert base64 image to numpy array
        encoded_data = image_data.split(',')[1]
        nparr = np.frombuffer(base64.b64decode(encoded_data), np.uint8)
        frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        # Flip the frame horizontally before detection
        frame = cv2.flip(frame, 1)
        
        # Detect hands and get landmarks
        frame, landmarks = detector.detect_hands(frame)
        
        # Flip the frame for display (after detection)
        frame = cv2.flip(frame, 1)
        
        if landmarks is None:
            logger.info("No hand detected")
            return jsonify({
                'success': False,
                'error': 'No hand detected'
            })
        
        # Recognize sign
        sign, confidence = classifier.recognize_sign(landmarks)
        logger.info(f"Detected sign: {sign} with confidence: {confidence}")
        
        return jsonify({
            'success': True,
            'letter': sign,
            'confidence': float(confidence) if confidence else 0.0
        })
        
    except Exception as e:
        logger.error(f"Error in detect_letter: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e)
        })

@app.route('/api/detect', methods=['POST'])
def detect_sign():
    logger.info("Received detect request")
    try:
        # Get image data from request
        data = request.get_json()
        if not data or 'image' not in data:
            return jsonify({'success': False, 'error': 'No image data provided'})
            
        image_data = data['image']
        
        # Convert base64 image to numpy array
        encoded_data = image_data.split(',')[1]
        nparr = np.frombuffer(base64.b64decode(encoded_data), np.uint8)
        frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        # Flip the frame horizontally before detection
        frame = cv2.flip(frame, 1)
        
        # Detect hands and get landmarks
        frame, landmarks = detector.detect_hands(frame)
        
        if landmarks is None:
            logger.info("No hand detected")
            return jsonify({
                'success': False,
                'error': 'No hand detected'
            })
        
        # Recognize sign
        sign, confidence = classifier.recognize_sign(landmarks)
        logger.info(f"Detected sign: {sign} with confidence: {confidence}")
        
        return jsonify({
            'success': True,
            'letter': sign,
            'confidence': float(confidence) if confidence else 0.0
        })
        
    except Exception as e:
        logger.error(f"Error in detect_sign: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e)
        })

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 3001))
    app.run(host='0.0.0.0', port=port) 