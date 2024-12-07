import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Agent, PollingStation, VoteCount } from "../types";
import axios from "axios";
import { baseUrl } from "../utils/helpers";

interface Store {
  currentAgent: Agent | null;
  setCurrentAgent: (agent: Agent | null) => void;
  updateVotes: (stationId: string, votes: VoteCount) => void;
  update: (
    stationId: string,
    updates: { candidate_id: number; votes: number }[]
  ) => void;
}

// Mock data - In a real app, this would come from an API
const mockAgents = [
  {
    id: "AGT001",
    name: "John Doe",
    pollingStations: [
      {
        id: "PS001",
        name: "Central School",
        location: "Downtown District",
      },
      {
        id: "PS002",
        name: "Community Center",
        location: "North District",
      },
    ],
  },
  {
    id: "AGT002",
    name: "Jane Smith",
    pollingStations: [
      {
        id: "PS003",
        name: "Public Library",
        location: "East District",
      },
    ],
  },
];

export const useStore = create<Store>()(
  persist(
    (set) => ({
      currentAgent: null,
      setCurrentAgent: (agent) => set({ currentAgent: agent }),
      updateVotes: (stationId, votes) =>
        set((state) => ({
          currentAgent: state.currentAgent
            ? {
                ...state.currentAgent,
                pollingStations: state.currentAgent.pollingStations.map(
                  (station) =>
                    station.station_code === stationId
                      ? { ...station, votes }
                      : station
                ),
              }
            : null,
        })),
      update: (id, result) =>
        set((state) => {
          const updatedPollingStations =
            state.currentAgent?.pollingStations.map((station) => {
              // Check if the station ID matches
              if (station.station_code === id) {
                return {
                  ...station,
                  results: station.results.map((res) => {
                    // Find the matching candidate in the provided result
                    const updatedResult = result.find(
                      (r) => r.candidate_id === res.candidate_id
                    );
                    return updatedResult
                      ? { ...res, votes: updatedResult.votes } // Update the votes
                      : res; // Keep existing result if no match
                  }),
                };
              }
              return station; // Keep other stations unchanged
            });

          return {
            ...state,
            currentAgent: {
              ...state.currentAgent,
              pollingStations: updatedPollingStations,
            },
          };
        }),
    }),
    {
      name: "store",
      getStorage: () => localStorage,
    }
  )
);

export const authenticateAgent = async (agentId: string): Promise<Agent> => {
  try {
    const response = await axios.get(
      `${baseUrl}/get-stations-by-phone/${agentId}`
    );
    return response.data.data;
  } catch (error) {
    return null;
  }
};
