import { useEffect, useState } from "react";
import useFetch from "../useFetch";
import { Link } from "react-router-dom";
import Header from "./Header";

const Team = () => {
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [members, setMembers] = useState([]);

  const [teamsArr, setTeamsArr] = useState([]);

  const { data, error, loading } = useFetch(`${process.env.REACT_APP_API_URL}/teams`);
  console.log("Data", data);
  console.log("Error", error);
  useEffect(() => {
    setTeamsArr(data?.Teams || []);
  }, [data]);
  console.log("TEAMS", teamsArr);

  const {
    data: user,
    error: userError,
    loading: userLoading,
  } = useFetch(`${process.env.REACT_APP_API_URL}/users`);
  const usersArr = user?.Users;

  const handleCreateTeam = async () => {
    if (!name.trim()) {
      alert("Team name is required!");
      return;
    }

    const payload = {
      name,
      description,
      members,
    };

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${process.env.REACT_APP_API_URL}/teams`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to create team");
      }

      const data = await response.json();

      setShowModal(false);
      if (data.Team) {
        setTeamsArr((prevTeams) => [...prevTeams, data.Team]);
      }
      setName("");
      setDescription("");
      setMembers([]);
    } catch (error) {
      console.error(error);
      alert("Error creating team.");
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100" style={{ backgroundColor: "#ffffff" }}>
      <Header />
       {loading && (
                <div
                  className="d-flex justify-content-center align-items-center"
                  style={{ minHeight: "400px" }}
                >
                  <div className="text-center">
                    <div
                      className="spinner-border text-primary"
                      style={{ width: "3rem", height: "3rem" }}
                      role="status"
                    >
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-3 fs-5 text-muted">Fetching...</p>
                  </div>
                </div>
              )}  
      {!loading && error && <p>Error while fetching teams</p>}
      {!loading &&
      <div className="mt-5 container">
        <div className="row g-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div className="d-flex align-items-center gap-3">
              <h4 className="fw-bold mb-0">Teams</h4>
            </div>
            <Link
              className="btn btn-primary btn-sm px-3 shadow-sm rounded-3"
              onClick={() => setShowModal(true)}
            >
              + New Team
            </Link>

            {showModal && (
              <div
                className="modal show d-block"
                tabIndex="-1"
                style={{ backgroundColor: "rgba(0, 0, 0, 0.6)", zIndex: 1050 }}
              >
                <div className="modal-dialog modal-dialog-centered">
                  <div className="modal-content border-0 shadow-lg rounded-4">
                    {/* Modal Header */}
                    <div className="modal-header border-bottom-0 pb-0">
                      <h5 className="modal-title fw-bold">Create Team</h5>
                      <button
                        type="button"
                        className="btn-close"
                        onClick={() => setShowModal(false)}
                      ></button>
                    </div>

                    {/* Modal Body */}
                    <div className="modal-body">
                      <div className="mb-3">
                        <label className="form-label fw-medium text-secondary small">
                          Team Name *
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="e.g. Frontend Guild"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                        />
                      </div>

                      <div className="mb-3">
                        <label className="form-label fw-medium text-secondary small">
                          Description
                        </label>
                        <textarea
                          className="form-control"
                          rows="2"
                          placeholder="What does this team do?"
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                        ></textarea>
                      </div>

                      {/* Simple Scrollable Checkbox List for Members */}
                      <div className="mb-3">
                        <label className="form-label fw-medium text-secondary small">
                          Team Members
                        </label>
                        <div
                          className="border rounded p-2 bg-white"
                          style={{ maxHeight: "150px", overflowY: "auto" }}
                        >
                          {usersArr?.map((u) => (
                            <div key={u._id} className="form-check mb-1">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                id={`member-${u._id}`}
                                checked={members.includes(u._id)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setMembers([...members, u._id]);
                                  } else {
                                    setMembers(
                                      members.filter((id) => id !== u._id)
                                    );
                                  }
                                }}
                              />
                              <label
                                className="form-check-label text-dark small"
                                htmlFor={`member-${u._id}`}
                              >
                                {u.name}
                              </label>
                            </div>
                          ))}
                          {!usersArr && (
                            <span className="text-muted small">
                              Loading users...
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Modal Footer */}
                    <div className="modal-footer border-top-0 pt-0">
                      <button
                        type="button"
                        className="btn btn-light"
                        onClick={() => setShowModal(false)}
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        className="btn btn-primary px-4"
                        onClick={handleCreateTeam}
                      >
                        Create
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {teamsArr.length > 0 &&
            teamsArr.map((team) => (
              <div className="col-md-6" key={team._id}>
                <Link to={`/teams/${team._id}`} style = {{textDecoration: "none"}}>
                  <div className="card h-100 border-0 shadow-sm p-4 rounded-4 bg-light bg-opacity-50 text-center">
                    <h6 className="fw-bold text-dark">{team.name}</h6>
                    <p
                      className="text-muted small mb-0"
                      style={{
                        overflow: "hidden",
                      }}
                    >
                      {team.description || "No description provided."}
                    </p>
                  </div>
                </Link>
              </div>
            ))}
        </div>
      </div>
}
      
    </div>
  );
};

export default Team;
