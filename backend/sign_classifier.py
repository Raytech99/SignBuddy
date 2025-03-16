import numpy as np
from sklearn.preprocessing import StandardScaler
import json
import os
import pickle

class SignClassifier:
    def __init__(self):
        self.scaler = StandardScaler()
        self.is_scaler_fitted = False
        # Dictionary to store reference hand poses for different signs
        self.sign_references = {}
        self.letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
        self.reference_file = 'asl_references.json'
        self.default_reference_file = 'default_asl_references.json'
        self.scaler_file = 'scaler.pkl'
        self.default_scaler_file = 'default_scaler.pkl'
        self.load_asl_alphabet_references()
        
    def load_asl_alphabet_references(self):
        """Load ASL alphabet reference data"""
        # First try to load user's calibrated data
        if os.path.exists(self.reference_file):
            try:
                with open(self.reference_file, 'r') as f:
                    self.sign_references = json.load(f)
                if os.path.exists(self.scaler_file):
                    with open(self.scaler_file, 'rb') as f:
                        self.scaler = pickle.load(f)
                        self.is_scaler_fitted = True
                print("Loaded your calibrated ASL reference data")
                return
            except:
                print("Could not load your calibrated data")
        
        # If no user calibration exists, try to load default references
        if os.path.exists(self.default_reference_file):
            try:
                with open(self.default_reference_file, 'r') as f:
                    self.sign_references = json.load(f)
                if os.path.exists(self.default_scaler_file):
                    with open(self.default_scaler_file, 'rb') as f:
                        self.scaler = pickle.load(f)
                        self.is_scaler_fitted = True
                print("Loaded default ASL reference data")
                return
            except:
                print("Could not load default reference data")
        
        print("No reference data found. Please use 'c' key to calibrate signs.")
        
    def save_references(self):
        """Save reference data to file"""
        try:
            # Save to user's calibration file
            with open(self.reference_file, 'w') as f:
                json.dump(self.sign_references, f)
            with open(self.scaler_file, 'wb') as f:
                pickle.dump(self.scaler, f)
            print("Calibration data saved successfully")
            
            # Optionally save as default if it doesn't exist
            if not os.path.exists(self.default_reference_file):
                with open(self.default_reference_file, 'w') as f:
                    json.dump(self.sign_references, f)
                with open(self.default_scaler_file, 'wb') as f:
                    pickle.dump(self.scaler, f)
                print("Also saved as default reference data")
            return True
        except Exception as e:
            print(f"Error saving reference data: {str(e)}")
            return False
        
    def save_as_default(self):
        """Save current references as default"""
        try:
            with open(self.default_reference_file, 'w') as f:
                json.dump(self.sign_references, f)
            with open(self.default_scaler_file, 'wb') as f:
                pickle.dump(self.scaler, f)
            print("Saved as default reference data")
            return True
        except Exception as e:
            print(f"Error saving default reference data: {str(e)}")
            return False
        
    def reset_to_default(self):
        """Reset to default references"""
        if os.path.exists(self.default_reference_file):
            try:
                with open(self.default_reference_file, 'r') as f:
                    self.sign_references = json.load(f)
                if os.path.exists(self.default_scaler_file):
                    with open(self.default_scaler_file, 'rb') as f:
                        self.scaler = pickle.load(f)
                        self.is_scaler_fitted = True
                print("Reset to default reference data")
                return True
            except:
                print("Could not reset to default reference data")
        return False
        
    def preprocess_landmarks(self, landmarks):
        """Preprocess landmarks for better comparison"""
        try:
            if landmarks is None:
                return None
                
            # Convert to relative coordinates
            base_x, base_y, base_z = landmarks[0]  # Use wrist as base point
            relative_landmarks = landmarks - np.array([base_x, base_y, base_z])
            
            # Normalize the coordinates
            norm = np.linalg.norm(relative_landmarks)
            if norm == 0:
                return None
            normalized_landmarks = relative_landmarks / norm
            
            # Flatten the landmarks array
            flattened = normalized_landmarks.flatten()
            
            # Scale the features if needed
            if not self.is_scaler_fitted:
                self.scaler.fit(flattened.reshape(1, -1))
                self.is_scaler_fitted = True
                return flattened
            
            return self.scaler.transform(flattened.reshape(1, -1))[0]
            
        except Exception as e:
            print(f"Error in preprocessing landmarks: {str(e)}")
            return None
        
    def add_reference_sign(self, sign_name, landmarks):
        """Add a reference hand pose for a sign"""
        try:
            processed_landmarks = self.preprocess_landmarks(landmarks)
            if processed_landmarks is not None:
                self.sign_references[sign_name] = processed_landmarks.tolist()  # Convert to list for JSON serialization
                return True
            return False
        except Exception as e:
            print(f"Error adding reference sign: {str(e)}")
            return False
            
    def recognize_sign(self, landmarks, threshold=0.65):
        """Recognize a sign based on current hand pose"""
        try:
            # Early returns for invalid cases
            if landmarks is None:
                return None, 0.0
                
            if not self.sign_references:
                return None, 0.0
                
            current_pose = self.preprocess_landmarks(landmarks)
            if current_pose is None:
                return None, 0.0
                
            # Compare with all reference signs
            best_match = None
            highest_similarity = -1
            
            for sign_name, reference_pose in self.sign_references.items():
                # Convert stored reference back to numpy array
                reference_pose = np.array(reference_pose)
                # Calculate cosine similarity
                similarity = np.dot(current_pose, reference_pose) / (
                    np.linalg.norm(current_pose) * np.linalg.norm(reference_pose)
                )
                
                if similarity > highest_similarity:
                    highest_similarity = similarity
                    best_match = sign_name
                    
            # Return the matched sign if similarity is above threshold
            if highest_similarity >= threshold:
                return best_match, highest_similarity
            return None, highest_similarity
            
        except Exception as e:
            print(f"Error during sign recognition: {str(e)}")
            return None, 0.0 