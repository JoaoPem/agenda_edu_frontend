"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import axios from "axios";

interface Task {
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
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await api.get<Task[]>("/usersbackoffice/tasks");
        setTasks(response.data);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          setError(error.response?.data?.error || "Erro ao buscar as tarefas.");
        } else {
          setError("Erro desconhecido ao carregar as tarefas.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  if (loading) return <p className="text-center text-gray-600">Carregando tarefas...</p>;
  if (error) return <p className="text-red-500 text-center">{error}</p>;

  const getTasksByStatus = (status: string) => tasks.filter((task) => task.status === status);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-200 p-6">
      <div className="bg-[#7d1bb5] p-6 rounded-lg shadow-xl w-full max-w-6xl">
        <h1 className="text-3xl font-bold text-white text-center mb-6">Your Tasks</h1>

        <div className="grid grid-cols-3 gap-6">
          {["novo", "em andamento", "concluído"].map((status, index) => (
            <div key={index} className="bg-white p-4 rounded-lg shadow-md min-h-[400px]">
              <h2 className="text-xl font-semibold text-[#7d1bb5] text-center p-2">
                {status === "novo" ? "Novo" : status === "em andamento" ? "Em andamento" : "Concluído"}
              </h2>
              <div className="space-y-4 p-2 max-h-[300px] overflow-y-auto">
                {getTasksByStatus(status).slice(0, 10).map((task) => (
                  <div
                    key={task.id}
                    onClick={() => router.push(`/tasks/${task.id}`)}
                    className="p-4 bg-white shadow-lg rounded-lg border border-gray-300 cursor-pointer hover:bg-gray-100 transition"
                  >
                    <h3 className="font-bold text-black">{task.title}</h3>
                    <p className="text-black text-sm">Matéria: {task.subject.name}</p>
                    <p className="text-black text-sm">Tópico: {task.topic.name}</p>
                    <p className="text-black text-sm">Prazo: {new Date(task.deadline).toLocaleDateString()}</p>
                  </div>
                ))}
                {getTasksByStatus(status).length === 0 && (
                  <p className="text-gray-500 text-center">Nenhuma tarefa.</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
