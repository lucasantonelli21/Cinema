import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom";
import BlankLayout from "../../../components/layouts/blank";
import Table from "../../../components/tables/table";
import Button from "../../../components/buttons/Button";
import { Ingresso } from "../../../models/ingresso";
import { Sessao } from "../../../models/sessao";
import { Filme } from "../../../models/filme";
import { Sala } from "../../../models/sala";

export default function TicketPage() {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
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
      const [ticketsData, sessionsData, moviesData, roomsData] = await Promise.all([
        Ingresso.getAll(),
        Sessao.getAll(),
        Filme.getAll(),
        Sala.getAll()
      ]);
      
      setTickets(ticketsData);
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
  
  const handleAddNewTicket = () => {
    navigate('/ingressos/formulario');
  };

  const handleEditTicket = (ticketId) => {
    navigate(`/ingressos/formulario/${ticketId}`);
  };

  const handleDeleteTicket = async (ticketId) => {
    if (window.confirm("Tem certeza que deseja excluir este ingresso?")) {
      try {
        const success = await Ingresso.delete(ticketId);
        if (success) {
          alert('Ingresso excluído com sucesso!');
          await loadAllData(); // Recarregar dados
        } else {
          alert('Erro ao excluir ingresso. Tente novamente.');
        }
      } catch (error) {
        console.error('Erro ao excluir ingresso:', error);
        alert('Erro ao excluir ingresso. Tente novamente.');
      }
    }
  };

  // Função para buscar informações da sessão pelo ID
  const getSessionInfo = (sessionId) => {
    const session = sessions.find(s => s.id === parseInt(sessionId));
    if (!session) return { movieTitle: 'Sessão não encontrada', roomInfo: '', dateTime: '', price: 0 };

    const movie = movies.find(m => m.id === session.movieId);
    const room = rooms.find(r => r.id === session.roomId);

    return {
      movieTitle: movie ? movie.title : 'Filme não encontrado',
      roomInfo: room ? `Sala ${room.id} (${room.capacity} lugares)` : 'Sala não encontrada',
      dateTime: new Date(session.dateTime).toLocaleString('pt-BR'),
      price: session.price
    };
  };

  // Função para formatar data de compra
  const formatPurchaseDate = (dateTime) => {
    const date = new Date(dateTime);
    return date.toLocaleString('pt-BR');
  };

  // Função para formatar CPF
  const formatCPF = (cpf) => {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  if (loading) {
    return (
      <BlankLayout>
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Carregando...</span>
          </div>
          <p>Carregando ingressos...</p>
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
      <Table title="Ingressos" onAdd={handleAddNewTicket}>
        <div className="table-responsive">
          <table className="table table-light">
            <thead>
              <tr>
                <th className="text-center">Filme</th>
                <th className="text-center">Sala</th>
                <th className="text-center">Data/Hora Sessão</th>
                <th className="text-center">CPF</th>
                <th className="text-center">Assento</th>
                <th className="text-center">Forma Pagamento</th>
                <th className="text-center">Valor</th>
                <th className="text-center">Ações</th>
              </tr>
            </thead>
            <tbody>
              {tickets.length > 0 ? (
                tickets.map((ticket, index) => {
                  const sessionInfo = getSessionInfo(ticket.sessionId);
                  return (
                    <tr key={ticket.id || index}> 
                      <td className="text-center">{sessionInfo.movieTitle}</td>
                      <td className="text-center">{sessionInfo.roomInfo}</td>
                      <td className="text-center">{sessionInfo.dateTime}</td>
                      <td className="text-center">{formatCPF(ticket.cpf)}</td>
                      <td className="text-center">
                        <span className="badge bg-info">{ticket.seat.toUpperCase()}</span>
                      </td>
                      <td className="text-center">
                        <span className={`badge ${
                          ticket.paymentMethod === 'credito' ? 'bg-primary' : 
                          ticket.paymentMethod === 'debito' ? 'bg-success' : 
                          ticket.paymentMethod === 'dinheiro' ? 'bg-warning' : 
                          ticket.paymentMethod === 'pix' ? 'bg-info' : 'bg-secondary'
                        }`}>
                          {ticket.paymentMethod === 'credito' ? 'Crédito' :
                           ticket.paymentMethod === 'debito' ? 'Débito' :
                           ticket.paymentMethod === 'dinheiro' ? 'Dinheiro' :
                           ticket.paymentMethod === 'pix' ? 'PIX' : ticket.paymentMethod}
                        </span>
                      </td>
                      <td className="text-center">R$ {parseFloat(sessionInfo.price || 0).toFixed(2)}</td>
                      <td className="text-center">
                        <div className="d-flex align-items-center justify-content-center gap-1">
                          <Button
                            text=""
                            variant="secondary"
                            size="btn-sm"
                            onClick={() => handleEditTicket(ticket.id)}
                            icone="pencil"
                          />
                          <Button
                            text=""
                            variant="danger"
                            size="btn-sm"
                            onClick={() => handleDeleteTicket(ticket.id)}
                            icone="trash"
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="8" className="text-center">Nenhum ingresso encontrado.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Table>
    </BlankLayout>
  );
}