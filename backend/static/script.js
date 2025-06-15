function toggleMode() {
  document.body.classList.toggle('dark-mode');
}

function previewImage(event) {
  const preview = document.getElementById('preview-img');
  if (event.target.files && event.target.files[0]) {
    preview.src = URL.createObjectURL(event.target.files[0]);
    preview.style.display = 'block';
  }
}