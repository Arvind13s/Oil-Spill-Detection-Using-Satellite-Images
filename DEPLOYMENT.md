# Deployment Checklist for Hugging Face

## ✓ Pre-deployment Verification

### Environment & Config
- [x] `runtime.txt` - Python 3.10.13
- [x] `requirements.txt` - TensorFlow 2.17.0, gdown, Flask, Pillow, werkzeug
- [x] `Dockerfile` - Correct user (1000), correct port (7860), correct entrypoint
- [x] `render.yaml` - PORT set to 7860 (consistent with Dockerfile)

### Application Code
- [x] `backend/app.py` - Upload folder path fixed (uses `static/uploads` not `backend/static/uploads`)
- [x] Model loading - Auto-cleans `quantization_config` issues, maintains `.keras` format
- [x] All routes defined - `/`, `/about`, `/contact`, `/info`, `/predict`
- [x] Error handling - Proper logging and error messages

### File Structure
- [x] `backend/templates/` - All 5 HTML templates present
- [x] `backend/static/` - style.css, script.js, images/ directory
- [x] `backend/static/uploads/` - Directory created for user uploads

### Model Handling
- [x] Model auto-downloads from Google Drive on first run
- [x] File ID: `150jSgmb08L2TujU5RSXxDkV32yqa1v3u`
- [x] Model saved as `model.keras` in working directory
- [x] Quantization config auto-cleaned if needed

## Deployment Steps

### For Hugging Face Spaces:
1. Connect your GitHub repository
2. Create a new Space with Docker runtime
3. Point to this repository
4. Set environment variable: `PORT=7860` (optional, defaults to 7860)
5. Deploy

### Expected Behavior:
- App starts on `http://localhost:7860` or assigned HF URL
- First run downloads model (~215 MB) from Google Drive
- Auto-fixes model config if needed
- Accepts image uploads (PNG, JPG, JPEG, GIF)
- Returns oil spill prediction with confidence

## Troubleshooting

**Model fails to load:**
- Check Google Drive file ID is accessible
- Verify gdown is installed (included in requirements.txt)
- Check logs for `quantization_config` issues (auto-fixed)

**Upload folder not found:**
- App must be run from `backend/` directory or root with correct path
- Dockerfile ensures correct working directory

**Port issues:**
- Dockerfile exposes port 7860 for Hugging Face
- render.yaml uses port 7860
- Both must match

## Notes
- `.keras` format retained (not converted to .h5)
- Model file ignored by git (.gitignore updated)
- Auto-cleans Keras version incompatibilities on first load
