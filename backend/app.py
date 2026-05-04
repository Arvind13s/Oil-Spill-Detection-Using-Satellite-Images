from flask import Flask, render_template, request, redirect, url_for, jsonify
import os
import sys
import uuid
import json
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
MODEL_PATH = "model.keras"


def download_model():
    import gdown
    file_id = "150jSgmb08L2TujU5RSXxDkV32yqa1v3u"
    url = f"https://drive.google.com/uc?id={file_id}"
    gdown.download(url, MODEL_PATH, quiet=False)

if not os.path.exists(MODEL_PATH):
    print("Model file not found. Downloading from Google Drive...")
    download_model()
else:
    print("Model file found. Skipping download.")

# Load model
logging.info(f"Loading model from: {MODEL_PATH}")

def load_model_safe(model_path):
    """
    Load model with workaround for quantization_config compatibility issues.
    Removes unsupported quantization_config from layer configs before loading.
    """
    try:
        # Try direct load first
        return load_model(model_path, compile=False)
    except (ValueError, TypeError) as e:
        if "quantization_config" in str(e):
            logging.warning("quantization_config compatibility issue detected. Attempting workaround...")
            # Load and strip quantization_config from model config
            import zipfile
            import tempfile
            import shutil
            
            with tempfile.TemporaryDirectory() as tmpdir:
                # Extract keras model (it's a zip file)
                with zipfile.ZipFile(model_path, 'r') as zip_ref:
                    zip_ref.extractall(tmpdir)
                
                # Read config.json
                config_path = os.path.join(tmpdir, 'config.json')
                with open(config_path, 'r') as f:
                    config = json.load(f)
                
                # Recursively remove quantization_config from all layers
                def remove_quantization_config(obj):
                    if isinstance(obj, dict):
                        if 'quantization_config' in obj:
                            del obj['quantization_config']
                        for v in obj.values():
                            remove_quantization_config(v)
                    elif isinstance(obj, list):
                        for item in obj:
                            remove_quantization_config(item)
                
                remove_quantization_config(config)
                
                # Write back modified config
                with open(config_path, 'w') as f:
                    json.dump(config, f)
                
                # Create new zip file
                temp_model_path = model_path + '.tmp'
                with zipfile.ZipFile(temp_model_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
                    for root, dirs, files in os.walk(tmpdir):
                        for file in files:
                            file_path = os.path.join(root, file)
                            arcname = os.path.relpath(file_path, tmpdir)
                            zipf.write(file_path, arcname)
                
                # Load from temp file
                model = load_model(temp_model_path, compile=False)
                
                # Replace original with cleaned version
                os.remove(model_path)
                os.rename(temp_model_path, model_path)
                
                return model
        else:
            raise

try:
    model = load_model_safe(MODEL_PATH)
    logging.info("Model loaded successfully")
except Exception as e:
    # Handle common Keras format errors with a helpful message
    msg = str(e)
    logging.error(f"Error loading model: {msg}")
    if 'File format not supported' in msg or 'Unrecognized keyword arguments passed to Dense' in msg:
        raise RuntimeError(
            "Model deserialization failed due to format/version incompatibility. "
            "Recommended fixes:\n"
            "1) Convert the model to HDF5 (.h5) on a machine that can load it, then upload the .h5 to your model host.\n"
            "   Example (local machine where the model loads):\n"
            "     from tensorflow.keras.models import load_model\n"
            "     m = load_model('model.keras', compile=False)\n"
            "     m.save('model.h5')\n"
            "   Update your deployed app to use model.h5 or replace the Drive file.\n"
            "2) Ensure the deployment environment uses a matching TensorFlow/Keras version that the model was saved with.\n"
            "If you want, I can help convert the model locally if you provide an environment where it loads."
        )
    raise

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
    label = 'Oil Spill Detected' if result > 0.5 else 'No Oil Spill Detected'
    confidence = float(result * 100) if result > 0.5 else float((1 - result) * 100)
    return label, confidence

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

        result, confidence = predict_image(filepath)
        image_url = url_for('static', filename='uploads/' + filename)

        # If using JS to display result, use this:
        # return jsonify({'image_path': image_url, 'result': result, 'confidence': confidence})

        return render_template('result.html', image_path=image_url, result=result, confidence=confidence)

    logging.warning("Invalid file type.")
    return redirect(url_for('home'))

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
