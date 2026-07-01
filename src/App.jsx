import { useState, useRef } from "react";
import html2canvas from "html2canvas";

const FILTERS = [
  { name: "None", css: "none" },
  { name: "B&W", css: "grayscale(100%)" },
  { name: "Warm", css: "sepia(40%) saturate(1.3) brightness(1.05)" },
  { name: "Cool", css: "hue-rotate(20deg) saturate(0.9) brightness(1.05)" },
  { name: "Vintage", css: "sepia(25%) contrast(1.1) brightness(0.95) saturate(0.85)" },
  { name: "Pop", css: "contrast(1.2) saturate(1.5) brightness(1.05)" },
];

const FRAMES = [
  { name: "Classic", bg: "#ffffff", border: "none", radius: "8px", shadow: "0 4px 24px rgba(0,0,0,0.12)", textColor: "#666", subColor: "#999" },
  { name: "Film", bg: "#1a1a1a", border: "none", radius: "4px", shadow: "0 4px 24px rgba(0,0,0,0.3)", textColor: "#888", subColor: "#555" },
  { name: "Polaroid", bg: "#f5f2ea", border: "none", radius: "4px", shadow: "0 6px 28px rgba(0,0,0,0.15)", textColor: "#8a7e6b", subColor: "#b0a48e" },
  { name: "Pink", bg: "#fce4ec", border: "3px solid #f48fb1", radius: "12px", shadow: "0 4px 20px rgba(244,143,177,0.3)", textColor: "#c2185b", subColor: "#e91e63" },
  { name: "Mint", bg: "#e0f2f1", border: "3px solid #80cbc4", radius: "12px", shadow: "0 4px 20px rgba(128,203,196,0.3)", textColor: "#00695c", subColor: "#26a69a" },
];

const LAYOUTS = [
  { name: "Side by side", id: "side" },
  { name: "Grid (2x2)", id: "grid" },
  { name: "Strip (3 rows)", id: "strip" },
];

const STICKERS = ["❤️", "💕", "✨", "🥰", "💋", "🌸", "⭐", "🦋", "🌙", "💫", "🎀", "🍵"];

