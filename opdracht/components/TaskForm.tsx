"use client";

import { useState } from "react";

export const TaskForm = ({
  onSubmit,
  initialTitle = "",
  onCancel,
}: {
  onSubmit: (title: string) => void;
  initialTitle?: string;
  onCancel?: () => void;
}) => {
  const [title, setTitle] = useState(initialTitle);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        title.trim() && onSubmit(title.trim());
        setTitle("");
      }}
      className="flex gap-3"
    >
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Task title"
        className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white font-bold placeholder-gray-300 focus:outline-none focus:border-[#34FFB9]"
        required
      />
      <button
        type="submit"
        className="px-4 py-2 bg-[#34FFB9] text-black font-bold rounded-lg hover:bg-[#2ee6a8] transition-all shadow-lg"
      >
        Add
      </button>
      {onCancel && (
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-white/10 text-white font-bold rounded-lg border border-white/20 hover:bg-white/20 transition-all"
        >
          Cancel
        </button>
      )}
    </form>
  );
};
