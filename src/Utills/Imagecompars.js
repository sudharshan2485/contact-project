import React, { useState } from "react";
import imageCompression from "browser-image-compression";

function ImageCompression() {
  const [image, setImage] = useState(null);

  const handleImage = async (e) => {
    const file = e.target.files[0];

    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 800,
      useWebWorker: true,
    };

    try {
      const compressedFile = await imageCompression(file, options);

      console.log("Original Size:", file.size);
      console.log("Compressed Size:", compressedFile.size);

      setImage(URL.createObjectURL(compressedFile));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <h2>Image Compression</h2>

      <input type="file" onChange={handleImage} />

      {image && (
        <img
          src={image}
          alt="compressed"
          width="300"
        />
      )}
    </div>
  );
}

export default ImageCompression;