"use client";

import { useState } from "react";

const colors = ["#ef4444", "#22c55e", "#3b82f6", "#8b5cf6"];

export const CategoryForm = ({
  onSubmit,
  initialName = "",
  initialColor = colors[0],
  onCancel,
}: {
  onSubmit: (name: string, color: string) => void;
  initialName?: string;
  initialColor?: string;
  onCancel?: () => void;
}) => {
  const [name, setName] = useState(initialName);
  const [color, setColor] = useState(initialColor);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        name.trim() && onSubmit(name.trim(), color);
        setName("");
      }}
      className="flex flex-col gap-4 p-6 bg-black/40 backdrop-blur-sm rounded-2xl border border-white/20"
    >
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Category name"
        className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white font-bold placeholder-gray-300 focus:outline-none focus:border-[#34FFB9]"
        required
      />
      <div className="flex gap-3 justify-center">
        {colors.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setColor(c)}
            className={`w-8 h-8 rounded-full border-2 shadow-lg hover:scale-110 transition-all ${
              color === c ? "border-white" : "border-white/30"
            }`}
            style={{ backgroundColor: c }}
          />
        ))}
      </div>
      <div className="flex gap-3">
        <button
          type="submit"
          className="flex-1 py-3 bg-[#34FFB9] text-black font-bold rounded-xl hover:bg-[#2ee6a8] transition-all shadow-lg"
        >
          Save
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-3 bg-white/10 text-white font-bold rounded-xl border border-white/20 hover:bg-white/20 transition-all"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};
