export type Task = {
  id: string;
  user_id?: string;
  title: string;
  description?: string | null;
  due_date?: string | null;
  priority: "low" | "medium" | "high";
  completed: boolean;
  created_at?: string;
};