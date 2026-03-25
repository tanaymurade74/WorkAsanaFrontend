import { NavLink, useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div>
      <nav className="navbar navbar-expand-md bg-white shadow-sm sticky-top p-3">
        <div className="container-fluid">
          
          <NavLink 
            className="navbar-brand fw-bold text-decoration-none" 
            to="/homePage" 
            style={{ color: "purple", fontSize: "1.5rem" }}
          >
            workasana
          </NavLink>

          <button
            className="navbar-toggler border-0 shadow-none"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto gap-2 gap-md-4 mt-3 mt-md-0">
              
              <li className="nav-item">
                <NavLink className="nav-link fw-medium d-flex align-items-center text-secondary" to="/homePage">
                  <i className="bi bi-grid-fill fs-5 me-2"></i> Dashboard
                </NavLink>
              </li>

              <li className="nav-item">
                <NavLink className="nav-link fw-medium d-flex align-items-center text-secondary" to="/teams">
                  <i className="bi bi-people fs-5 me-2"></i> Team
                </NavLink>
              </li>

              <li className="nav-item">
                <NavLink className="nav-link fw-medium d-flex align-items-center text-secondary" to="/reports">
                  <i className="bi bi-bar-chart fs-5 me-2"></i> Reports
                </NavLink>
              </li>

              <li className="nav-item">
                <NavLink className="nav-link fw-medium d-flex align-items-center text-secondary" to="/settings">
                  <i className="bi bi-gear-fill fs-5 me-2"></i> Settings
                </NavLink>
              </li>

              <li className="nav-item d-flex align-items-center mt-2 mt-md-0 ms-md-3">
                <button 
                  onClick={handleLogout} 
                  className="btn btn-outline-danger fw-bold rounded-pill px-4 w-100"
                >
                  <i className="bi bi-box-arrow-right me-2"></i> Logout
                </button>
              </li>

            </ul>
          </div>
          
        </div>
      </nav>
    </div>
  );
};

export default Header;