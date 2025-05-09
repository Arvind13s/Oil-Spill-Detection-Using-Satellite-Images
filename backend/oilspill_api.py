from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
from PIL import Image
import io

app = Flask(__name__)
CORS(app) 

# Load the model
model = tf.keras.models.load_model("oilspill_model.h5")
labels = ["Non Oil Spill", "Oil Spill"]

# Preprocessing function
def preprocess_image(image_bytes):
    img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    img = img.resize((128, 128))
    img_array = np.array(img) / 255.0
    return img_array.reshape(1, 128, 128, 3)

@app.route("/predict", methods=["POST"])
def predict():
    if 'image' not in request.files:
        return jsonify({"error": "No image file found in request"}), 400

    file = request.files["image"]
    try:
        image_bytes = file.read()
        processed = preprocess_image(image_bytes)
        prediction = model.predict(processed)[0]

        is_oil_spill = prediction[0] > 0.5
        predicted_class = labels[int(is_oil_spill)]
        confidence = float(prediction[0]) if is_oil_spill else 1 - float(prediction[0])

        return jsonify({
            "class": predicted_class,
            "confidence": round(confidence * 100, 2)
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

