import React from "react";

const ImagePreview = ({ preview, progress }) => {
  return (
    <div style={styles.container}>
      <img src={preview} alt="preview" style={styles.image} />

      <div style={styles.progressBar}>
        <div
          style={{
            ...styles.progressFill,
            width: `${progress}%`,
          }}
        />
      </div>

      <p>{progress}%</p>
    </div>
  );
};

const styles = {
  container: {
    marginTop: "20px",
  },
  image: {
    width: "100%",
    maxHeight: "300px",
    objectFit: "cover",
    borderRadius: "8px",
  },
  progressBar: {
    marginTop: "10px",
    height: "8px",
    background: "#eee",
    borderRadius: "5px",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    background: "#16a34a",
    transition: "width 0.3s ease",
  },
};

export default ImagePreview;