import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom";
import BlankLayout from "../../../components/layouts/blank";
import Table from "../../../components/tables/table";
import Button from "../../../components/buttons/Button";
import { Sessao } from "../../../models/sessao";
import { Filme } from "../../../models/filme";
import { Sala } from "../../../models/sala";

export default function SessionPage() {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState([]);
  const [movies, setMovies] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Carregar todos os dados em paralelo
      const [sessionsData, moviesData, roomsData] = await Promise.all([
        Sessao.getAll(),
        Filme.getAll(),
        Sala.getAll()
      ]);
      
      setSessions(sessionsData);
      setMovies(moviesData);
      setRooms(roomsData);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      setError('Erro ao carregar dados. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleAddNewSession = () => {
    navigate('/sessoes/formulario');
  };

  const handleEditSession = (sessionId) => {
    navigate(`/sessoes/formulario/${sessionId}`);
  };

  const handleDeleteSession = async (sessionId) => {
    if (window.confirm("Tem certeza que deseja excluir esta sessão?")) {
      try {
        const success = await Sessao.delete(sessionId);
        if (success) {
          alert('Sessão excluída com sucesso!');
          await loadAllData(); // Recarregar dados
        } else {
          alert('Erro ao excluir sessão. Tente novamente.');
        }
      } catch (error) {
        console.error('Erro ao excluir sessão:', error);
        alert('Erro ao excluir sessão. Tente novamente.');
      }
    }
  };

  // Função para buscar o nome do filme pelo ID
  const getMovieTitle = (movieId) => {
    const movie = movies.find(m => m.id === movieId);
    return movie ? movie.title : 'Filme não encontrado';
  };

  // Função para buscar informações da sala pelo ID (sem o .number)
  const getRoomInfo = (roomId) => {
    const room = rooms.find(r => r.id === roomId);
    return room ? `Sala ${room.id} (${room.capacity} lugares)` : 'Sala não encontrada';
  };

  // Função para formatar data e hora
  const formatDateTime = (dateTime) => {
    const date = new Date(dateTime);
    return date.toLocaleString('pt-BR');
  };

  if (loading) {
    return (
      <BlankLayout>
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Carregando...</span>
          </div>
          <p>Carregando sessões...</p>
        </div>
      </BlankLayout>
    );
  }

  if (error) {
    return (
      <BlankLayout>
        <div className="alert alert-danger" role="alert">
          {error}
          <button 
            className="btn btn-outline-danger ms-2" 
            onClick={loadAllData}
          >
            Tentar Novamente
          </button>
        </div>
      </BlankLayout>
    );
  }

  return (
    <BlankLayout>
      <Table title="Sessões" onAdd={handleAddNewSession}>
        <div className="table-responsive">
          <table className="table table-light">
            <thead>
              <tr>
                <th className="text-center">Filme</th>
                <th className="text-center">Sala</th>
                <th className="text-center">Data/Hora</th>
                <th className="text-center">Idioma</th>
                <th className="text-center">Formato</th>
                <th className="text-center">Preço</th>
                <th className="text-center">Ações</th>
              </tr>
            </thead>
            <tbody>
              {sessions.length > 0 ? (
                sessions.map((session, index) => (
                  <tr key={session.id || index}> 
                    <td className="text-center">{getMovieTitle(session.movieId)}</td>
                    <td className="text-center">{getRoomInfo(session.roomId)}</td>
                    <td className="text-center">{formatDateTime(session.dateTime)}</td>
                    <td className="text-center">
                      <span className={`badge ${session.language === 'dublado' ? 'bg-success' : 'bg-info'}`}>
                        {session.language === 'dublado' ? 'Dublado' : 
                         session.language === 'legendado' ? 'Legendado' : session.language}
                      </span>
                    </td>
                    <td className="text-center">
                      <span className={`badge ${session.format === '3d' ? 'bg-primary' : session.format === 'imax' ? 'bg-success' : 'bg-secondary'}`}>
                        {session.format === '2d' ? '2D' : 
                         session.format === '3d' ? '3D' : 
                         session.format === 'imax' ? 'IMAX' : session.format}
                      </span>
                    </td>
                    <td className="text-center">R$ {parseFloat(session.price).toFixed(2)}</td>
                    <td className="text-center">
                      <div className="d-flex align-items-center justify-content-center gap-1">
                        <Button
                          text=""
                          variant="secondary"
                          size="btn-sm"
                          onClick={() => handleEditSession(session.id)}
                          icone="pencil"
                        />
                        <Button
                          text=""
                          variant="danger"
                          size="btn-sm"
                          onClick={() => handleDeleteSession(session.id)}
                          icone="trash"
                        />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center">Nenhuma sessão encontrada.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Table>
    </BlankLayout>
  );
}