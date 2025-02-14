"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
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
  feedbacks?: {
    id: number;
    content: string;
    created_at: string;
    user: { id: number; name: string }
  }[];
}

export default function TaskDetails() {
  const { id } = useParams();
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const response = await api.get<Task>(`/usersbackoffice/tasks/${id}`);
        console.log("Feedbacks recebidos:", response.data.feedbacks); // 👈 LOG PARA DEBUG
        setTask(response.data);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          setError(error.response?.data?.error || "Erro ao carregar a tarefa.");
        } else {
          setError("Erro desconhecido.");
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchTask();
    }
  }, [id]);

  if (loading) return <p className="text-center text-gray-600">Carregando detalhes da tarefa...</p>;
  if (error) return <p className="text-red-500 text-center">{error}</p>;
  if (!task) return <p className="text-gray-500 text-center">Tarefa não encontrada.</p>;

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-200 p-6">
      {/* Card maior contendo os detalhes e o chat */}
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-6xl">
        <h1 className="text-3xl font-bold text-[#7d1bb5] text-center mb-6">{task.title}</h1>

        {/* Layout dividido em 2 colunas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card do lado esquerdo (Feedback Chat) */}
          <div className="bg-gray-100 p-4 rounded-lg shadow-md min-h-[400px] flex flex-col">
            <h2 className="text-2xl font-semibold text-[#7d1bb5] text-center mb-4">Feedback</h2>

            <div className="flex flex-col space-y-3 max-h-[300px] overflow-y-auto p-2">
              {task.feedbacks?.length ? (
                task.feedbacks.map((feedback) => (
                  <div
                    key={feedback.id}
                    className={`p-3 rounded-lg shadow-md w-fit max-w-[80%] ${feedback.user.id === 5 ? "bg-blue-500 text-white self-end" : "bg-gray-200 text-gray-800 self-start"
                      }`}
                  >
                    <p className="text-sm font-semibold">{feedback.user.name}</p>
                    <p className="text-sm">{feedback.content}</p>
                    <p className="text-xs text-gray-500 text-right">{new Date(feedback.created_at).toLocaleString()}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center">Nenhum feedback ainda.</p>
              )}
            </div>


            {/* Input para enviar feedbacks */}
            <div className="flex items-center mt-4">
              <input
                type="text"
                placeholder="Digite seu feedback..."
                className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7d1bb5]"
              />
              <button className="bg-[#7d1bb5] text-white ml-2 px-4 py-2 rounded-lg hover:bg-[#621190] transition">
                Enviar
              </button>
            </div>
          </div>

          {/* Card do lado direito (Informações da Tarefa) */}
          <div className="bg-gray-50 p-6 rounded-lg shadow-md min-h-[400px] flex flex-col justify-between">
            <h2 className="text-2xl font-semibold text-[#7d1bb5] text-center mb-4">Detalhes da Tarefa</h2>

            {/* Informações da Tarefa */}
            <div className="space-y-3">
              <p className="text-gray-800 text-lg"><strong>Descrição:</strong> {task.description}</p>
              <p className="text-gray-800 text-lg"><strong>Professor:</strong> {task.professor.name}</p>
              <p className="text-gray-800 text-lg"><strong>Matéria:</strong> {task.subject.name}</p>
              <p className="text-gray-800 text-lg"><strong>Tópico:</strong> {task.topic.name}</p>
              <p className="text-gray-800 text-lg"><strong>Turma:</strong> {task.class_room.name}</p>
              <p className="text-gray-800 text-lg"><strong>Prazo:</strong> {new Date(task.deadline).toLocaleDateString()}</p>

              {task.file_url && (
                <p className="text-gray-800 text-lg">
                  <strong>Arquivo:</strong>
                  <a href={task.file_url} className="text-blue-500 underline ml-2" target="_blank" rel="noopener noreferrer">
                    Baixar
                  </a>
                </p>
              )}
            </div>

            {/* Botões de ação */}
            <div className="flex justify-center mt-6 space-x-4">
              <button className="bg-blue-500 text-white text-lg font-semibold py-2 px-5 rounded-lg hover:bg-blue-600 transition">
                Iniciar Tarefa
              </button>
              <button className="bg-green-500 text-white text-lg font-semibold py-2 px-5 rounded-lg hover:bg-green-600 transition">
                Concluir Tarefa
              </button>
            </div>

            {/* Botão de Voltar */}
            <div className="flex justify-center mt-4">
              <button onClick={() => window.history.back()} className="text-[#7d1bb5] text-lg font-semibold hover:underline">
                ← Voltar
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
