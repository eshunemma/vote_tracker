import React from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, ClipboardList } from "lucide-react";
import { useStore } from "../store/useStore";

export function PollingStationList() {
  const navigate = useNavigate();
  const currentAgent = useStore((state) => state.currentAgent);

  const handleClick = () => {
    navigate("/all-results");
  };

  if (!currentAgent) {
    navigate("/");
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Welcome, {currentAgent.name}
              </h1>
              <p className="text-gray-600">Your assigned polling stations</p>
            </div>
            <div
              className="flex flex-col items-center hover:cursor-pointer"
              onClick={handleClick}
            >
              <ClipboardList className="h-8 w-8 text-blue-600" />
              <p>View All Results</p>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {currentAgent.pollingStations.map((station) => (
            <div
              key={station.id}
              onClick={() => navigate(`/station/${station.station_code}`)}
              className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {station.station_name}
                  </h2>
                  <div className="flex items-center mt-2 text-gray-600">
                    <MapPin className="h-4 w-4 mr-2" />
                    <p>{station.electoral_area}</p>
                  </div>
                </div>
                {station.results ? (
                  <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                    Votes Recorded
                  </span>
                ) : (
                  <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded">
                    Pending
                  </span>
                )}
              </div>

              {station.results && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="grid grid-cols-2 gap-4">
                    {station.results.map((result) => (
                      <div>
                        <p className="text-sm text-gray-600">
                          {result?.candidate?.name}
                        </p>
                        <p className="text-lg font-semibold">{result?.votes}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
