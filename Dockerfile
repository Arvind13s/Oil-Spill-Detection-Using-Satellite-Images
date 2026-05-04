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

# Create uploads directory for processed images
RUN mkdir -p backend/static/uploads

# Expose the port (defaults to 7860 for Hugging Face, can be overridden)
ARG PORT=7860
EXPOSE ${PORT}
ENV PORT=${PORT}

# Command to launch the Flask app from the root directory
CMD ["python", "backend/app.py"]
