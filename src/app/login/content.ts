import Cookies from "js-cookie";
import api from "@/api/axios";

export const handleLogin = async (email: string, password: string, setError: (error: string) => void, setLoading: (loading: boolean) => void) => {
  setLoading(true);
  setError("");

  try {
    const response = await api.post("/login", { user: { email, password } });
    const { token } = response.data;

    Cookies.set("token", token);

    window.location.href = "/tasks";
  } catch (error) {
    setError("Credenciais inválidas. Tente novamente.");
  } finally {
    setLoading(false);
  }
};