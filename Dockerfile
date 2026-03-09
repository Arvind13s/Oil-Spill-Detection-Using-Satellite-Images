# Use Python 3.10 as the base image
FROM python:3.10-slim

# Create a non-root user (Hugging Face runs Docker containers as user 1000)
RUN useradd -m -u 1000 user
USER user

# Set home and path environment variables
ENV HOME=/home/user \
    PATH=/home/user/.local/bin:$PATH

# Set the working directory inside the container
WORKDIR $HOME/app

# Copy requirements and install them securely as the 'user'
COPY --chown=user:user requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the project files with the correct ownership
COPY --chown=user:user . .

# Ensure the model directory exists so the app can download and save the .h5 file without errors
RUN mkdir -p backend/model

# Expose the mandatory port for Hugging Face
EXPOSE 7860
ENV PORT=7860

# Command to launch the Flask app from the root directory
CMD ["python", "backend/app.py"]
