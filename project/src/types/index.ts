export interface Agent {
  id: string;
  name: string;
  pollingStations: PollingStation[];
}

export interface PollingStation {
  id: string;
  station_name: string;
  station_code: string;
  electoral_area: string;
  results: Results[];
}

export interface Results {
  id: number;
  pooling_station_id: string;
  votes: number;
  candidate_id: number;
  candidate: Candidate;
}

export interface Candidate {
  id: number;
  name: string;
}
