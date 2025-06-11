import React, { useState, useEffect } from 'react';
import { Sessao } from "../../../models/sessao";
import { Filme } from "../../../models/filme";
import { Sala } from "../../../models/sala";
import BlankLayout from "../../../components/layouts/blank";
import Button from "../../../components/buttons/Button";
import Input from "../../../components/inputs/Input";
import { useNavigate, useParams } from 'react-router-dom';

export default function SessionForm() {
    const [movieId, setMovieId] = useState('');
    const [roomId, setRoomId] = useState('');
    const [dateTime, setDateTime] = useState('');
    const [language, setLanguage] = useState('dublado');
    const [format, setFormat] = useState('2d');
    const [price, setPrice] = useState('');
    
    const [movies, setMovies] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    
    const navigate = useNavigate();
    const { sessaoId } = useParams();
    const isEditing = Boolean(sessaoId);

    // Carregar dados iniciais
    useEffect(() => {
        loadInitialData();
    }, []);

    const loadInitialData = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const [moviesData, roomsData] = await Promise.all([
                Filme.getAll(),
                Sala.getAll()
            ]);
            
            setMovies(moviesData);
            setRooms(roomsData);
        } catch (error) {
            console.error('Erro ao carregar dados iniciais:', error);
            setError('Erro ao carregar dados. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    // Carregar dados da sessão se estiver editando
    useEffect(() => {
        if (isEditing) {
            loadSession();
        }
    }, [sessaoId, isEditing]);

    const loadSession = async () => {
        try {
            setLoading(true);
            const sessao = await Sessao.getById(sessaoId);
            if (sessao) {
                setMovieId(sessao.movieId.toString());
                setRoomId(sessao.roomId.toString());
                
                // Formatar a data para o input datetime-local
                const date = new Date(sessao.dateTime);
                const formattedDate = date.toISOString().slice(0, 16); // Remove os segundos
                setDateTime(formattedDate);
                
                setLanguage(sessao.language);
                setFormat(sessao.format);
                setPrice(sessao.price.toString());
            } else {
                alert('Sessão não encontrada!');
                navigate('/sessoes');
            }
        } catch (error) {
            console.error('Erro ao carregar sessão:', error);
            setError('Erro ao carregar dados da sessão.');
        } finally {
            setLoading(false);
        }
    };

    // Função para obter a sala selecionada
    const getSelectedRoom = () => {
        return rooms.find(room => room.id === parseInt(roomId));
    };

    // Função para obter formatos disponíveis baseado no tipo da sala
    const getAvailableFormats = () => {
        const selectedRoom = getSelectedRoom();
        if (!selectedRoom) return [];

        const formatsByRoomType = {
            'comum': ['2d'],
            '3d': ['2d', '3d'],
            'imax': ['2d', 'imax'],
        };

        return formatsByRoomType[selectedRoom.type] || ['2d'];
    };

    // Ajustar o formato quando a sala muda
    useEffect(() => {
        if (roomId) {
            const availableFormats = getAvailableFormats();
            // Se o formato atual não estiver disponível para a nova sala, seleciona o primeiro disponível
            if (!availableFormats.includes(format)) {
                setFormat(availableFormats[0] || '2d');
            }
        }
    }, [roomId]);

    const handleBack = () => {
        navigate('/sessoes');
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        
        // Validação básica
        if (!movieId || !roomId || !dateTime || !language || !format || !price) {
            alert('Por favor, preencha todos os campos obrigatórios.');
            return;
        }

        // Verificar se já existe uma sessão no mesmo horário e sala (apenas ao criar nova sessão)
        if (!isEditing) {
            try {
                const sessoes = await Sessao.getAll();
                const conflito = sessoes.find(sessao => 
                    sessao.roomId === parseInt(roomId) && 
                    new Date(sessao.dateTime).getTime() === new Date(dateTime).getTime()
                );
                if (conflito) {
                    alert('Já existe uma sessão agendada para esta sala neste horário!');
                    return;
                }
            } catch (error) {
                console.error('Erro ao verificar conflito:', error);
            }
        }

        try {
            setLoading(true);
            setError(null);

            const sessao = new Sessao(
                isEditing ? parseInt(sessaoId) : null,
                parseInt(movieId),
                parseInt(roomId),
                dateTime,
                language,
                parseFloat(price),
                format
            );

            await sessao.save();

            alert(isEditing ? 'Sessão atualizada com sucesso!' : 'Sessão cadastrada com sucesso!');
            navigate('/sessoes');
            
        } catch (error) {
            console.error('Erro ao salvar sessão:', error);
            setError('Erro ao salvar sessão. Tente novamente.');
            alert('Erro ao salvar sessão. Verifique os dados e tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    if (loading && !movies.length) {
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
                        onClick={isEditing ? loadSession : loadInitialData}
                    >
                        Tentar Novamente
                    </button>
                </div>
            </BlankLayout>
        );
    }

    return (
        <BlankLayout>
            <div className="card">
                <div className="card-header text-center">
                    <h1 className="mt-5">
                        {isEditing ? 'Editar Sessão' : 'Cadastro de Sessões'}
                    </h1>
                </div>

                <form id="sessaoForm" className="mt-4" onSubmit={handleSubmit}>
                    <div className="card-body">
                        <div className="mb-3">
                            <label htmlFor="movieId" className="form-label">Filme *</label>
                            <select 
                                className="form-control" 
                                id="movieId"
                                value={movieId}
                                onChange={(e) => setMovieId(e.target.value)}
                                required
                            >
                                <option value="">Selecione um filme</option>
                                {movies.map(movie => (
                                    <option key={movie.id} value={movie.id}>
                                        {movie.title} ({movie.duration} min)
                                    </option>
                                ))}
                            </select>
                            {movies.length === 0 && (
                                <small className="form-text text-danger">Nenhum filme cadastrado. Cadastre filmes primeiro.</small>
                            )}
                        </div>

                        <div className="mb-3">
                            <label htmlFor="roomId" className="form-label">Sala *</label>
                            <select 
                                className="form-control" 
                                id="roomId"
                                value={roomId}
                                onChange={(e) => setRoomId(e.target.value)}
                                required
                            >
                                <option value="">Selecione uma sala</option>
                                {rooms.map(room => (
                                    <option key={room.id} value={room.id}>
                                        Sala {room.id} - {room.capacity} lugares ({room.type})
                                    </option>
                                ))}
                            </select>
                            {rooms.length === 0 && (
                                <small className="form-text text-danger">Nenhuma sala cadastrada. Cadastre salas primeiro.</small>
                            )}
                        </div>

                        <Input
                            id="dateTime"
                            tipo="datetime-local"
                            label="Data e Hora"
                            valor={dateTime}
                            onChange={(e) => setDateTime(e.target.value)}
                            obrigatorio={true}
                        />

                        <div className="mb-3">
                            <label htmlFor="language" className="form-label">Idioma *</label>
                            <select 
                                className="form-control" 
                                id="language"
                                value={language}
                                onChange={(e) => setLanguage(e.target.value)}
                                required
                            >
                                <option value="dublado">Dublado</option>
                                <option value="legendado">Legendado</option>
                            </select>
                        </div>

                        <div className="mb-3">
                            <label htmlFor="format" className="form-label">Formato *</label>
                            <select 
                                className="form-control" 
                                id="format"
                                value={format}
                                onChange={(e) => setFormat(e.target.value)}
                                required
                                disabled={!roomId}
                            >
                                {!roomId ? (
                                    <option value="">Selecione uma sala primeiro</option>
                                ) : (
                                    getAvailableFormats().map(formatOption => (
                                        <option key={formatOption} value={formatOption}>
                                            {formatOption === '2d' ? '2D' : 
                                             formatOption === '3d' ? '3D' : 
                                             formatOption === 'imax' ? 'IMAX' : formatOption.toUpperCase()}
                                        </option>
                                    ))
                                )}
                            </select>
                        </div>

                        <Input
                            id="price"
                            tipo="number"
                            label="Preço (R$)"
                            valor={price}
                            onChange={(e) => setPrice(e.target.value)}
                            placeholder="25.00"
                            obrigatorio={true}
                            step="0.01"
                            min="0"
                        />

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
                                text={loading ? 'Salvando...' : (isEditing ? 'Atualizar Sessão' : 'Cadastrar Sessão')}
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