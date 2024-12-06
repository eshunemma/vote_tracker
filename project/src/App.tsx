import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LoginForm } from "./components/LoginForm";
import { PollingStationList } from "./components/PollingStationList";
import { VoteCountForm } from "./components/VoteCountForm";
import { AuthGuard } from "./components/guards/AuthGuard";
import { AppLayout } from "./components/layout/AppLayout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route
          path="/stations"
          element={
            <AppLayout>
              <PollingStationList />
            </AppLayout>
          }
        />
        <Route
          path="/station/:stationId"
          element={
            <AppLayout>
              <VoteCountForm />
            </AppLayout>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
