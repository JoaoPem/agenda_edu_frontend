export interface Task {
  id: number;
  professor: { name: string };
  title: string;
  description: string;
  deadline: string;
  class_room: { name: string };
  subject: { name: string };
  topic: { name: string };
  file_url: string;
  status: string;
  feedbacks: Feedback[];
}

export interface Feedback {
  id: number;
  content: string;
  created_at: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
}