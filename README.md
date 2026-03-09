---
title: Oil Spill Detection
emoji: 🌊
colorFrom: blue
colorTo: aqua
sdk: docker
pinned: false
---

# Oil Spill Detection Using Satellite Images

This project is a web application that uses deep learning to detect oil spills from satellite images. Users can upload satellite images, and the system predicts whether an oil spill is present using a pre-trained AI model.

## 🌟 Features

* **Upload functionality:** Easily upload satellite images for oil spill detection.
* **Instant AI prediction:** Utilizes a fine-tuned, pre-trained VGG16 model.
* **User-friendly interface:** Built with Flask for a seamless web experience.
* **Responsive design:** Optimized for both desktop and mobile viewing.
* **Informational pages:** Includes About, Contact, and Info sections for user guidance.

## 🚀 Getting Started

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


## Getting Started

### Prerequisites

- Python 3.7+
- pip

### Model File

The model file (`model.h5`) is **not included** in the repository due to its large size.  
It will be **automatically downloaded from Google Drive** when you run the app for the first time.

- [Google Drive Model Link](https://drive.google.com/file/d/149IVm9HlsDSzJcir9dYWqkmQAMd_IUdB/view?usp=drive_link)

### Installation

1. **Clone the repository:**
   ```sh
   git clone https://github.com/Arvind13s/oil-spill-detection.git
   cd oil-spill-detection-using-satellite-images
   ```
2. **Install the required packages:**
   ```sh
   pip install -r requirements.txt
   ```
3. **Run the Flask app:**
   ```sh
   python backend/app.py
   ```
   - On first run, the app will automatically download the model file from Google Drive if it is not present.
   - The app will be accessible at `http://127.0.0.1:5000/`.

## Usage

1. Go to the homepage of the web application.
2. Upload a satellite image using the provided form.
3. Click on the "Predict" button to detect oil spills.
4. View the prediction results on the same page.

## About the Model

The oil spill detection model is based on the VGG16 architecture, pre-trained on a large dataset of images. It has been fine-tuned to detect oil spills with high accuracy. For more details, refer to the [model documentation](model/README.md).

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a new branch (`git checkout -b feature-branch`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add new feature'`)
5. Push to the branch (`git push origin feature-branch`)
6. Create a pull request

Please ensure your code follows the existing style and includes appropriate tests.

## 📁 Project Structure

OIL-SPILL-DETECTION-USING-SATELLITE-IMAGES/
├── backend/
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
├── backend/app.py
├── .gitignore
├── README.md
└── requirements.txt

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Flask](https://flask.palletsprojects.com/) - The web framework used
- [TensorFlow](https://www.tensorflow.org/) - For building and training the AI model
- [VGG16](https://arxiv.org/abs/1409.1556) - The pre-trained model architecture

Developed by:  
Arvind Singh
