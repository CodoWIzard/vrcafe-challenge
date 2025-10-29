'use client';

import { useState, useEffect } from 'react';
import { Task, Category } from '../types/todo';

export const useTodos = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const cats = localStorage.getItem('categories');
    const tsks = localStorage.getItem('tasks');
    if (cats) setCategories(JSON.parse(cats));
    if (tsks) setTasks(JSON.parse(tsks));
  }, []);

  useEffect(() => localStorage.setItem('categories', JSON.stringify(categories)), [categories]);
  useEffect(() => localStorage.setItem('tasks', JSON.stringify(tasks)), [tasks]);

  return {
    categories,
    tasks,
    addCategory: (name: string, color: string) =>
      setCategories((prev) => [
        ...prev,
        { id: Date.now().toString(), name, color },
      ]),
    updateCategory: (id: string, name: string, color: string) =>
      setCategories((prev) =>
        prev.map((c) => (c.id === id ? { ...c, name, color } : c))
      ),
    deleteCategory: (id: string) => {
      setCategories((prev) => prev.filter((c) => c.id !== id));
      setTasks((prev) => prev.filter((t) => t.categoryId !== id));
    },
    addTask: (title: string, categoryId: string) =>
      setTasks((prev) => [
        ...prev,
        { id: Date.now().toString(), title, done: false, categoryId },
      ]),
    updateTask: (id: string, title: string) =>
      setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, title } : t))),
    toggleTask: (id: string) =>
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
      ),
    deleteTask: (id: string) =>
      setTasks((prev) => prev.filter((t) => t.id !== id)),
    moveTask: (taskId: string, newCategoryId: string) =>
      setTasks((prev) => prev.map((t) => t.id === taskId ? { ...t, categoryId: newCategoryId } : t)),
  };
};
