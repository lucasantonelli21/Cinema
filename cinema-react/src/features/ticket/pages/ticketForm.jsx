import React, { useState, useEffect } from 'react';
import { Ingresso } from "../../../models/ingresso";
import { Sessao } from "../../../models/sessao";
import { Filme } from "../../../models/filme";
import { Sala } from "../../../models/sala";
import BlankLayout from "../../../components/layouts/blank";
import Button from "../../../components/buttons/Button";
import Input from "../../../components/inputs/Input";
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

export default function TicketForm() {
    const [sessionId, setSessionId] = useState('');
    const [cpf, setCpf] = useState('');
    const [seat, setSeat] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('credito');
    
    const [sessions, setSessions] = useState([]);
    const [movies, setMovies] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [occupiedSeats, setOccupiedSeats] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    
    const navigate = useNavigate();
    const { ingressoId } = useParams();
    const [searchParams] = useSearchParams();
    const isEditing = Boolean(ingressoId);

    // Carregar dados iniciais
    useEffect(() => {
        loadInitialData();
    }, []);

    const loadInitialData = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const [sessionsData, moviesData, roomsData] = await Promise.all([
                Sessao.getAll(),
                Filme.getAll(),
                Sala.getAll()
            ]);
            
            setSessions(sessionsData);
            setMovies(moviesData);
            setRooms(roomsData);
        } catch (error) {
            console.error('Erro ao carregar dados iniciais:', error);
            setError('Erro ao carregar dados. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    // Capturar sessão da URL (quando vem da landing page)
    useEffect(() => {
        const sessionFromUrl = searchParams.get('sessao');
        if (sessionFromUrl && !isEditing) {
            setSessionId(sessionFromUrl);
        }
    }, [searchParams, isEditing]);

    // Carregar dados do ingresso se estiver editando
    useEffect(() => {
        if (isEditing) {
            loadTicket();
        }
    }, [ingressoId, isEditing]);

    const loadTicket = async () => {
        try {
            setLoading(true);
            const ingresso = await Ingresso.getById(ingressoId);
            if (ingresso) {
                setSessionId(ingresso.sessionId.toString());
                setCpf(ingresso.cpf);
                setSeat(ingresso.seat);
                setPaymentMethod(ingresso.paymentMethod);
            } else {
                alert('Ingresso não encontrado!');
                navigate('/ingressos');
            }
        } catch (error) {
            console.error('Erro ao carregar ingresso:', error);
            setError('Erro ao carregar dados do ingresso.');
        } finally {
            setLoading(false);
        }
    };

    // Carregar assentos ocupados quando a sessão muda
    useEffect(() => {
        if (sessionId) {
            loadOccupiedSeats();
        }
    }, [sessionId, isEditing, ingressoId]);

    const loadOccupiedSeats = async () => {
        try {
            const ingressos = await Ingresso.getAll();
            const assentosOcupados = ingressos
                .filter(ingresso => 
                    parseInt(ingresso.sessionId) === parseInt(sessionId) && 
                    (!isEditing || parseInt(ingresso.id) !== parseInt(ingressoId))
                )
                .map(ingresso => ingresso.seat.toLowerCase());
            setOccupiedSeats(assentosOcupados);
        } catch (error) {
            console.error('Erro ao carregar assentos ocupados:', error);
        }
    };

    // Função para obter informações da sessão selecionada
    const getSelectedSessionInfo = () => {
        const session = sessions.find(s => s.id === parseInt(sessionId));
        if (!session) return null;

        const movie = movies.find(m => m.id === session.movieId);
        const room = rooms.find(r => r.id === session.roomId);

        return {
            session,
            movie,
            room
        };
    };

    // Função para formatar CPF
    const formatCPF = (value) => {
        const numbers = value.replace(/\D/g, '');
        return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    };

    // Função para gerar assentos disponíveis
    const generateAvailableSeats = () => {
        const sessionInfo = getSelectedSessionInfo();
        if (!sessionInfo || !sessionInfo.room) return [];

        const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
        const seatsPerRow = Math.ceil(sessionInfo.room.capacity / rows.length);
        const seats = [];

        for (let row of rows) {
            for (let num = 1; num <= seatsPerRow; num++) {
                const seatCode = `${row}${num}`;
                if (!occupiedSeats.includes(seatCode.toLowerCase())) {
                    seats.push(seatCode);
                }
                // Parar se já temos assentos suficientes
                if (seats.length + occupiedSeats.length >= sessionInfo.room.capacity) break;
            }
            if (seats.length + occupiedSeats.length >= sessionInfo.room.capacity) break;
        }

        return seats;
    };

    const handleBack = () => {
        navigate('/ingressos');
    };

    const handleCpfChange = (e) => {
        const formatted = formatCPF(e.target.value);
        if (formatted.length <= 14) {
            setCpf(formatted);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        
        // Validação básica
        if (!sessionId || !cpf || !seat || !paymentMethod) {
            alert('Por favor, preencha todos os campos obrigatórios.');
            return;
        }

        // Verificar se o assento já está ocupado (apenas ao criar novo ingresso)
        if (!isEditing && await Ingresso.isSeatTaken(sessionId, seat)) {
            alert('Este assento já está ocupado para esta sessão!');
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const ingresso = new Ingresso(
                isEditing ? parseInt(ingressoId) : null,
                parseInt(sessionId),
                cpf.replace(/\D/g, ''), // Salvar apenas números
                seat.toUpperCase(),
                paymentMethod
            );

            await ingresso.save();

            alert(isEditing ? 'Ingresso atualizado com sucesso!' : 'Ingresso comprado com sucesso!');
            navigate('/ingressos');
            
        } catch (error) {
            console.error('Erro ao salvar ingresso:', error);
            setError('Erro ao salvar ingresso. Tente novamente.');
            alert('Erro ao salvar ingresso. Verifique os dados e tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    if (loading && !sessions.length) {
        return (
            <BlankLayout>
                <div className="text-center">
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Carregando...</span>
                    </div>
                    <p>Carregando dados...</p>
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
                        onClick={isEditing ? loadTicket : loadInitialData}
                    >
                        Tentar Novamente
                    </button>
                </div>
            </BlankLayout>
        );
    }

    const sessionInfo = getSelectedSessionInfo();
    const availableSeats = generateAvailableSeats();

    return (
        <BlankLayout>
            <div className="card">
                <div className="card-header text-center">
                    <h1 className="mt-5">
                        {isEditing ? 'Editar Ingresso' : 'Compra de Ingressos'}
                    </h1>
                </div>

                <form id="ingressoForm" className="mt-4" onSubmit={handleSubmit}>
                    <div className="card-body">
                        <div className="mb-3">
                            <label htmlFor="sessionId" className="form-label">Sessão *</label>
                            <select 
                                className="form-control" 
                                id="sessionId"
                                value={sessionId}
                                onChange={(e) => setSessionId(e.target.value)}
                                required
                            >
                                <option value="">Selecione uma sessão</option>
                                {sessions.map(session => {
                                    const movie = movies.find(m => m.id === session.movieId);
                                    const room = rooms.find(r => r.id === session.roomId);
                                    const dateTime = new Date(session.dateTime).toLocaleString('pt-BR');
                                    
                                    return (
                                        <option key={session.id} value={session.id}>
                                            {movie?.title || 'Filme não encontrado'} - Sala {room?.id || '?'} - {dateTime} - R$ {parseFloat(session.price).toFixed(2)}
                                        </option>
                                    );
                                })}
                            </select>
                            {sessions.length === 0 && (
                                <small className="form-text text-danger">Nenhuma sessão cadastrada. Cadastre sessões primeiro.</small>
                            )}
                        </div>

                        <Input
                            id="cpf"
                            tipo="text"
                            label="CPF"
                            valor={cpf}
                            onChange={handleCpfChange}
                            placeholder="000.000.000-00"
                            obrigatorio={true}
                        />

                        <div className="mb-3">
                            <label htmlFor="seat" className="form-label">Assento *</label>
                            <select 
                                className="form-control" 
                                id="seat"
                                value={seat}
                                onChange={(e) => setSeat(e.target.value)}
                                required
                                disabled={!sessionId}
                            >
                                <option value="">Selecione uma sessão primeiro</option>
                                {availableSeats.map(seatCode => (
                                    <option key={seatCode} value={seatCode}>
                                        {seatCode}
                                    </option>
                                ))}
                            </select>
                            {sessionId && (
                                <small className="form-text text-muted">
                                    Assentos disponíveis: {availableSeats.length} de {sessionInfo?.room?.capacity || 0}
                                </small>
                            )}
                        </div>

                        <div className="mb-3">
                            <label htmlFor="paymentMethod" className="form-label">Forma de Pagamento *</label>
                            <select 
                                className="form-control" 
                                id="paymentMethod"
                                value={paymentMethod}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                                required
                            >
                                <option value="credito">Cartão de Crédito</option>
                                <option value="debito">Cartão de Débito</option>
                                <option value="dinheiro">Dinheiro</option>
                                <option value="pix">PIX</option>
                            </select>
                        </div>

                        {sessionInfo && (
                            <div className="mb-3">
                                <div className="card bg-light">
                                    <div className="card-body">
                                        <h6 className="card-title">Resumo do Ingresso:</h6>
                                        <p className="card-text">
                                            <strong>Filme:</strong> {sessionInfo.movie?.title || 'N/A'}<br/>
                                            <strong>Sala:</strong> {sessionInfo.room ? `Sala ${sessionInfo.room.id} (${sessionInfo.room.type})` : 'N/A'}<br/>
                                            <strong>Data/Hora:</strong> {new Date(sessionInfo.session.dateTime).toLocaleString('pt-BR')}<br/>
                                            <strong>CPF:</strong> {cpf || 'Digite o CPF'}<br/>
                                            <strong>Assento:</strong> <span className="badge bg-info">{seat || 'Selecione um assento'}</span><br/>
                                            <strong>Forma de Pagamento:</strong> <span className={`badge ${
                                                paymentMethod === 'credito' ? 'bg-primary' : 
                                                paymentMethod === 'debito' ? 'bg-success' : 
                                                paymentMethod === 'dinheiro' ? 'bg-warning' : 'bg-info'
                                            }`}>
                                                {paymentMethod === 'credito' ? 'Crédito' :
                                                 paymentMethod === 'debito' ? 'Débito' :
                                                 paymentMethod === 'dinheiro' ? 'Dinheiro' : 'PIX'}
                                            </span><br/>
                                            <strong>Valor:</strong> R$ {parseFloat(sessionInfo.session.price).toFixed(2)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="card-footer text-end">
                        <div className="d-flex justify-content-between align-items-center">
                            <Button
                                text="Voltar"
                                variant="light"
                                onClick={handleBack}
                                icone="arrow-left"
                                disabled={loading}
                            />
                            <Button
                                text={loading ? 'Salvando...' : (isEditing ? 'Atualizar Ingresso' : 'Comprar Ingresso')}
                                variant="success"
                                type="submit"
                                icone="save"
                                disabled={loading}
                            />
                        </div>
                    </div>
                </form>
            </div>
        </BlankLayout>            
    );
}