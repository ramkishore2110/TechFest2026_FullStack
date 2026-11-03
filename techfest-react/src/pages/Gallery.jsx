// Gallery - clicking a photo stores it in state and shows it enlarged.
import { useState } from "react";

const photos = [
  "/images/image1.jpg",
  "/images/image2.jpeg",
  "/images/image3.jpg",
  "/images/image4.jpg"
];

export default function Gallery() {
  const [selected, setSelected] = useState(null);

  return (
    <section>
      <h2>Gallery</h2>

      <div className="gallery-grid">
        {photos.map((src, i) => (
          <img
            key={i}
            src={src}
            alt={"Event photo " + (i + 1)}
            className="gallery-img"
            onClick={() => setSelected(src)}
          />
        ))}
      </div>

      {/* Shown only when a photo is selected */}
      {selected && (
        <div className="lightbox" onClick={() => setSelected(null)}>
          <img src={selected} alt="Enlarged view" />
        </div>
      )}
    </section>
  );
}
