import React, { useEffect, useState } from "react";
import { baseUrl } from "../utils/helpers";
import axios from "axios";

const ResultPage = () => {
  const [results, setResults] = useState([]);
  useEffect(() => {
    const getData = async () => {
      try {
        const response = await axios.get(`${baseUrl}/get-all-results`);

        setResults(response.data.data);
      } catch {
        console.error("Error fetching votes");
      }
    };

    getData();
  }, []);

  const [searchStation, setSearchStation] = useState("");
  const [filterPhone, setFilterPhone] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [secretCode, setSecretCode] = useState("");

  const itemsPerPage = 20;
  const adminCode = "12345"; // Replace with your secret admin code

  // Calculate total votes for percentage calculation
  const totalVotes = results.reduce((sum, item) => sum + item.votes, 0);

  // Filter the data based on search inputs
  const filteredData = results.filter((item) => {
    const stationMatch = item.poolingStation.station_name
      .toLowerCase()
      .includes(searchStation.toLowerCase());
    const phoneMatch = filterPhone
      ? item.poolingStation.phone.includes(filterPhone)
      : true;
    return stationMatch && phoneMatch;
  });

  // Calculate the total votes and percentages for each candidate
  const partyTotals = filteredData.reduce((acc, entry) => {
    const candidateName = entry.candidate.name;
    acc[candidateName] = (acc[candidateName] || 0) + entry.votes;
    return acc;
  }, {});

  // Calculate percentages
  const partyPercentages = Object.keys(partyTotals).reduce((acc, candidate) => {
    const percentage = totalVotes
      ? ((partyTotals[candidate] / totalVotes) * 100).toFixed(2)
      : 0;
    acc[candidate] = percentage;
    return acc;
  }, {});

  // Paginated data
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handlers for pagination
  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  // Handler for secret code verification
  const handleCodeSubmit = () => {
    if (secretCode === adminCode) {
      setIsAuthorized(true);
    } else {
      alert("Incorrect code. Access denied.");
      setSecretCode("");
    }
  };

  if (!isAuthorized) {
    return (
      <div className="p-8 bg-gray-100 min-h-screen flex justify-center items-center">
        <div className="bg-white p-6 rounded-md shadow-md text-center">
          <h1 className="text-xl font-bold mb-4">Enter Secret Code</h1>
          <input
            type="password"
            placeholder="Enter admin code"
            value={secretCode}
            onChange={(e) => setSecretCode(e.target.value)}
            className="border border-gray-300 p-2 rounded-md w-full mb-4"
          />
          <button
            onClick={handleCodeSubmit}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md"
          >
            Submit
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-center">Election Data</h1>

      {/* Search Section */}
      <div className="bg-white p-4 rounded-md shadow-md mb-4 flex flex-col md:flex-row gap-4">
        <div>
          <label className="block font-semibold text-gray-700 mb-1">
            Search by Polling Station Name:
          </label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-md p-2"
            placeholder="Enter polling station name"
            value={searchStation}
            onChange={(e) => setSearchStation(e.target.value)}
          />
        </div>
        <div>
          <label className="block font-semibold text-gray-700 mb-1">
            Filter by Phone Number:
          </label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-md p-2"
            placeholder="Enter phone number"
            value={filterPhone}
            onChange={(e) => setFilterPhone(e.target.value)}
          />
        </div>
      </div>

      {/* Total Results on Top */}
      <div className="bg-white p-4 rounded-md shadow-md mb-4">
        <h2 className="text-xl font-semibold mb-2">Total Results</h2>
        <ul className="list-disc ml-6">
          {Object.entries(partyTotals).map(([candidateName, totalVotes]) => (
            <li key={candidateName} className="text-gray-700">
              <strong>{candidateName}:</strong> {totalVotes} votes (
              {partyPercentages[candidateName]}%)
            </li>
          ))}
        </ul>
      </div>

      {/* Table for Detailed Data */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300 shadow-md rounded-md">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="px-4 py-2 border-b">Candidate Name</th>
              <th className="px-4 py-2 border-b">Votes</th>
              <th className="px-4 py-2 border-b">Polling Station Name</th>
              <th className="px-4 py-2 border-b">Electoral Area</th>
              <th className="px-4 py-2 border-b">Polling Station Phone</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((item) => (
              <tr key={item.id} className="hover:bg-gray-100">
                <td className="px-4 py-2 border-b">{item.candidate.name}</td>
                <td className="px-4 py-2 border-b">{item.votes}</td>
                <td className="px-4 py-2 border-b">
                  {item.poolingStation.station_name}
                </td>
                <td className="px-4 py-2 border-b">
                  {item.poolingStation.electoral_area}
                </td>
                <td className="px-4 py-2 border-b">
                  {item.poolingStation.phone}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={handlePreviousPage}
          className={`px-4 py-2 rounded-md text-white ${
            currentPage > 1 ? "bg-blue-500 hover:bg-blue-600" : "bg-gray-300"
          }`}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span className="text-gray-700">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={handleNextPage}
          className={`px-4 py-2 rounded-md text-white ${
            currentPage < totalPages
              ? "bg-blue-500 hover:bg-blue-600"
              : "bg-gray-300"
          }`}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ResultPage;
