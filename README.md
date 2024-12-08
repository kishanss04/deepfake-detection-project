# Deepfake Detection Project

This project detects deepfake images using a deep learning model built with TensorFlow and Keras. The application also provides a simple web interface to upload and analyze images for potential deepfakes.

---

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Setup](#setup)
- [Running the Project](#running-the-project)
- [Usage](#usage)
- [Technologies Used](#technologies-used)
- [Screenshots](#screenshots)
- [License](#license)

---

## Features

- Detects deepfake images using a trained deep learning model.
- Simple Flask-based web interface for uploading and analyzing images.
- Visualization of the analysis results.

---

## System Architechture

 ![Alt Text](github_assets/SystemArchitecture.png)



## Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/kishanss04/deepfake-detection.git
   cd deepfake-detection
   ```

2. **Create Virtual Environment**

   ```bash
   python -m venv venv
   venv\Scripts\activate
   ```
3. **Install dependencies in virtual environment**

   ```bash
   pip install -r requirements.txt
   ```
4. **Install Frontend Dependencies**

   ```bash
   cd frontend
   npm install
   ```
   ## Folder and Structure : ensure the structure

```bash
deepfake-detection-project/
│
├── backend/
│   ├── deepfake_detector.py
│   ├── download_model.py
│   ├── main.py
│   ├── package.json
│   ├── package-lock.json
│   └── models/
│       └── deepfake_model.h5
│
├── frontend/
│   ├── package.json
│   ├── package-lock.json
│   └── (Assuming frontend source files here)
│
├── package.json              # Root-level package.json
├── package-lock.json         # Root-level package-lock.json
├── postcss.config.js
└── README.md                 # Project documentation
│
├── datasets/                # Any datasets used for training/testing
│   └── real
|   └── fake                 # Add relevant dataset files
│
├── venv/                    # Virtual environment (can be excluded in `.gitignore`)
│
├── package.json             # Root package.json (if applicable)
├── package-lock.json        # Root package-lock.json (if applicable)
├── postcss.config.js        # PostCSS configuration (if applicable)
├── README.md                # Documentation for the project
└── .gitignore               # To exclude unnecessary files like `venv`, `node_modules`
```
## Download Datasets 

 Download Forensics++ Datasets from kaggle and place : 
 - Original sequences in the folder datasets/real
 - Manipulated sequences in the folder datasets/fake

## Setup
Make sure you have the following installed:

- Python 3.8 or higher
- TensorFlow and Keras for deep learning.
- OpenCV for image processing.

## Running the Project

**Step 1: Activate the virtual environment in the root folder**

```bash
venv\scripts\activate
```
    
**Step 2: Start the Backend**
 1. Open a terminal in the backend folder:

```bash
cd backend
uvicorn main:app --reload
```
 2. The backend should be running at http://127.0.0.1:8000.
   
**Step 3: Start the Frontend in another terminal**
 1. Open a separate terminal in the frontend folder
```bash
cd frontend
npm start
```
 2. The frontend should be running at http://localhost:3000.

## Usage
- Open the frontend in your browser at http://localhost:3000.
- Upload an image and click "Analyze".
- View the deepfake detection results.

  

## License
This project is licensed under the MIT License.













 
