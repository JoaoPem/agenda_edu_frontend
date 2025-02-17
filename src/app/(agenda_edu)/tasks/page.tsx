"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Task } from "@/models/tasks";
import { fetchTasks } from "./content";

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetchTasks(setTasks, setError, setLoading);
  }, []);

  const getTasksByStatus = (status: string) => {
    return tasks.filter((task) => task.status === status);
  };

  if (loading) return <p className="text-center text-gray-600">Carregando tarefas...</p>;
  if (error) return <p className="text-red-500 text-center">{error}</p>;

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-200 p-6">
      <div className="bg-[#7d1bb5] p-6 rounded-lg shadow-xl w-full max-w-6xl">
        <h1 className="text-3xl font-bold text-white text-center mb-6">Your Tasks</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {["novo", "em_progresso", "concluido"].map((status, index) => (
            <div key={index} className="bg-white p-4 rounded-lg shadow-md min-h-[400px]">
              <h2 className="text-xl font-semibold text-[#7d1bb5] text-center p-2">
                {(status.toUpperCase())}
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