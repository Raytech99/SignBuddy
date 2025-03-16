from sign_detector import SignLanguageDetector
from sign_classifier import SignClassifier
import cv2
import time

def main():
    detector = SignLanguageDetector()
    classifier = SignClassifier()
    
    # Initialize video capture
    cap = cv2.VideoCapture(0)
    if not cap.isOpened():
        print("Error: Could not open camera")
        return
    
    # Application state
    calibration_mode = False
    current_letter_index = 0
    
    print("\nASL Alphabet Recognition System")
    print("============================")
    print("Controls:")
    print("'c' - Start/Stop calibration mode")
    print("'s' - Save calibration data")
    print("'d' - Save current calibration as default")
    print("'r' - Reset to default calibration")
    print("'q' - Quit the application")
    print("\nStatus: System ready for ASL alphabet recognition")
    
    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            print("Error: Failed to grab frame")
            break
            
        # Flip the frame horizontally
        frame = cv2.flip(frame, 1)
        
        # Detect hands and get landmarks
        frame, landmarks = detector.detect_hands(frame)
        
        # Add status text
        status_text = "No hand detected"
        if landmarks is not None:
            status_text = "Hand detected"
            
        # Display mode and status
        cv2.putText(frame, f"Mode: {'Calibration' if calibration_mode else 'Recognition'}", 
                    (10, frame.shape[0] - 40), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 1)
        cv2.putText(frame, f"Status: {status_text}", 
                    (10, frame.shape[0] - 20), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 1)
        
        # Handle hand detection and recognition
        if landmarks is not None:
            if calibration_mode:
                if current_letter_index < len(classifier.letters):
                    current_letter = classifier.letters[current_letter_index]
                    # Display calibration instructions
                    cv2.putText(frame, f"Show sign for letter '{current_letter}'", 
                              (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
                    cv2.putText(frame, "Press SPACE to capture", 
                              (10, 60), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 1)
                else:
                    calibration_mode = False
                    print("\nCalibration completed! Press 's' to save the calibration data.")
            else:
                # Recognize sign
                sign, confidence = classifier.recognize_sign(landmarks)
                if sign:
                    # Display recognized letter and confidence
                    text = f"Detected: {sign} ({confidence:.2f})"
                    cv2.putText(frame, text, (10, 30),
                              cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
        
        # Display the frame
        cv2.imshow('ASL Alphabet Recognition', frame)
        
        # Handle keyboard input
        key = cv2.waitKey(1) & 0xFF
        if key == ord('q'):
            print("\nQuitting application...")
            break
        elif key == ord('c'):
            calibration_mode = not calibration_mode
            current_letter_index = 0
            if calibration_mode:
                print("\nEntering calibration mode...")
                print("Show each letter sign and press SPACE to capture")
            else:
                print("\nExiting calibration mode")
        elif key == ord('s'):
            if classifier.save_references():
                print("Calibration data saved successfully!")
            else:
                print("Failed to save calibration data")
        elif key == ord('d'):
            if classifier.save_as_default():
                print("Current calibration saved as default!")
            else:
                print("Failed to save as default")
        elif key == ord('r'):
            if classifier.reset_to_default():
                print("Reset to default calibration")
            else:
                print("No default calibration available")
        elif key == ord(' ') and calibration_mode and landmarks is not None:
            if current_letter_index < len(classifier.letters):
                current_letter = classifier.letters[current_letter_index]
                if classifier.add_reference_sign(current_letter, landmarks):
                    print(f"Captured sign for letter '{current_letter}'")
                    current_letter_index += 1
                    if current_letter_index < len(classifier.letters):
                        print(f"Now show sign for letter '{classifier.letters[current_letter_index]}'")
                else:
                    print("Failed to capture sign. Please try again.")
    
    cap.release()
    cv2.destroyAllWindows()

if __name__ == "__main__":
    main() 