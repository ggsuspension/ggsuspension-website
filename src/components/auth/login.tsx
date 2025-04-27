import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "@/utils/ggAPI";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const user = await loginUser({ username, password });

      if (user && user.role) {
        switch (user.role) {
          case "ADMIN":
            navigate("/dashboard-admin");
            break;
          case "CEO":
            navigate("/ceo-dashboard");
            break;
          case "GUDANG":
            navigate("/list-requests");
            break;
          case "CS":
            navigate("/spareparts");
            break;
          default:
            setError("Invalid role");
        }
      } else {
        setError("Role not found");
      }
    } catch (err: any) {
      setError(err.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-6 rounded shadow-md w-96"
      >
        <h2 className="text-2xl font-bold mb-4">Login</h2>
        <div className="mb-4">
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full border p-2"
            required
          />
        </div>
        <div className="mb-4">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border p-2"
            required
          />
        </div>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <button
          type="submit"
          className="w-full bg-orange-600 text-white p-2 hover:bg-orange-700"
        >
          Login
        </button>
      </form>
    </div>
  );
}
