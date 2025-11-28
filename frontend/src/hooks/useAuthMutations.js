import { useMutation } from "@tanstack/react-query";
import { loginUser, registerUser } from "../api/apiClient";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export const useLogin = () => {
  const { login } = useAuth();

  const navigate = useNavigate();
  return useMutation({
    mutationFn: loginUser,
    onSuccess: (response) => {
      login(response.data);
      navigate("/");
    },
    onError: (error) => {
      console.error(
        "Login failed:",
        error.response?.data?.message || error.message
      );
    },
  });
};


export const useRegister = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: registerUser,
    onSuccess: (response) => {
      login(response.data);
      navigate("/");
    },
    onError: (error) => {
      console.error(
        "Register failed:",
        error.response?.data?.message || error.message
      );
    },
  });
};
