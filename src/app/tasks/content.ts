import axios, { isAxiosError } from "axios";
import api from "@/api/axios";
import { Task } from "@/models/tasks";

export const fetchTasks = async (
  setTasks: (task: Task[]) => void,
  setError: (error: string) => void,
  setLoading: (loading: boolean) => void
) => {
  try {
    const response = await api.get<Task[]>("/usersbackoffice/tasks");
    setTasks(response.data);
  } catch (error) {
    if (isAxiosError(error)) {
      setError(error.response?.data?.error || "Erro ao buscar as tarefas.");
    } else {
      setError("Erro desconhecido ao carregar as tarefas.");
    }
  } finally {
    setLoading(false);
  }
};