import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Vote, AlertCircle } from "lucide-react";
import { useStore } from "../store/useStore";
import axios from "axios";
import { baseUrl } from "../utils/helpers";

export function VoteCountForm() {
  const { stationId } = useParams();
  const navigate = useNavigate();
  const [stationData, setStationData] = useState([]);
  const { currentAgent, updateVotes,update } = useStore();
  const [votes, setVotes] = useState({ndc:0, npp:0});
  const [error, setError] = useState("");

  useEffect(() => {
    const getVotes = async () => {
      try {
        const response = await axios.get(
          `${baseUrl}/get-by-station/${stationId}`
        );
        setStationData(response?.data?.data);
        const initialVotes = response?.data?.data.reduce((acc, data) => {
          const key = data?.candidate?.id === 1 ? "ndc" : "npp";
          acc[key] = data?.votes || 0;
          return acc;
        }, {});
        setVotes(initialVotes);
      } catch (error) {
        setError("Something Went Wrong");
      }
    };

    getVotes();
    console.log(stationData);
  }, []);

  const station = currentAgent.pollingStations.find(
    (s) => s.station_code === stationId
  );
  if (!station) {
    navigate("/stations");
    return null;
  }

  const handleInput = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setVotes((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.put(`${baseUrl}/updateScore/${stationId}`, {
        ...votes,
      });

      const result = [
        {
          candidate_id: 1,
          votes: Number(votes?.ndc),
        },
        {
          candidate_id: 2,
          votes: Number(votes?.npp),
        },
      ];
      console.log(result);

      update(String(stationId), result)
      navigate("/stations");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {station.station_name}
              </h1>
              <p className="text-gray-600">{station.electoral_area}</p>
            </div>
            <Vote className="h-8 w-8 text-blue-600" />
          </div>

          <form className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {stationData.map((data, index) => (
                <div key={data?.id}>
                  <label className="block text-sm font-medium text-gray-700">
                    {data?.candidate?.name}
                  </label>
                  <input
                    type="number"
                    name={data?.candidate?.id == 1 ? "ndc" : "npp"}
                    onChange={handleInput}
                    value={votes[data?.candidate?.id == 1 ? "ndc" : "npp"] || 0}

                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                    required
                    min="0"
                  />
                </div>
              ))}

              {/* <div>
                <label className="block text-sm font-medium text-gray-700">
                  Candidate 2 Votes
                </label>
                <input
                  type="number"
                  value={votes.candidate2}
                  onChange={(e) =>
                    setVotes((prev) => ({
                      ...prev,
                      candidate2: parseInt(e.target.value) || 0,
                    }))
                  }
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                  required
                  min="0"
                />
              </div> */}
            </div>

            {error && (
              <div className="flex items-center text-red-600 text-sm">
                <AlertCircle className="h-4 w-4 mr-2" />
                {error}
              </div>
            )}

            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => navigate("/stations")}
                className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                // type="submit"
                onClick={(e) => handleSubmit(e)}
                className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Submit Votes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
