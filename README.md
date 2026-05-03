---
title: Oil Spill Detection
emoji: 🌊
colorFrom: blue
colorTo: green
sdk: docker
pinned: false
---

# Oil Spill Detection Using Satellite Images

This project is a web application that uses deep learning to detect oil spills from satellite images. Users can upload satellite images, and the system predicts whether an oil spill is present using a pre-trained AI model.

##  Features

* **Upload functionality:** Easily upload satellite images for oil spill detection.
* **Instant AI prediction:** Utilizes a fine-tuned, pre-trained VGG16 model.
* **User-friendly interface:** Built with Flask for a seamless web experience.
* **Responsive design:** Optimized for both desktop and mobile viewing.
* **Informational pages:** Includes About, Contact, and Info sections for user guidance.

##  Getting Started

### Prerequisites
- Python 3.8+ (recommended)
- pip

### Model file
The model file (`model.keras`) is not included in the repo because it is large. The application will download it automatically the first time you run the app. The model is hosted on Google Drive (file id: `150jSgmb08L2TujU5RSXxDkV32yqa1v3u`).

Notes about formats and compatibility:
- The app has been updated to use `gdown` with the `uc?id=` download URL.
- The code loads the model with `compile=False` to avoid deserialization issues for some build/optimizer configs.
- `requirements.txt` pins `tensorflow==2.16.0` which is known to work with the provided `.keras` model file.

### Local installation and run (recommended)

1. Create and activate a virtual environment (Windows PowerShell):

```powershell
python -m venv venv
Set-ExecutionPolicy -Scope Process -ExecutionPolicy RemoteSigned
& .\venv\Scripts\Activate.ps1
```

2. Install Python dependencies:

```powershell
pip install --upgrade pip
pip install -r requirements.txt
```

3. Run the app from the `backend` directory so the model is downloaded into that working directory:

```powershell
cd backend
python app.py
```

On first run the app will download `model.keras` into the current directory and then load it. If you updated the model file on Google Drive and want to force a fresh download, remove the local `model.keras` first:

```powershell
del model.keras
python app.py
```

The web UI will be available at `http://127.0.0.1:5000/` by default.

## Usage
Navigate to the homepage of the web application.
Upload a satellite image using the provided form.
Click the "Predict" button to initiate the detection process.
View the AI's prediction results directly on the page.

## About the Model
The oil spill detection model is based on the VGG16 architecture, pre-trained on a massive dataset of images. It has been specifically fine-tuned to detect the visual signatures of oil spills with high accuracy. For deeper technical details, refer to the model documentation (if available in your model/ directory).

## Contributing
Contributions are highly welcome! Please follow these standard steps:
Fork the repository
Create a new branch (git checkout -b feature-branch)
Make your changes
Commit your changes (git commit -m 'Add new feature')
Push to the branch (git push origin feature-branch)
Create a pull request
Please ensure your code follows the existing style and includes appropriate tests.

## Project Structure
Plaintext
OIL-SPILL-DETECTION-USING-SATELLITE-IMAGES/
├── backend/
│   ├── app.py
│   └── model/
│       └── oilspill_model.keras (downloaded automatically)
├── static/
│   ├── images/
│   ├── uploads/
│   ├── script.js
│   └── style.css
├── templates/
│   ├── about.html
│   ├── contact.html
│   ├── index.html
│   ├── info.html
│   └── result.html
├── .gitignore
├── README.md
└── requirements.txt
📄 License
This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments
Flask - The web framework used.
TensorFlow - For building and training the AI model.
VGG16 - The pre-trained model architecture.
