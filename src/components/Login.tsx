import { useState, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { LOGIN_URL } from "../contants";
import { setToken } from "../utils";

type LoginInput = {
  name: string;
  password: string;
};

export default function Login() {
  const [error, setError] = useState("");
  const [input, setInput] = useState({ name: "", password: "" });
  const navigate = useNavigate();
  const mutation = useMutation(
    async (input: LoginInput) => {
      const response = await fetch(LOGIN_URL, {
        method: "POST",
        body: JSON.stringify(input),
      });
      if (response.ok) return response.json();
      throw new Error(await response.json());
    },
    {
      onError: (e: Error) => setError(e.message),
      onSuccess: async (json) => {
        if (json && json.token) {
          setToken(json.token);
          navigate("/builder");
        }
      },
    }
  );

  function onChange(e: ChangeEvent<HTMLInputElement>) {
    setError("");
    setInput((old) => ({ ...old, [e.target.name]: e.target.value.trim() }));
  }

  function login() {
    if (input.name.length === 0 || input.password.length === 0) {
      return setError("Name or password can't be empty.");
    }
    mutation.mutate(input);
  }
  return (
    <div className="mt-4 mx-auto max-w-xs">
      <h1 className="text-xl mt-10 text-orange-600 font-medium">
        Login to build your own burgers.
      </h1>
      <div className="space-y-4 mt-6 mb-8">
        <input
          type="text"
          name="name"
          value={input.name}
          onChange={onChange}
          placeholder="Name"
          className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:max-w-xs sm:text-sm"
        />

        <input
          type="password"
          name="password"
          value={input.password}
          onChange={onChange}
          placeholder="Password"
          className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:max-w-xs sm:text-sm"
        />
        {mutation.isLoading ? (
          <p className="text-orange-600 font-medium">Logging in ...</p>
        ) : null}
        <p className="text-red-500 font-medium">{error}</p>
      </div>
      <button
        type="button"
        onClick={login}
        disabled={mutation.isLoading}
        className="block w-full justify-center items-center rounded-md border border-transparent bg-orange-600 px-6 py-1.5 text-lg font-semibold text-white shadow-sm hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:bg-orange-400"
      >
        Login
      </button>
    </div>
  );
}