export default function App() {
  const [photoA, setPhotoA] = useState(null);
  const [photoB, setPhotoB] = useState(null);
  const [step, setStep] = useState("home");
  const [filter, setFilter] = useState(0);
  const [frame, setFrame] = useState(0);
  const [layout, setLayout] = useState(0);
  const [caption, setCaption] = useState("");
  const [date] = useState(new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }));
  const [stickers, setStickers] = useState([]);
  const [addingSticker, setAddingSticker] = useState(null);

  const inputARef = useRef(null);
  const inputBRef = useRef(null);
  const stripRef = useRef(null);

  const handleUpload = (e, side) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      if (side === "A") setPhotoA(ev.target.result);
      else setPhotoB(ev.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleStickerPlace = (e) => {
    if (!addingSticker) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setStickers([...stickers, { emoji: addingSticker, x, y, id: Date.now() }]);
    setAddingSticker(null);
  };

  const removeSticker = (id) => {
    setStickers(stickers.filter((s) => s.id !== id));
  };

  const downloadStrip = async () => {
    const el = stripRef.current;
    if (!el) return;
    try {
      const canvas = await html2canvas(el, { backgroundColor: null, scale: 3, useCORS: true });
      const link = document.createElement("a");
      link.download = `photobooth-${Date.now()}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch {
      alert("Download failed — try screenshotting the strip instead!");
    }
  };

  const currentFrame = FRAMES[frame];
  const currentFilter = FILTERS[filter];
  const currentLayout = LAYOUTS[layout];
  const hasPhotos = photoA && photoB;

  const imgStyle = () => ({
    width: "100%",
    height: "100%",
    objectFit: "cover",
    filter: currentFilter.css,
    display: "block",
  });

  const renderPhotos = () => {
    if (currentLayout.id === "side") {
      return (
        <div style={{ display: "flex", gap: "6px" }}>
          <div style={{ flex: 1, aspectRatio: "1", borderRadius: "4px", overflow: "hidden" }}>
            <img src={photoA} alt="Person 1" style={imgStyle()} />
          </div>
          <div style={{ flex: 1, aspectRatio: "1", borderRadius: "4px", overflow: "hidden" }}>
            <img src={photoB} alt="Person 2" style={imgStyle()} />
          </div>
        </div>
      );
    }
    if (currentLayout.id === "grid") {
      return (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px" }}>
          <div style={{ aspectRatio: "1", borderRadius: "4px", overflow: "hidden" }}>
            <img src={photoA} alt="" style={imgStyle()} />
          </div>
          <div style={{ aspectRatio: "1", borderRadius: "4px", overflow: "hidden" }}>
            <img src={photoB} alt="" style={imgStyle()} />
          </div>
          <div style={{ aspectRatio: "1", borderRadius: "4px", overflow: "hidden" }}>
            <img src={photoB} alt="" style={{ ...imgStyle(), transform: "scaleX(-1)" }} />
          </div>
          <div style={{ aspectRatio: "1", borderRadius: "4px", overflow: "hidden" }}>
            <img src={photoA} alt="" style={{ ...imgStyle(), transform: "scaleX(-1)" }} />
          </div>
        </div>
      );
    }
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        <div style={{ display: "flex", gap: "6px" }}>
          <div style={{ flex: 1, aspectRatio: "1", borderRadius: "4px", overflow: "hidden" }}>
            <img src={photoA} alt="" style={imgStyle()} />
          </div>
          <div style={{ flex: 1, aspectRatio: "1", borderRadius: "4px", overflow: "hidden" }}>
            <img src={photoB} alt="" style={imgStyle()} />
          </div>
        </div>
        <div style={{ display: "flex", gap: "6px" }}>
          <div style={{ flex: 1, aspectRatio: "1", borderRadius: "4px", overflow: "hidden" }}>
            <img src={photoB} alt="" style={{ ...imgStyle(), transform: "scaleX(-1)" }} />
          </div>
          <div style={{ flex: 1, aspectRatio: "1", borderRadius: "4px", overflow: "hidden" }}>
            <img src={photoA} alt="" style={{ ...imgStyle(), transform: "scaleX(-1)" }} />
          </div>
        </div>
        <div style={{ display: "flex", gap: "6px" }}>
          <div style={{ flex: 1, aspectRatio: "1", borderRadius: "4px", overflow: "hidden" }}>
            <img src={photoA} alt="" style={imgStyle()} />
          </div>
          <div style={{ flex: 1, aspectRatio: "1", borderRadius: "4px", overflow: "hidden" }}>
            <img src={photoB} alt="" style={imgStyle()} />
          </div>
        </div>
      </div>
    );
  };

  if (step === "edit" && hasPhotos) {
    return (
      <div style={{ minHeight: "100vh", background: "#0a0a0a", display: "flex", flexDirection: "column", alignItems: "center", padding: "24px 16px", fontFamily: "'Inter', -apple-system, sans-serif", color: "#fff" }}>
        <p style={{ fontSize: "12px", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "20px", opacity: 0.5 }}>Customize your strip</p>

        <div
          ref={stripRef}
          onClick={handleStickerPlace}
          style={{
            background: currentFrame.bg,
            border: currentFrame.border,
            borderRadius: currentFrame.radius,
            boxShadow: currentFrame.shadow,
            padding: currentFrame.name === "Polaroid" ? "10px 10px 40px" : "10px",
            width: "280px",
            maxWidth: "90vw",
            cursor: addingSticker ? "crosshair" : "default",
            position: "relative",
            transition: "all 0.3s",
          }}
        >
          {renderPhotos()}
          <p style={{ textAlign: "center", fontSize: "11px", marginTop: "10px", color: currentFrame.textColor, fontStyle: "italic", margin: "10px 0 2px" }}>
            {caption || "miles apart, close at heart"}
          </p>
          <p style={{ textAlign: "center", fontSize: "9px", color: currentFrame.subColor, letterSpacing: "1px", margin: 0 }}>
            {date}
          </p>
          {stickers.map((s) => (
            <span
              key={s.id}
              onClick={(e) => { e.stopPropagation(); removeSticker(s.id); }}
              style={{ position: "absolute", left: `${s.x}%`, top: `${s.y}%`, fontSize: "22px", transform: "translate(-50%, -50%)", cursor: "pointer", userSelect: "none" }}
            >
              {s.emoji}
            </span>
          ))}
        </div>

        <div style={{ width: "300px", maxWidth: "90vw", marginTop: "20px" }}>
          <p style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "1.5px", opacity: 0.4, marginBottom: "8px" }}>Layout</p>
          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "16px" }}>
            {LAYOUTS.map((l, i) => (
              <button key={l.id} onClick={() => setLayout(i)} style={{ padding: "6px 14px", borderRadius: "16px", fontSize: "12px", background: i === layout ? "#fff" : "rgba(255,255,255,0.07)", color: i === layout ? "#0a0a0a" : "#888", border: "none", cursor: "pointer", transition: "all 0.2s" }}>
                {l.name}
              </button>
            ))}
          </div>

          <p style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "1.5px", opacity: 0.4, marginBottom: "8px" }}>Filter</p>
          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "16px" }}>
            {FILTERS.map((f, i) => (
              <button key={f.name} onClick={() => setFilter(i)} style={{ padding: "6px 14px", borderRadius: "16px", fontSize: "12px", background: i === filter ? "#fff" : "rgba(255,255,255,0.07)", color: i === filter ? "#0a0a0a" : "#888", border: "none", cursor: "pointer", transition: "all 0.2s" }}>
                {f.name}
              </button>
            ))}
          </div>

          <p style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "1.5px", opacity: 0.4, marginBottom: "8px" }}>Frame</p>
          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "16px" }}>
            {FRAMES.map((f, i) => (
              <button key={f.name} onClick={() => setFrame(i)} style={{ padding: "6px 14px", borderRadius: "16px", fontSize: "12px", background: i === frame ? "#fff" : "rgba(255,255,255,0.07)", color: i === frame ? "#0a0a0a" : "#888", border: "none", cursor: "pointer", transition: "all 0.2s" }}>
                {f.name}
              </button>
            ))}
          </div>

          <p style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "1.5px", opacity: 0.4, marginBottom: "8px" }}>
            Stickers {addingSticker && <span style={{ color: "#f48fb1", textTransform: "none", letterSpacing: 0 }}>— tap strip to place</span>}
          </p>
          <div style={{ display: "flex", gap: "5px", flexWrap: "wrap", marginBottom: "16px" }}>
            {STICKERS.map((s) => (
              <button key={s} onClick={() => setAddingSticker(s)} style={{ width: "36px", height: "36px", borderRadius: "8px", fontSize: "18px", background: addingSticker === s ? "rgba(244,143,177,0.2)" : "rgba(255,255,255,0.05)", border: addingSticker === s ? "1px solid #f48fb1" : "1px solid transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {s}
              </button>
            ))}
          </div>

          <p style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "1.5px", opacity: 0.4, marginBottom: "8px" }}>Caption</p>
          <input
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="miles apart, close at heart"
            style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", fontSize: "13px", outline: "none", boxSizing: "border-box" }}
          />
        </div>

        <div style={{ display: "flex", gap: "10px", marginTop: "24px", marginBottom: "24px" }}>
          <button onClick={() => setStep("home")} style={{ padding: "12px 20px", borderRadius: "24px", background: "transparent", border: "1px solid rgba(255,255,255,0.15)", color: "#aaa", fontSize: "13px", cursor: "pointer" }}>
            ← Back
          </button>
          <button onClick={downloadStrip} style={{ padding: "12px 28px", borderRadius: "24px", background: "linear-gradient(135deg, #f48fb1, #ce93d8)", border: "none", color: "#fff", fontSize: "13px", fontWeight: "600", cursor: "pointer", letterSpacing: "0.5px" }}>
            Save strip ↓
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "24px 16px", fontFamily: "'Inter', -apple-system, sans-serif", color: "#fff" }}>
      <input ref={inputARef} type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => handleUpload(e, "A")} />
      <input ref={inputBRef} type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => handleUpload(e, "B")} />

      <div style={{ textAlign: "center", marginBottom: "32px" }}>
        <p style={{ fontSize: "28px", marginBottom: "4px" }}>📸</p>
        <h1 style={{ fontSize: "20px", fontWeight: "300", letterSpacing: "4px", textTransform: "uppercase", margin: "0 0 6px" }}>
          Together
        </h1>
        <p style={{ fontSize: "12px", opacity: 0.4, fontStyle: "italic", margin: 0 }}>
          a photobooth for two, wherever you are
        </p>
      </div>

      <div style={{ display: "flex", gap: "14px", marginBottom: "28px", alignItems: "center" }}>
        <div
          onClick={() => inputARef.current?.click()}
          style={{
            width: "140px", height: "175px", borderRadius: "12px",
            background: photoA ? "none" : "rgba(255,255,255,0.03)",
            border: photoA ? "2px solid rgba(255,255,255,0.1)" : "2px dashed rgba(255,255,255,0.12)",
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            cursor: "pointer", overflow: "hidden", position: "relative", transition: "all 0.2s",
          }}
        >
          {photoA ? (
            <>
              <img src={photoA} alt="Person 1" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "6px", background: "linear-gradient(transparent, rgba(0,0,0,0.7))", textAlign: "center" }}>
                <span style={{ fontSize: "10px", opacity: 0.8 }}>tap to change</span>
              </div>
            </>
          ) : (
            <>
              <span style={{ fontSize: "32px", marginBottom: "8px", opacity: 0.2 }}>🤳</span>
              <span style={{ fontSize: "12px", opacity: 0.3, fontWeight: "500" }}>Person 1</span>
              <span style={{ fontSize: "10px", opacity: 0.2, marginTop: "4px" }}>tap to upload</span>
            </>
          )}
        </div>

        <span style={{ fontSize: "16px", opacity: 0.2 }}>♥</span>

        <div
          onClick={() => inputBRef.current?.click()}
          style={{
            width: "140px", height: "175px", borderRadius: "12px",
            background: photoB ? "none" : "rgba(255,255,255,0.03)",
            border: photoB ? "2px solid rgba(255,255,255,0.1)" : "2px dashed rgba(255,255,255,0.12)",
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            cursor: "pointer", overflow: "hidden", position: "relative", transition: "all 0.2s",
          }}
        >
          {photoB ? (
            <>
              <img src={photoB} alt="Person 2" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "6px", background: "linear-gradient(transparent, rgba(0,0,0,0.7))", textAlign: "center" }}>
                <span style={{ fontSize: "10px", opacity: 0.8 }}>tap to change</span>
              </div>
            </>
          ) : (
            <>
              <span style={{ fontSize: "32px", marginBottom: "8px", opacity: 0.2 }}>🤳</span>
              <span style={{ fontSize: "12px", opacity: 0.3, fontWeight: "500" }}>Person 2</span>
              <span style={{ fontSize: "10px", opacity: 0.2, marginTop: "4px" }}>tap to upload</span>
            </>
          )}
        </div>
      </div>

      {hasPhotos ? (
        <button
          onClick={() => setStep("edit")}
          style={{
            padding: "14px 36px", borderRadius: "28px",
            background: "linear-gradient(135deg, #f48fb1, #ce93d8)",
            border: "none", color: "#fff", fontSize: "14px", fontWeight: "600",
            cursor: "pointer", letterSpacing: "1px",
          }}
        >
          Create strip ✨
        </button>
      ) : (
        <p style={{ fontSize: "11px", opacity: 0.25, textAlign: "center", maxWidth: "240px", lineHeight: "1.6" }}>
          Upload a photo for each person, then create your strip together — even from different cities.
        </p>
      )}

      {(photoA || photoB) && !hasPhotos && (
        <p style={{ fontSize: "11px", opacity: 0.35, marginTop: "8px", fontStyle: "italic" }}>
          {photoA ? "waiting for person 2..." : "waiting for person 1..."}
        </p>
      )}
    </div>
  );
}
