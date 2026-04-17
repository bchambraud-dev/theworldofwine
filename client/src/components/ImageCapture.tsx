import { useRef } from "react";

// Reusable image capture component.
// Primary action: opens camera (capture="environment").
// Secondary action: opens gallery/file picker (no capture attribute).
// Both return the same file via onChange.

interface ImageCaptureProps {
  onImageSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  /** Render prop — receives { openCamera, openGallery } */
  children: (actions: { openCamera: () => void; openGallery: () => void }) => React.ReactNode;
}

export default function ImageCapture({ onImageSelect, children }: ImageCaptureProps) {
  const cameraRef = useRef<HTMLInputElement>(null);
  const galleryRef = useRef<HTMLInputElement>(null);

  const openCamera = () => {
    if (cameraRef.current) {
      cameraRef.current.value = "";
      cameraRef.current.click();
    }
  };

  const openGallery = () => {
    if (galleryRef.current) {
      galleryRef.current.value = "";
      galleryRef.current.click();
    }
  };

  return (
    <>
      {/* Camera input (opens camera app directly on mobile) */}
      <input
        ref={cameraRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={onImageSelect}
        style={{ display: "none" }}
      />
      {/* Gallery input (opens file picker / photo gallery) */}
      <input
        ref={galleryRef}
        type="file"
        accept="image/*"
        onChange={onImageSelect}
        style={{ display: "none" }}
      />
      {children({ openCamera, openGallery })}
    </>
  );
}

// Small gallery icon SVG for inline use
export function GalleryIcon({ size = 18, color = "#5A5248" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <polyline points="21 15 16 10 5 21" />
    </svg>
  );
}

// Camera icon SVG for inline use
export function CameraIcon({ size = 18, color = "#5A5248" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  );
}
