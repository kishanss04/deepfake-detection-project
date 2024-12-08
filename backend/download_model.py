import os
import requests
import tensorflow as tf
from tensorflow.keras.applications import Xception
from tensorflow.keras.layers import Dense, GlobalAveragePooling2D
from tensorflow.keras.models import Model

def create_model():
    # Create the base model from XceptionNet
    base_model = Xception(weights='imagenet', include_top=False, input_shape=(299, 299, 3))
    
    # Add custom layers for deepfake detection
    x = base_model.output
    x = GlobalAveragePooling2D()(x)
    x = Dense(1024, activation='relu')(x)
    predictions = Dense(1, activation='sigmoid')(x)
    
    # Create the full model
    model = Model(inputs=base_model.input, outputs=predictions)
    
    # Compile the model
    model.compile(optimizer='adam',
                 loss='binary_crossentropy',
                 metrics=['accuracy'])
    
    return model

def main():
    # Create models directory if it doesn't exist
    os.makedirs('models', exist_ok=True)
    
    print("Creating model architecture...")
    model = create_model()
    
    # Save the model
    model_path = 'models/deepfake_model.h5'
    model.save(model_path)
    print(f"Model saved to {model_path}")
    
    print("\nSetup complete! You can now use this model in your deepfake detector.")

if __name__ == "__main__":
    main()