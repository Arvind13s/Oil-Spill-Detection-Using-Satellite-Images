from flask import Flask, render_template, request, redirect, url_for, jsonify
import os
import sys
import uuid
import numpy as np
import logging
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
from werkzeug.utils import secure_filename
import gdown

sys.stdout.reconfigure(encoding='utf-8')


logging.basicConfig(level=logging.INFO)

app = Flask(__name__)


# Model configuration
MODEL_PATH = "oilspill_model.keras"
GOOGLE_DRIVE_ID = "1hJzPeYvT0FfBbwLSyMlNIAEL4GyqoTAd"

def download_model():
    import gdown
    url = f"https://drive.google.com/uc?id={GOOGLE_DRIVE_ID}"
    gdown.download(url, MODEL_PATH, quiet=False)

if not os.path.exists(MODEL_PATH):
    print("Model file not found. Downloading from Google Drive...")
    download_model()
else:
    print("Model file found. Skipping download.")

# Load model
logging.info(f"Loading model from: {MODEL_PATH}")
model = load_model(MODEL_PATH)

# Upload folder
UPLOAD_FOLDER = os.path.join('backend', 'static', 'uploads')
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Allowed file extensions
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def predict_image(img_path):
    img = image.load_img(img_path, target_size=(224, 224))
    img_tensor = image.img_to_array(img) / 255.0
    img_tensor = np.expand_dims(img_tensor, axis=0)
    prediction = model.predict(img_tensor)
    result = prediction[0][0]
    logging.info(f"Prediction confidence: {result}")
    return 'Oil Spill Detected' if result > 0.5 else 'No Oil Spill Detected'

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/about')
def about():
    return render_template('about.html')

@app.route('/contact')
def contact():
    return render_template('contact.html')

@app.route('/info')
def info():
    return render_template('info.html')

@app.route('/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        logging.warning("No file part in request.")
        return redirect(url_for('home'))

    file = request.files['file']
    if file.filename == '':
        logging.warning("No selected file.")
        return redirect(url_for('home'))

    if file and allowed_file(file.filename):
        filename = f"{uuid.uuid4().hex}_{secure_filename(file.filename)}"
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)

        result = predict_image(filepath)
        image_url = url_for('static', filename='uploads/' + filename)

        # If using JS to display result, use this:
        # return jsonify({'image_path': image_url, 'result': result})

        return render_template('result.html', image_path=image_url, result=result)

    logging.warning("Invalid file type.")
    return redirect(url_for('home'))

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
