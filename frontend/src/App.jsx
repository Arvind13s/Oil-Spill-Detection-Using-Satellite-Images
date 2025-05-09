import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "aos/dist/aos.css";
import AOS from "aos";
import "./App.css";

function App() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 1000 });

    const tooltipTriggerList = Array.from(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.forEach((el) => new window.bootstrap.Tooltip(el));
  }, []);

  const showToast = () => {
    const toastEl = document.getElementById("liveToast");
    if (toastEl) {
      const toast = new window.bootstrap.Toast(toastEl);
      toast.show();
    }
  };

  const handleImageChange = (e) => {
    setSelectedImage(e.target.files[0]);
    setPrediction(null);
  };

  const handleSubmit = async () => {
    if (!selectedImage) return;

    const formData = new FormData();
    formData.append("image", selectedImage);
    setLoading(true);
    setPrediction(null);

    try {
      const res = await axios.post("http://localhost:5000/predict", formData);
      const result = {
        class: res.data.class,
        confidence: parseFloat(res.data.confidence).toFixed(2),
        time: new Date().toLocaleString(),
        name: selectedImage.name,
      };
      setPrediction(result);
      setHistory([result, ...history]);
      showToast();
    } catch (err) {
      console.error("Prediction failed", err);
      setPrediction({ error: "Prediction failed. Check server logs." });
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setSelectedImage(null);
    setPrediction(null);
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      {/* NAVBAR */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary sticky-top shadow-sm">
        <div className="container">
          <a className="navbar-brand fw-bold" href="#home">OilVision AI</a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item"><a className="nav-link" href="#home">Home</a></li>
              <li className="nav-item"><a className="nav-link" href="#upload">Upload</a></li>
              <li className="nav-item"><a className="nav-link" href="#about">About</a></li>
            </ul>
          </div>
        </div>
      </nav>

      {/* TOAST */}
      <div className="position-fixed bottom-0 end-0 p-3" style={{ zIndex: 9999 }}>
        <div id="liveToast" className="toast align-items-center text-bg-success border-0" role="alert">
          <div className="d-flex">
            <div className="toast-body">Prediction Successful!</div>
            <button type="button" className="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
          </div>
        </div>
      </div>

      {/* CAROUSEL */}
      <header id="home">
        <div id="oilCarousel" className="carousel slide" data-bs-ride="carousel">
          <div className="carousel-inner">
            <div className="carousel-item active">
              <img src="/1.jpg" className="d-block w-100" style={{ maxHeight: "500px", objectFit: "cover" }} alt="Slide 1" />
              <div className="carousel-caption d-none d-md-block">
                <h2>Satellite Monitoring</h2>
                <p>Detect oil spills from above with high precision.</p>
              </div>
            </div>
            <div className="carousel-item">
              <img src="/2.jpg" className="d-block w-100" style={{ maxHeight: "500px", objectFit: "cover" }} alt="Slide 2" />
              <div className="carousel-caption d-none d-md-block">
                <h2>Real-Time Analysis</h2>
                <p>Instant results from AI-powered models.</p>
              </div>
            </div>
            <div className="carousel-item">
              <img src="/3.jpg" className="d-block w-100" style={{ maxHeight: "500px", objectFit: "cover" }} alt="Slide 3" />
              <div className="carousel-caption d-none d-md-block">
                <h2>Protect Marine Life</h2>
                <p>Early detection helps reduce ecological damage.</p>
              </div>
            </div>
          </div>
          <button className="carousel-control-prev" type="button" data-bs-target="#oilCarousel" data-bs-slide="prev">
            <span className="carousel-control-prev-icon" aria-hidden="true" />
          </button>
          <button className="carousel-control-next" type="button" data-bs-target="#oilCarousel" data-bs-slide="next">
            <span className="carousel-control-next-icon" aria-hidden="true" />
          </button>
        </div>
      </header>

      {/* UPLOAD SECTION */}
      <section id="upload" className="bg-light py-5" data-aos="fade-up">
        <div className="container">
          <h2 className="text-center mb-4 fw-semibold">Upload Image</h2>
          <div className="row justify-content-center">
            <div className="col-md-6 mb-4">
              <div className="card shadow-sm p-4">
                <div
                  className="border border-secondary rounded p-4 text-center bg-light"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    setSelectedImage(e.dataTransfer.files[0]);
                    setPrediction(null);
                  }}
                  style={{ cursor: "pointer" }}
                >
                  <p className="mb-2">Drag & Drop Image Here</p>
                  <p className="text-muted">or click below</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="form-control"
                  />
                </div>

                <button
                  onClick={handleSubmit}
                  className="btn btn-primary mt-3 w-100"
                  disabled={!selectedImage || loading}
                  data-bs-toggle="tooltip"
                  title="Submit the selected image for AI analysis"
                >
                  {loading ? "Predicting..." : "Predict"}
                </button>

                <button
                  onClick={handleClear}
                  className="btn btn-outline-secondary mt-2 w-100"
                  data-bs-toggle="tooltip"
                  title="Clear selected image and result"
                >
                  Clear
                </button>

                {selectedImage && (
                  <div className="mt-4 text-center">
                    <h5>Preview:</h5>
                    <img
                      src={URL.createObjectURL(selectedImage)}
                      alt="Preview"
                      className="img-thumbnail img-fluid"
                      style={{ maxHeight: "250px" }}
                      data-bs-toggle="tooltip"
                      title={selectedImage.name}
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="col-md-6 mb-4">
              <div className="card shadow-sm p-4">
                <h4 className="text-center mb-4">Prediction Result</h4>
                {prediction ? (
                  prediction.error ? (
                    <div className="alert alert-danger">
                      <strong>Error:</strong> {prediction.error}
                    </div>
                  ) : (
                    <div className="text-center">
                      <h5 className="mb-3">
                        <strong>Detected:</strong> {prediction.class}
                      </h5>
                      <p>Confidence:</p>
                      <div className="progress" style={{ height: "25px" }}>
                        <div
                          className={`progress-bar ${
                            prediction.confidence >= 80
                              ? "bg-success"
                              : prediction.confidence >= 50
                              ? "bg-warning"
                              : "bg-danger"
                          }`}
                          role="progressbar"
                          style={{ width: `${prediction.confidence}%` }}
                          aria-valuenow={prediction.confidence}
                          aria-valuemin="0"
                          aria-valuemax="100"
                        >
                          {prediction.confidence}%
                        </div>
                      </div>
                    </div>
                  )
                ) : (
                  <p className="text-center text-muted">
                    Upload an image and click Predict to see results.
                  </p>
                )}

                {history.length > 0 && (
                  <div className="mt-4">
                    <h5 className="text-center">Prediction History</h5>
                    <ul className="list-group">
                      {history.map((item, idx) => (
                        <li
                          key={idx}
                          className="list-group-item d-flex justify-content-between align-items-center"
                        >
                          <span>
                            <strong>{item.class}</strong> ({item.confidence}%)
                            <br />
                            <small className="text-muted">
                              {item.name} at {item.time}
                            </small>
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section id="about" className="bg-white py-5 border-top" data-aos="fade-up">
        <div className="container text-center">
          <h2 className="fw-bold mb-3">About OilVision AI</h2>
          <p className="lead text-muted">
            OilVision AI is a cutting-edge tool powered by deep learning to detect oil spills
            from satellite and drone imagery. It helps governments, companies, and environmental
            organizations monitor oceans more effectively. Your image is analyzed instantly
            using our custom-trained computer vision model.
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-primary text-light text-center py-3 mt-auto">
        <p className="mb-0">&copy; 2025 OilVision AI</p>
      </footer>
    </div>
  );
}

export default App;
