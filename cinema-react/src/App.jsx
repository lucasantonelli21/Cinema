import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import MoviePage from "./features/movie/pages/moviePage.jsx";
import MovieForm from "./features/movie/pages/movieForm.jsx";
import RoomPage from "./features/room/pages/roomPage.jsx";
import RoomForm from "./features/room/pages/roomForm.jsx";
import SessionPage from "./features/session/pages/sessionPage.jsx";
import SessionForm from "./features/session/pages/sessionForm.jsx";
import TicketPage from "./features/ticket/pages/ticketPage.jsx";
import TicketForm from "./features/ticket/pages/ticketForm.jsx";
import IndexPage from "./features/home/pages/indexPage.jsx";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<IndexPage />} />

        {/* Rotas de filmes */}
        <Route path="/filmes" element={<MoviePage />} />
        <Route path="/filmes/formulario" element={<MovieForm />} />
        <Route path="/filmes/formulario/:filmeId" element={<MovieForm />} />

        {/* Rotas de salas */}
        <Route path="/salas" element={<RoomPage />} />
        <Route path="/salas/formulario" element={<RoomForm />} />
        <Route path="/salas/formulario/:salaId" element={<RoomForm />} />

        {/* Rotas de sessões */}
        <Route path="/sessoes" element={<SessionPage />} />
        <Route path="/sessoes/formulario" element={<SessionForm />} />
        <Route path="/sessoes/formulario/:sessaoId" element={<SessionForm />} />

        {/* Rotas de ingressos */}
        <Route path="/ingressos" element={<TicketPage />} />
        <Route path="/ingressos/formulario" element={<TicketForm />} />
        <Route path="/ingressos/formulario/:ingressoId" element={<TicketForm />} />
      </Routes>
    </Router>
  );
}
