title: Oil Spill Detection
colorFrom: blue
colorTo: aqua
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
* Python 3.7+
* pip

### Model File Note
The core model file (`model.h5`) is **not included** in this repository due to its large size. It will be **automatically downloaded from Google Drive** when you run the app for the first time. 
* [View Google Drive Model Link](https://drive.google.com/file/d/149IVm9HlsDSzJcir9dYWqkmQAMd_IUdB/view?usp=drive_link)

### Local Installation

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/Arvind13s/oil-spill-detection.git](https://github.com/Arvind13s/oil-spill-detection.git)
   cd oil-spill-detection-using-satellite-images
Install the required packages:

Bash
pip install -r requirements.txt
Run the Flask app:

Bash
python backend/app.py
Note: On the first run, the app will automatically download the model file from Google Drive. Locally, the app will typically be accessible at http://127.0.0.1:5000/.

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
│       └── oilspill_model.h5 (downloaded automatically)
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
