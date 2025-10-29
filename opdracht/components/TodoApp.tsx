"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTodos } from "../hooks/useTodos";
import { CategoryForm } from "./CategoryForm";
import { TaskForm } from "./TaskForm";

export const TodoApp = () => {
  const {
    categories,
    tasks,
    addCategory,
    updateCategory,
    deleteCategory,
    addTask,
    updateTask,
    toggleTask,
    deleteTask,
    moveTask,
  } = useTodos();

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, taskId: string) => {
    e.dataTransfer.setData("taskId", taskId);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, categoryId: string) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("taskId");
    if (taskId) moveTask(taskId, categoryId);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const [draggedTask, setDraggedTask] = useState<string | null>(null);

  const handleTouchStart = (taskId: string) => {
    setDraggedTask(taskId);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (draggedTask) {
      const touch = e.touches[0];
      const element = document.elementFromPoint(touch.clientX, touch.clientY);
      const categoryCard = element?.closest("[data-category-id]");

      // Visual feedback for drop zones
      document.querySelectorAll("[data-category-id]").forEach((card) => {
        card.classList.remove("ring-2", "ring-[#34FFB9]");
      });

      if (categoryCard) {
        categoryCard.classList.add("ring-2", "ring-[#34FFB9]");
      }
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (draggedTask) {
      const touch = e.changedTouches[0];
      const element = document.elementFromPoint(touch.clientX, touch.clientY);
      const categoryCard = element?.closest("[data-category-id]");

      if (categoryCard) {
        const categoryId = categoryCard.getAttribute("data-category-id");
        if (categoryId) {
          moveTask(draggedTask, categoryId);
        }
      }

      // Clean up
      document.querySelectorAll("[data-category-id]").forEach((card) => {
        card.classList.remove("ring-2", "ring-[#34FFB9]");
      });

      setDraggedTask(null);
    }
  };
  const [showForm, setShowForm] = useState(false);
  const [editCat, setEditCat] = useState("");
  const [editTask, setEditTask] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    document.body.className = darkMode ? "dark-mode" : "";
  }, [darkMode]);

  return (
    <div
      className={`flex flex-col lg:flex-row min-h-screen transition-all duration-500 ${
        darkMode ? "bg-gray-900" : ""
      }`}
    >
      <div className="lg:hidden flex items-center justify-between p-4 bg-black/20 backdrop-blur-sm border-b border-white/10">
        <img
          src="/image-removebg-preview.png"
          alt="Logo"
          className="w-20 h-12"
        />
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="px-4 py-2 bg-[#34FFB9] text-black font-bold rounded-lg"
        >
          {sidebarOpen ? "Close" : "Menu"}
        </button>
      </div>

      <div
        className={`${
          sidebarOpen ? "block" : "hidden"
        } lg:block w-full lg:w-80 bg-black/20 backdrop-blur-sm border-r border-white/10 p-4 lg:p-6 relative`}
      >
        <img
          src="/image-removebg-preview.png"
          alt="Logo"
          className="hidden lg:block w-40 h-24 mb-8 mx-auto"
        />

        <div className="mb-4 lg:mb-6">
          <button
            onClick={() => setShowForm(!showForm)}
            className="w-full px-4 py-3 bg-[#34FFB9] text-black font-bold rounded-xl hover:bg-[#2ee6a8] hover:scale-105 transition-all duration-200 shadow-lg"
          >
            {showForm ? "Cancel" : "+ Add Category"}
          </button>
        </div>

        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: "spring", damping: 15, stiffness: 300 }}
              className="mb-6"
            >
              <CategoryForm
                onSubmit={(name, color) => {
                  addCategory(name, color);
                  setShowForm(false);
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={() => setDarkMode(!darkMode)}
          className="absolute top-4 right-4 lg:bottom-6 lg:right-6 lg:top-auto w-10 h-10 lg:w-12 lg:h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-all"
        >
          {darkMode ? (
            <span className="text-lg lg:text-2xl">🌙</span>
          ) : (
            <span className="text-lg lg:text-2xl">☀️</span>
          )}
        </button>
      </div>

      <div className="flex-1 p-4 lg:p-6">
        <h2 className="text-xl lg:text-2xl font-bold text-white mb-4 lg:mb-6">
          To Do
        </h2>

        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
          <AnimatePresence>
            {categories.map((cat) => (
              <motion.div
                key={cat.id}
                initial={{ scale: 0, opacity: 0, y: 50 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0, opacity: 0, rotate: 180 }}
                transition={{ type: "spring", damping: 15, stiffness: 300 }}
                className="bg-black/30 backdrop-blur-sm rounded-2xl p-4 lg:p-6 border border-white/10 shadow-xl transition-all"
                data-category-id={cat.id}
                onDrop={(e) => handleDrop(e, cat.id)}
                onDragOver={handleDragOver}
              >
                {editCat === cat.id ? (
                  <CategoryForm
                    initialName={cat.name}
                    initialColor={cat.color}
                    onSubmit={(name, color) => {
                      updateCategory(cat.id, name, color);
                      setEditCat("");
                    }}
                    onCancel={() => setEditCat("")}
                  />
                ) : (
                  <>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-4 h-4 rounded-full shadow-lg"
                          style={{ backgroundColor: cat.color }}
                        />
                        <span className="font-bold text-white text-base lg:text-lg">
                          {cat.name}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setEditCat(cat.id)}
                          className="px-3 py-1 bg-[#34FFB9] text-black font-bold rounded-lg text-sm hover:bg-[#2ee6a8] transition-all"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteCategory(cat.id)}
                          className="px-3 py-1 bg-red-500 text-white font-bold rounded-lg text-sm hover:bg-red-600 transition-all"
                        >
                          Del
                        </button>
                      </div>
                    </div>

                    <TaskForm onSubmit={(title) => addTask(title, cat.id)} />

                    <div className="mt-4 space-y-2">
                      <AnimatePresence>
                        {tasks
                          .filter((t) => t.categoryId === cat.id)
                          .map((task) => (
                            <motion.div
                              key={task.id}
                              initial={{ scale: 0, opacity: 0, x: -50 }}
                              animate={{ scale: 1, opacity: 1, x: 0 }}
                              exit={{ scale: 0, opacity: 0, rotate: 360 }}
                              transition={{
                                type: "spring",
                                damping: 20,
                                stiffness: 400,
                              }}
                              className={`flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10 cursor-move hover:bg-white/10 transition-all ${
                                draggedTask === task.id
                                  ? "opacity-50 scale-95"
                                  : ""
                              }`}
                              draggable
                              onDragStart={(e: any) => handleDragStart(e, task.id)}
                              onTouchStart={() => handleTouchStart(task.id)}
                              onTouchMove={handleTouchMove}
                              onTouchEnd={handleTouchEnd}
                            >
                              {editTask === task.id ? (
                                <TaskForm
                                  initialTitle={task.title}
                                  onSubmit={(title) => {
                                    updateTask(task.id, title);
                                    setEditTask("");
                                  }}
                                  onCancel={() => setEditTask("")}
                                />
                              ) : (
                                <>
                                  <input
                                    type="checkbox"
                                    checked={task.done}
                                    onChange={() => toggleTask(task.id)}
                                    className="w-4 h-4 accent-[#34FFB9]"
                                  />
                                  <span
                                    className={`flex-1 font-bold ${
                                      task.done
                                        ? "line-through text-gray-400"
                                        : "text-white"
                                    }`}
                                  >
                                    {task.title}
                                  </span>
                                  <button
                                    onClick={() => setEditTask(task.id)}
                                    className="px-2 py-1 bg-[#34FFB9] text-black font-bold rounded-lg text-xs hover:bg-[#2ee6a8] transition-all"
                                  >
                                    Edit
                                  </button>
                                  <button
                                    onClick={() => deleteTask(task.id)}
                                    className="px-2 py-1 bg-red-500 text-white font-bold rounded-lg text-xs hover:bg-red-600 transition-all"
                                  >
                                    Del
                                  </button>
                                </>
                              )}
                            </motion.div>
                          ))}
                      </AnimatePresence>
                    </div>
                  </>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
