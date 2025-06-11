import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BlankLayout from "../../../components/layouts/blank";
import Button from "../../../components/buttons/Button";
import { Sessao } from "../../../models/sessao";
import { Filme } from "../../../models/filme";
import { Sala } from "../../../models/sala";

export default function IndexPage() {
    const [sessions, setSessions] = useState([]);
    const [movies, setMovies] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const navigate = useNavigate();

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
            
            // Filtrar apenas sessões futuras e ordenar por data
            const futureSessions = sessionsData
                .filter(session => new Date(session.dateTime) > new Date())
                .sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime));
            
            setSessions(futureSessions);
            setMovies(moviesData);
            setRooms(roomsData);
        } catch (error) {
            console.error('Erro ao carregar dados:', error);
            setError('Erro ao carregar sessões. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    // Função para buscar informações do filme
    const getMovieInfo = (movieId) => {
        return movies.find(m => m.id === movieId) || {};
    };

    // Função para buscar informações da sala
    const getRoomInfo = (roomId) => {
        return rooms.find(r => r.id === roomId) || {};
    };

    // Função para formatar data e hora
    const formatDateTime = (dateTime) => {
        const date = new Date(dateTime);
        return {
            date: date.toLocaleDateString('pt-BR', { 
                weekday: 'short', 
                day: '2-digit', 
                month: '2-digit' 
            }),
            time: date.toLocaleTimeString('pt-BR', { 
                hour: '2-digit', 
                minute: '2-digit' 
            }),
            fullDate: date.toLocaleDateString('pt-BR')
        };
    };

    // Função para comprar ingresso
    const handleBuyTicket = (sessionId) => {
        navigate(`/ingressos/formulario?sessao=${sessionId}`);
    };

    // Função para formatar gênero
    const formatGenre = (genre) => {
        const genreMap = {
            'acao': 'Ação',
            'comedia': 'Comédia',
            'drama': 'Drama',
            'terror': 'Terror',
            'romance': 'Romance',
            'aventura': 'Aventura',
            'suspense': 'Suspense',
            'ficcao': 'Ficção Científica',
            'fantasia': 'Fantasia'
        };
        return genreMap[genre] || genre;
    };

    if (loading) {
        return (
            <BlankLayout>
                <div className="container-fluid">
                    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
                        <div className="text-center">
                            <div className="spinner-border text-primary mb-3" role="status" style={{ width: '3rem', height: '3rem' }}>
                                <span className="visually-hidden">Carregando...</span>
                            </div>
                            <h5 className="text-muted">Carregando sessões...</h5>
                            <p className="text-muted">Buscando os melhores filmes para você!</p>
                        </div>
                    </div>
                </div>
            </BlankLayout>
        );
    }

    if (error) {
        return (
            <BlankLayout>
                <div className="container-fluid">
                    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
                        <div className="text-center">
                            <div className="alert alert-danger" role="alert">
                                <i className="fa-solid fa-exclamation-triangle fa-3x mb-3 text-danger"></i>
                                <h4 className="alert-heading">Ops! Algo deu errado</h4>
                                <p>{error}</p>
                                <hr />
                                <Button
                                    text="Tentar Novamente"
                                    variant="danger"
                                    onClick={loadAllData}
                                    icone="refresh"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </BlankLayout>
        );
    }

    return (
        <BlankLayout>
            <div className="container-fluid px-4">
                
                {sessions.length > 0 && (
                    <div className="row mb-4">
                        <div className="col-12">
                            <h1 className="text-center mb-4">
                                <i className="fa-solid fa-star text-warning me-2"></i>
                                Sessões em Cartaz
                                <small className="text-muted ms-2">({sessions.length} sessões disponíveis)</small>
                            </h1>
                        </div>
                    </div>
                )}

                {/* Grid de Sessões */}
                <div className="row">
                    {sessions.length > 0 ? (
                        sessions.map((session, index) => {
                            const movie = getMovieInfo(session.movieId);
                            const room = getRoomInfo(session.roomId);
                            const dateTime = formatDateTime(session.dateTime);
                            
                            return (
                                <div key={session.id || index} className="col-xl-4 col-lg-6 col-md-6 mb-4">
                                    <div className="card h-100 shadow-lg border-0 movie-card">
                                        {/* Badge de Formato */}
                                        <div className="position-absolute top-0 end-0 m-3" style={{ zIndex: 3 }}>
                                            <span className={`badge fs-6 ${
                                                session.format === '3d' ? 'bg-primary' : 
                                                session.format === 'imax' ? 'bg-success' : 'bg-secondary'
                                            }`}>
                                                {session.format === '2d' ? '2D' :
                                                 session.format === '3d' ? '3D' :
                                                 session.format === 'imax' ? 'IMAX' :
                                                 session.format?.toUpperCase() || 'N/A'}
                                            </span>
                                        </div>

                                        {/* Imagem do Filme */}
                                        <div className="position-relative overflow-hidden">
                                            <img 
                                                src={movie.imageUrl || '/assets/filme.jpg'} 
                                                className="card-img-top movie-poster" 
                                                alt={movie.title}
                                                style={{ 
                                                    height: '350px', 
                                                    objectFit: 'cover',
                                                    transition: 'transform 0.3s ease'
                                                }}
                                                onError={(e) => {
                                                    e.target.src = '/assets/filme.jpg';
                                                }}
                                            />
                                            <div className="card-img-overlay d-flex align-items-end p-0">
                                                <div className="w-100 bg-gradient-dark text-white p-3">
                                                    <h5 className="card-title mb-1 fw-bold">
                                                        {movie.title || 'Filme não encontrado'}
                                                    </h5>
                                                    <div className="d-flex align-items-center gap-3">
                                                        <span className="badge bg-warning text-dark">
                                                            {movie.rating === 'livre' ? 'Livre' : 
                                                             movie.rating ? `${movie.rating} anos` : 'N/A'}
                                                        </span>
                                                        <span className="small">
                                                            <i className="fa-solid fa-clock me-1"></i>
                                                            {movie.duration || 0} min
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="card-body d-flex flex-column">
                                            {/* Gênero */}
                                            <div className="mb-3">
                                                <span className="badge bg-light text-dark border">
                                                    <i className="fa-solid fa-tags me-1"></i>
                                                    {formatGenre(movie.genre) || 'N/A'}
                                                </span>
                                            </div>

                                            {/* Sinopse */}
                                            {movie.synopsis && (
                                                <p className="card-text text-muted small mb-3">
                                                    {movie.synopsis.length > 120 
                                                        ? `${movie.synopsis.substring(0, 120)}...` 
                                                        : movie.synopsis
                                                    }
                                                </p>
                                            )}

                                            {/* Informações da Sessão */}
                                            <div className="session-details bg-light rounded p-3 mb-3">
                                                <div className="row text-center">
                                                    <div className="col-6">
                                                        <div className="session-info-item">
                                                            <i className="fa-solid fa-calendar text-primary mb-1"></i>
                                                            <small className="text-muted d-block">Data</small>
                                                            <strong className="d-block">{dateTime.date}</strong>
                                                        </div>
                                                    </div>
                                                    <div className="col-6">
                                                        <div className="session-info-item">
                                                            <i className="fa-solid fa-clock text-success mb-1"></i>
                                                            <small className="text-muted d-block">Horário</small>
                                                            <strong className="d-block">{dateTime.time}</strong>
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                <hr className="my-2" />
                                                
                                                <div className="row text-center">
                                                    <div className="col-6">
                                                        <div className="session-info-item">
                                                            <i className="fa-solid fa-door-open text-info mb-1"></i>
                                                            <small className="text-muted d-block">Sala</small>
                                                            <strong className="d-block">Sala {room.id || 'N/A'}</strong>
                                                        </div>
                                                    </div>
                                                    <div className="col-6">
                                                        <div className="session-info-item">
                                                            <i className="fa-solid fa-language text-secondary mb-1"></i>
                                                            <small className="text-muted d-block">Idioma</small>
                                                            <span className={`badge ${session.language === 'dublado' ? 'bg-success' : 'bg-info'}`}>
                                                                {session.language === 'dublado' ? 'Dublado' : 
                                                                 session.language === 'legendado' ? 'Legendado' : 
                                                                 session.language || 'N/A'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="text-center mb-3">
                                                <button 
                                                    className="price-tag bg-success text-white rounded-pill py-2 border-0 w-100"
                                                    onClick={() => handleBuyTicket(session.id)}
                                                    style={{ cursor: 'pointer' }}
                                                >
                                                    <div className="d-flex align-items-center justify-content-center">
                                                        <div className="col">
                                                            <h5 className="mb-1 fw-bold">
                                                                R$ {parseFloat(session.price || 0).toFixed(2)}
                                                            </h5>
                                                            <small className="m-0">Por ingresso</small>
                                                        </div>
                                                    </div>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="col-12">
                            <div className="text-center py-5">
                                <div className="card border-0 shadow-lg">
                                    <div className="card-body py-5">
                                        <i className="fa-solid fa-film fa-4x text-muted mb-4"></i>
                                        <h3 className="text-muted mb-3">Nenhuma sessão em cartaz</h3>
                                        <p className="text-muted mb-4">
                                            Não há sessões programadas para o futuro no momento.<br/>
                                            Que tal cadastrar algumas sessões?
                                        </p>
                                        <Button
                                            text="Cadastrar Sessões"
                                            variant="primary"
                                            size="btn-lg"
                                            onClick={() => navigate('/sessoes')}
                                            icone="plus"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

            </div>

            <style jsx>{`
                .movie-card:hover {
                    transform: translateY(-5px);
                    transition: all 0.3s ease;
                }
                
                .movie-card:hover .movie-poster {
                    transform: scale(1.05);
                }
                
                .session-info-item i {
                    display: block;
                    font-size: 1.2rem;
                }
                
                .price-tag {
                    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
                    transition: all 0.3s ease;
                    background: linear-gradient(135deg, #198754, #20c997) !important;
                }
                
                .price-tag:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 12px rgba(0,0,0,0.15);
                    background: linear-gradient(135deg, #20c997, #198754) !important;
                }
                
                .price-tag:active {
                    transform: translateY(0);
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                }
                
            `}</style>
        </BlankLayout>
    );
}