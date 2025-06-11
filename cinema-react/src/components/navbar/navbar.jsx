import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate(); // Inicializar o hook useNavigate

  const handleNavigation = (path) => {
    navigate(path); // Navega para a rota especificada
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <button
          className="navbar-brand btn btn-link" // Adicionado btn btn-link para estilização, ou use <a> ou <Link>
          onClick={() => handleNavigation("/")} // Navega para a home
        >
          <i className="fa-solid fa-film ms-2 me-2"></i>Cineminha
        </button>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse" // Para Bootstrap 5, é data-bs-toggle
          data-bs-target="#navbarNav" // Para Bootstrap 5, é data-bs-target
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item active">
              <button
                className="nav-link btn btn-link" // Adicionado btn btn-link para estilização
                onClick={() => handleNavigation("/")} // Assumindo que / é sua home
              >
                Home
              </button>
            </li>
            <li className="nav-item">
              <button
                className="nav-link btn btn-link"
                onClick={() => handleNavigation("/filmes")} // Ajuste o path conforme suas rotas
              >
                Filmes
              </button>
            </li>
            <li className="nav-item">
              <button
                className="nav-link btn btn-link"
                onClick={() => handleNavigation("/salas")} // Ajuste o path
              >
                Salas
              </button>
            </li>
            <li className="nav-item">
              <button
                className="nav-link btn btn-link"
                onClick={() => handleNavigation("/sessoes")} // Ajuste o path
              >
                Sessões
              </button>
            </li>
            <li className="nav-item">
              <button
                className="nav-link btn btn-link"
                onClick={() => handleNavigation("/ingressos")} // Ajuste o path
              >
                Ingressos
              </button>
            </li>
          </ul>
        </div>
      </nav>
    </>
  );
}
