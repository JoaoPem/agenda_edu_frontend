"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { Task } from "@/models/tasks";
import api from "@/api/axios";

export default function TaskDetails() {
  const { id } = useParams();
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newFeedback, setNewFeedback] = useState(""); // Estado para o novo feedback
  const router = useRouter();

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const response = await api.get<Task>(`/usersbackoffice/tasks/${id}`);
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

  const handleSendFeedback = async () => {
    if (!newFeedback.trim()) return;

    try {
      const response = await api.post(`/usersbackoffice/tasks/${id}/feedbacks`, {
        content: newFeedback,
      });

      if (task) {
        setTask({
          ...task,
          feedbacks: [response.data, ...task.feedbacks],
        });
      }

      setNewFeedback("");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.error || "Erro ao enviar feedback.");
      } else {
        setError("Erro desconhecido ao enviar feedback.");
      }
    }
  };

  if (loading) return <p className="text-center text-gray-600">Carregando detalhes da tarefa...</p>;
  if (error) return <p className="text-red-500 text-center">{error}</p>;
  if (!task) return <p className="text-gray-500 text-center">Tarefa não encontrada.</p>;

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-200 p-6">
      {/* Card maior contendo os detalhes e o chat */}
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-6xl">
        <h1 className="text-3xl font-bold text-[#7d1bb5] text-center mb-6">{task.title}</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card do lado esquerdo (Feedback Chat) */}
          <div className="bg-gray-100 p-4 rounded-lg shadow-md min-h-[400px] flex flex-col">
            <h2 className="text-2xl font-semibold text-[#7d1bb5] text-center mb-4">Feedback</h2>

            {/* Lista de feedbacks */}
            <div className="flex flex-col space-y-3 max-h-[300px] overflow-y-auto p-2">
              {task.feedbacks.map((feedback) => (
                <div key={feedback.id} className="bg-white p-3 rounded-lg shadow-sm">
                  <p className="text-gray-800">
                    <strong>{feedback.user.name}:</strong> {feedback.content}
                  </p>
                  <p className="text-gray-500 text-sm">
                    {new Date(feedback.created_at).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>

            {/* Input para enviar feedbacks */}
            <div className="flex items-center mt-4">
              <input
                type="text"
                placeholder="Digite seu feedback..."
                value={newFeedback}
                onChange={(e) => setNewFeedback(e.target.value)}
                className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7d1bb5]"
              />
              <button
                onClick={handleSendFeedback}
                className="bg-[#7d1bb5] text-white ml-2 px-4 py-2 rounded-lg hover:bg-[#621190] transition"
              >
                Enviar
              </button>
            </div>
          </div>

          {/* Card do lado direito */}
          <div className="bg-gray-50 p-6 rounded-lg shadow-md min-h-[400px] flex flex-col justify-between">
            <h2 className="text-2xl font-semibold text-[#7d1bb5] text-center mb-4">Detalhes da Tarefa</h2>

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

            <div className="flex justify-center mt-6 space-x-4">
              <button className="bg-blue-500 text-white text-lg font-semibold py-2 px-5 rounded-lg hover:bg-blue-600 transition">
                Iniciar Tarefa
              </button>
              <button className="bg-green-500 text-white text-lg font-semibold py-2 px-5 rounded-lg hover:bg-green-600 transition">
                Concluir Tarefa
              </button>
            </div>

            <div className="flex justify-center mt-4">
              <button onClick={() => router.back()} className="text-[#7d1bb5] text-lg font-semibold hover:underline">
                Voltar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}