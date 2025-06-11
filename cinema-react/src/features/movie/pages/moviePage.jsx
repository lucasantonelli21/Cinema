// import React, { useState } from "react";
import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom";
import BlankLayout from "../../../components/layouts/blank";
import Table from "../../../components/tables/table";
import Button from "../../../components/buttons/Button";
import { Filme } from "../../../models/filme";

export default function MoviePage() {
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Carregar filmes quando o componente montar
  useEffect(() => {
    loadMovies();
  }, []);

  const loadMovies = async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedMovies = await Filme.getAll();
      setMovies(fetchedMovies);
    } catch (error) {
      console.error('Erro ao carregar filmes:', error);
      setError('Erro ao carregar filmes. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleAddNewMovie = () => {
    navigate('/filmes/formulario');
  };

  const handleEditMovie = (movieId) => {
    navigate(`/filmes/formulario/${movieId}`);
  };

  const handleDeleteMovie = async (movieId) => {
    if (window.confirm("Tem certeza que deseja excluir este filme?")) {
      try {
        const success = await Filme.delete(movieId);
        if (success) {
          alert('Filme excluído com sucesso!');
          await loadMovies(); // Recarregar a lista
        } else {
          alert('Erro ao excluir filme. Tente novamente.');
        }
      } catch (error) {
        console.error('Erro ao excluir filme:', error);
        alert('Erro ao excluir filme. Tente novamente.');
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
          <p>Carregando filmes...</p>
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
            onClick={loadMovies}
          >
            Tentar Novamente
          </button>
        </div>
      </BlankLayout>
    );
  }

  return (
    <BlankLayout>
      <Table title="Filmes" onAdd={handleAddNewMovie}>
        <div className="table-responsive">
          <table className="table table-light">
            <thead>
              <tr>
                <th className="text-center">Imagem</th>
                <th className="text-center">Título</th>
                <th className="text-center">Sinopse</th>
                <th className="text-center">Gênero</th>
                <th className="text-center">Classificação</th>
                <th className="text-center">Duração</th>
                <th className="text-center">Estreia</th>
                <th className="text-center">Ações</th>
              </tr>
            </thead>
            <tbody>
              {movies.length > 0 ? (
                movies.map((movie, index) => (
                  <tr key={movie.id || index}> 
                    <td className="text-center">
                      <img 
                        src={movie.imageUrl} 
                        alt={movie.title} 
                        style={{ width: '50px', height: 'auto' }}
                        onError={(e) => {
                          e.target.src = '/assets/filme.jpg';
                        }}
                      />
                    </td>
                    <td className="text-center">{movie.title}</td>
                    <td className="text-center">{movie.synopsis}</td>
                    <td className="text-center">{movie.genre}</td>
                    <td className="text-center">{movie.rating}</td>
                    <td className="text-center">{movie.duration} min</td>
                    <td className="text-center">
                      {new Date(movie.releaseDate).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="text-center">
                      <div className="d-flex align-items-center justify-content-center gap-1">
                        <Button
                          text=""
                          variant="secondary"
                          size="btn-sm"
                          onClick={() => handleEditMovie(movie.id)}
                          icone="pencil"
                        />
                        <Button
                          text=""
                          variant="danger"
                          size="btn-sm"
                          onClick={() => handleDeleteMovie(movie.id)}
                          icone="trash"
                        />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center">Nenhum filme encontrado.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Table>
    </BlankLayout>
  );
}
