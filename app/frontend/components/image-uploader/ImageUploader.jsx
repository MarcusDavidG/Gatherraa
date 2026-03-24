import React, { useState, useRef } from "react";
import ImagePreview from "./ImagePreview";

const ImageUploader = ({ onUpload }) => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [progress, setProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const inputRef = useRef();

  const handleFile = (selectedFile) => {
    if (!selectedFile) return;

    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));

    // Start upload simulation or real upload
    uploadFile(selectedFile);
  };

  const uploadFile = async (file) => {
    if (!onUpload) {
      // Simulate progress if no backend yet
      let progressValue = 0;
      const interval = setInterval(() => {
        progressValue += 10;
        setProgress(progressValue);
        if (progressValue >= 100) clearInterval(interval);
      }, 200);
    } else {
      // Real upload handler passed from parent
      await onUpload(file, setProgress);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    handleFile(droppedFile);
  };

  return (
    <div>
      <div
        style={{
          ...styles.dropzone,
          borderColor: isDragging ? "#16a34a" : "#ccc",
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current.click()}
      >
        <p>Drag & drop an image here, or click to select</p>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          hidden
          onChange={(e) => handleFile(e.target.files[0])}
        />
      </div>

      {preview && (
        <ImagePreview preview={preview} progress={progress} />
      )}
    </div>
  );
};

const styles = {
  dropzone: {
    border: "2px dashed #ccc",
    padding: "30px",
    textAlign: "center",
    cursor: "pointer",
    borderRadius: "10px",
  },
};

export default ImageUploader;