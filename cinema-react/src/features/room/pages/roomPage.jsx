import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom";
import BlankLayout from "../../../components/layouts/blank";
import Table from "../../../components/tables/table";
import Button from "../../../components/buttons/Button";
import { Sala } from "../../../models/sala";

export default function RoomPage() {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    loadRooms();
  }, []);

  const loadRooms = async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedRooms = await Sala.getAll();
      setRooms(fetchedRooms);
    } catch (error) {
      console.error('Erro ao carregar salas:', error);
      setError('Erro ao carregar salas. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleAddNewRoom = () => {
    navigate('/salas/formulario');
  };

  const handleEditRoom = (roomId) => {
    navigate(`/salas/formulario/${roomId}`);
  };

  const handleDeleteRoom = async (roomId) => {
    if (window.confirm("Tem certeza que deseja excluir esta sala?")) {
      try {
        const success = await Sala.delete(roomId);
        if (success) {
          alert('Sala excluída com sucesso!');
          await loadRooms(); // Recarregar a lista
        } else {
          alert('Erro ao excluir sala. Tente novamente.');
        }
      } catch (error) {
        console.error('Erro ao excluir sala:', error);
        alert('Erro ao excluir sala. Tente novamente.');
      }
    }
  };

  if (loading) {
    return (
      <BlankLayout>
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Carregando...</span>
          </div>
          <p>Carregando salas...</p>
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
            onClick={loadRooms}
          >
            Tentar Novamente
          </button>
        </div>
      </BlankLayout>
    );
  }

  return (
    <BlankLayout>
      <Table title="Salas" onAdd={handleAddNewRoom}>
        <div className="table-responsive">
          <table className="table table-light">
            <thead>
              <tr>
                <th className="text-center">ID</th>
                <th className="text-center">Capacidade</th>
                <th className="text-center">Tipo</th>
                <th className="text-center">Ações</th>
              </tr>
            </thead>
            <tbody>
              {rooms.length > 0 ? (
                rooms.map((room, index) => (
                  <tr key={room.id || index}> 
                    <td className="text-center">Sala {room.id}</td>
                    <td className="text-center">{room.capacity} pessoas</td>
                    <td className="text-center">
                      <span className={`badge ${room.type === 'imax' ? 'bg-success' : room.type === '3d' ? 'bg-primary' : 'bg-secondary'}`}>
                        {room.type === 'comum' ? '2D' : 
                         room.type === '3d' ? '3D' : 
                         room.type === 'imax' ? 'IMAX' : room.type.toUpperCase()}
                      </span>
                    </td>
                    <td className="text-center">
                      <div className="d-flex align-items-center justify-content-center gap-1">
                        <Button
                          text=""
                          variant="secondary"
                          size="btn-sm"
                          onClick={() => handleEditRoom(room.id)}
                          icone="pencil"
                        />
                        <Button
                          text=""
                          variant="danger"
                          size="btn-sm"
                          onClick={() => handleDeleteRoom(room.id)}
                          icone="trash"
                        />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center">Nenhuma sala encontrada.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Table>
    </BlankLayout>
  );
}