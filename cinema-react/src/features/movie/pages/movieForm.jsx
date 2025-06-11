import React, { useState, useEffect } from 'react';
import { Filme } from "../../../models/filme";
import BlankLayout from "../../../components/layouts/blank";
import Button from "../../../components/buttons/Button";
import Input from "../../../components/inputs/Input";
import { useNavigate, useParams } from 'react-router-dom';

export default function MovieForm() {
    const [title, setTitle] = useState('');
    const [synopsis, setSynopsis] = useState('');
    const [genre, setGenre] = useState('acao');
    const [rating, setRating] = useState('livre');
    const [duration, setDuration] = useState('');
    const [releaseDate, setReleaseDate] = useState('');
    const [imageUrlInput, setImageUrlInput] = useState('');
    const [imagePreview, setImagePreview] = useState('/assets/filme.jpg');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    
    const navigate = useNavigate();
    const { filmeId } = useParams();
    const isEditing = Boolean(filmeId);

    // Carregar dados do filme se estiver editando
    useEffect(() => {
        if (isEditing) {
            loadMovie();
        }
    }, [filmeId, isEditing]);

    const loadMovie = async () => {
        try {
            setLoading(true);
            setError(null);
            const filme = await Filme.getById(filmeId);
            
            if (filme) {
                setTitle(filme.title);
                setSynopsis(filme.synopsis);
                setGenre(filme.genre);
                setRating(filme.rating);
                setDuration(filme.duration.toString());
                setReleaseDate(filme.releaseDate);
                setImageUrlInput(filme.imageUrl === '/assets/filme.jpg' ? '' : filme.imageUrl);
                setImagePreview(filme.imageUrl);
            } else {
                alert('Filme não encontrado!');
                navigate('/filmes');
            }
        } catch (error) {
            console.error('Erro ao carregar filme:', error);
            setError('Erro ao carregar dados do filme.');
        } finally {
            setLoading(false);
        }
    };
    
    const handleImageUrlChange = (e) => {
        const url = e.target.value;
        setImageUrlInput(url);
        if (url) {
            setImagePreview(url);
        } else {
            setImagePreview('/assets/filme.jpg');
        }
    };

    const handleBack = () => {
        navigate('/filmes');
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        
        // Validação básica
        if (!title || !synopsis || !genre || !rating || !duration || !releaseDate) {
            alert('Por favor, preencha todos os campos obrigatórios.');
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const filme = new Filme(
                isEditing ? filmeId : null,
                title,
                synopsis,
                genre,
                rating,
                parseInt(duration),
                releaseDate,
                imageUrlInput || '/assets/filme.jpg'
            );

            await filme.save();

            alert(isEditing ? 'Filme atualizado com sucesso!' : 'Filme cadastrado com sucesso!');
            navigate('/filmes');
            
        } catch (error) {
            console.error('Erro ao salvar filme:', error);
            setError('Erro ao salvar filme. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    if (loading && isEditing) {
        return (
            <BlankLayout>
                <div className="text-center">
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Carregando...</span>
                    </div>
                    <p>Carregando dados do filme...</p>
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
                        onClick={isEditing ? loadMovie : () => setError(null)}
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
                        {isEditing ? 'Editar Filme' : 'Cadastro de Filmes'}
                    </h1>
                </div>

                <form id="filmeForm" className="mt-4" onSubmit={handleSubmit}>
                    <div className="card-body">
                        <Input
                            id="title"
                            label="Título"
                            valor={title}
                            onChange={(e) => setTitle(e.target.value)}
                            obrigatorio={true}
                        />

                        <div className="mb-3">
                            <label htmlFor="synopsis" className="form-label">Sinopse</label>
                            <textarea 
                                className="form-control" 
                                id="synopsis" 
                                rows="3" 
                                value={synopsis}
                                onChange={(e) => setSynopsis(e.target.value)}
                                required
                            ></textarea>
                        </div>

                        <div className="mb-3">
                            <label htmlFor="genre" className="form-label">Gênero</label>
                            <select 
                                name="genre" 
                                className="form-control" 
                                id="genre"
                                value={genre}
                                onChange={(e) => setGenre(e.target.value)}
                            >
                                <option value="Ação">Ação</option>
                                <option value="Comedia">Comédia</option>
                                <option value="Drama">Drama</option>
                                <option value="Terror">Terror</option>
                                <option value="Romance">Romance</option>
                                <option value="Aventura">Aventura</option>
                                <option value="Suspense">Suspense</option>
                                <option value="Ficcao">Ficção Científica</option>
                                <option value="Fantasia">Fantasia</option>
                            </select>
                        </div>

                        <div className="mb-3">
                            <label htmlFor="rating" className="form-label">Classificação Indicativa</label>
                            <select 
                                name="rating" 
                                className="form-control" 
                                id="rating"
                                value={rating}
                                onChange={(e) => setRating(e.target.value)}
                            >
                                <option value="livre">Livre</option>
                                <option value="10">10 anos</option>
                                <option value="12">12 anos</option>
                                <option value="14">14 anos</option>
                                <option value="16">16 anos</option>
                                <option value="18">18 anos</option>
                            </select>
                        </div>

                        <Input
                            id="duration"
                            tipo="number"
                            label="Duração (minutos)"
                            valor={duration}
                            onChange={(e) => setDuration(e.target.value)}
                            obrigatorio={true}
                        />

                        <Input
                            id="releaseDate"
                            tipo="date"
                            label="Data de Estreia"
                            valor={releaseDate}
                            onChange={(e) => setReleaseDate(e.target.value)}
                            obrigatorio={true}
                        />

                        <Input
                            id="imageUrl"
                            tipo="url"
                            label="URL da Imagem do Filme"
                            valor={imageUrlInput}
                            onChange={handleImageUrlChange}
                            placeholder="https://exemplo.com/imagem.jpg"
                        />

                        <div className="mt-2">
                            <img 
                                id="imagePreview" 
                                src={imagePreview} 
                                alt="Preview" 
                                className="img-thumbnail" 
                                style={{ maxHeight: '200px' }}
                                onError={(e) => {
                                    e.target.src = '/assets/filme.jpg';
                                }}
                            />
                        </div>
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
                                text={loading ? 'Salvando...' : (isEditing ? 'Atualizar Filme' : 'Cadastrar Filme')}
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