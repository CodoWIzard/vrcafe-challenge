export interface Task {
  id: string;
  title: string;
  done: boolean;
  categoryId: string;
}

export interface Category {
  id: string;
  name: string;
  color: string;
}