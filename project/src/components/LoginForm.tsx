import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserCircle2 } from "lucide-react";
import { useStore, authenticateAgent } from "../store/useStore";

export function LoginForm() {
  const [agentId, setAgentId] = useState("");
  const [error, setError] = useState("");
  const setCurrentAgent = useStore((state) => state.setCurrentAgent);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const agent = await authenticateAgent(agentId);

    if (agent) {
      setCurrentAgent(agent);
      navigate("/stations");
    } else {
      setError("Invalid agent ID. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <div className="flex flex-col items-center mb-8">
          <UserCircle2 className="h-16 w-16 text-blue-600 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900">Agent Login</h2>
          <p className="text-gray-600 mt-2">
            Enter your ID to access your assigned polling stations
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="agentId"
              className="block text-sm font-medium text-gray-700"
            >
              Agent ID
            </label>
            <input
              id="agentId"
              type="text"
              value={agentId}
              onChange={(e) => setAgentId(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              placeholder="Enter your agent ID"
              required
            />
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Login
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          <p>Demo Agent IDs: AGT001, AGT002</p>
        </div>
      </div>
    </div>
  );
}
