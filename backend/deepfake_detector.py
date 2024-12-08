import tensorflow as tf
import numpy as np
import cv2
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.image import img_to_array

class DeepfakeDetector:
    def __init__(self, model_path):
        try:
            self.model = load_model(model_path)
            print("Model loaded successfully from:", model_path)
            # Get the expected input shape from the model
            self.input_shape = self.model.input_shape[1:3]  # (height, width)
        except Exception as e:
            print(f"Error loading model from {model_path}: {e}")
            raise

    def preprocess_frame(self, frame):
        """Preprocess video frame for model input"""
        try:
            # Resize frame to match model's expected input size
            resized_frame = cv2.resize(frame, self.input_shape)
            
            # Convert BGR to RGB
            rgb_frame = cv2.cvtColor(resized_frame, cv2.COLOR_BGR2RGB)
            
            # Normalize pixel values
            normalized_frame = rgb_frame.astype('float32') / 255.0
            
            # Convert to array and add batch dimension
            processed_frame = img_to_array(normalized_frame)
            processed_frame = np.expand_dims(processed_frame, axis=0)
            
            return processed_frame
            
        except Exception as e:
            raise ValueError(f"Error preprocessing frame: {e}")

    def detect_deepfake(self, video_path):
        """Analyze video frames and detect potential deepfakes"""
        try:
            cap = cv2.VideoCapture(video_path)
            if not cap.isOpened():
                raise ValueError(f"Could not open video file: {video_path}")
            
            frame_results = []
            frame_count = 0
            max_frames = 100  # Limit frames to process for efficiency
            
            while cap.isOpened() and frame_count < max_frames:
                ret, frame = cap.read()
                if not ret:
                    break
                
                try:
                    processed_frame = self.preprocess_frame(frame)
                    prediction = self.model.predict(processed_frame, verbose=0)
                    
                    is_deepfake = bool(prediction[0][0] > 0.5)
                    confidence = float(prediction[0][0] if is_deepfake else 1 - prediction[0][0])
                    
                    frame_results.append({
                        'is_deepfake': is_deepfake,
                        'confidence': confidence,
                        'frame_number': frame_count + 1
                    })
                    
                    frame_count += 1
                    
                except Exception as e:
                    print(f"Error processing frame {frame_count}: {e}")
                    continue
            
            cap.release()
            
            if not frame_results:
                raise ValueError("No frames were successfully processed from the video")
            
            # Aggregate results
            total_frames = len(frame_results)
            deepfake_frames = sum(1 for result in frame_results if result['is_deepfake'])
            average_confidence = np.mean([result['confidence'] for result in frame_results])
            
            return {
                'overall_result': deepfake_frames / total_frames > 0.5,
                'confidence': float(average_confidence),
                'frames_analyzed': total_frames,
                'deepfake_frame_count': deepfake_frames,
                'frame_details': frame_results
            }
            
        except Exception as e:
            print(f"Error processing video: {e}")
            raise