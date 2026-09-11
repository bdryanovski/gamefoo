import React, { useRef, useCallback } from "react";
import type { AppState, AppAction } from "../types";
import { uploadImage } from "../utils/storage";
import { uid } from "../utils/uid";

interface Props {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

/** Image library tab — manage the multiple source images of the project. */
export function ImageLibraryPanel({ state, dispatch }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = React.useState(false);

  const handleFiles = useCallback(
    async (files: FileList | null) => {
      if (!files || files.length === 0) return;
      setUploading(true);
      try {
        for (const file of Array.from(files)) {
          if (!file.type.startsWith("image/")) continue;
          try {
            const { path, name } = await uploadImage(file);
            const img = new Image();
            await new Promise<void>((resolve, reject) => {
              img.onload = () => resolve();
              img.onerror = () => reject(new Error("load failed"));
              img.src = path;
            });
            dispatch({
              type: "ADD_IMAGE",
              activate: !state.activeImageId,
              image: {
                id: uid("img"),
                url: path,
                name,
                width: img.width,
                height: img.height,
              },
            });
          } catch (e) {
            console.error("Failed to import image:", file.name, e);
          }
        }
      } finally {
        setUploading(false);
      }
    },
    [dispatch, state.activeImageId],
  );

  const spriteCountOf = (imageId: string) =>
    state.sprites.filter((s) => s.imageId === imageId).length;

  return (
    <div className="col gap-md">
      <div className="section">
        <div className="section-title">
          <span>Images ({state.images.length})</span>
          <button
            className="btn btn-sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            {uploading ? "Adding..." : "+ Add Image"}
          </button>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => {
            handleFiles(e.target.files);
            e.target.value = "";
          }}
        />

        {state.images.length === 0 && (
          <div className="p-4 text-dim text-xs">
            No images. Add tileset sheets — cut sprites from them in the
            Sprites tab, then paint with those sprites in the Map Editor.
          </div>
        )}

        {state.images.map((img) => {
          const active = state.activeImageId === img.id;
          return (
            <div
              key={img.id}
              className={`image-item ${active ? "selected" : ""}`}
              onClick={() => dispatch({ type: "SET_ACTIVE_IMAGE", imageId: img.id })}
            >
              <img
                src={img.url}
                alt={img.name}
                className="image-item__thumb"
              />
              <div className="image-item__info">
                <div className="image-item__name">{img.name}</div>
                <div className="image-item__meta">
                  {img.width}×{img.height}px · {spriteCountOf(img.id)} sprites
                </div>
              </div>
              {active && <span className="image-item__badge">active</span>}
              <button
                className="btn btn-sm danger"
                title="Remove image and all its sprites"
                onClick={(e) => {
                  e.stopPropagation();
                  if (
                    confirm(
                      `Remove "${img.name}" and its ${spriteCountOf(img.id)} sprite(s)?`,
                    )
                  ) {
                    dispatch({ type: "REMOVE_IMAGE", imageId: img.id });
                  }
                }}
              >
                Del
              </button>
            </div>
          );
        })}
      </div>

      <div className="section">
        <div className="section-title">How it works</div>
        <div className="text-xs text-dim" style={{ padding: 4 }}>
          <div>1. Add one or more tileset/spritesheet images.</div>
          <div>
            2. Select an image and cut sprites with Grid Pick (G) or Region
            (R) on the canvas.
          </div>
          <div>3. Group sprites into animations and game objects.</div>
          <div>
            4. Switch to the Map Editor — every sprite is available in the
            palette to build screens.
          </div>
        </div>
      </div>
    </div>
  );
}
