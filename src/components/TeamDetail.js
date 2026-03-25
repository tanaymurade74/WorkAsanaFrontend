import { useParams } from "react-router-dom";
import useFetch from "../useFetch";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Header from "./Header";

const TeamDetail = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [team, setTeam] = useState();

  const { teamId } = useParams();

  const { data, error, loading } = useFetch(
    `http://localhost:3001/teams/${teamId}`
  );

  console.log(data?.Team);
  
  useEffect(() => {
    setTeam(data?.Team)
  }, [data])

  const {
    data: users,
    error: usersError,
    loading: usersLoading,
  } = useFetch(`http://localhost:3001/users`);

  const getUserById = (id) => {
    if (users?.Users) {
      return users.Users.find((user) => user._id === id);
    }
    return null;
  };

  const handleOpenModal = () => {
    setSelectedMembers(team?.members || []);
    setShowModal(true);
  };

  const addMember = async (e) => {

    try{
        const response = await fetch(`http://localhost:3001/teams/${team._id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify({members: selectedMembers})
        })

        if (!response.ok) {
        throw new Error("Failed to update team members");
      }

      setShowModal(false);
      team.members = selectedMembers;
    }catch (error) {
      console.error(error);
      alert("Error updating team members");
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100" style={{ backgroundColor: "#ffffff" }}>
        <Header/>
      
      <div className="flex-grow-1 p-5 overflow-auto justify-content-center text-center">
        <div>
          <Link to="/teams" className="bi bi-arrow-left fw-bold">
            <i />
            Back To Teams
          </Link>
        </div>

        {loading && <p>Loading ...</p>}
        {!loading && error && <p>Error</p>}

        {!loading && team && (
          <div className="mt-5">
            <h2>{team.name}</h2>

            <h4 className="fw-light mt-5 mb-4">Members</h4>

            <div className="mt-auto d-flex flex-column gap-2">
              {team.members.length > 0 &&
                team.members.map((member, index) => {
                  const user = getUserById(member);

                  const userName = user ? user.name : "Unknown";
                  const initials =
                    userName !== "Unknown"
                      ? userName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()
                      : "?";

                  return (
                    <div
                      key={member}
                      className="d-flex align-items-center justify-content-center gap-3"
                    >
                      <div
                        className="rounded-circle text-white d-flex align-items-center justify-content-center fw-bold shadow-sm"
                        style={{
                          width: "28px",
                          height: "28px",
                          fontSize: "0.7rem",
                          backgroundColor:
                            index % 2 === 0 ? "#f8aa54" : "#5d3fd3",
                        }}
                        title={userName}
                      >
                        {initials}
                      </div>
                      <span className="fw-medium text-dark">{userName}</span>
                    </div>
                  );
                })}
              <button
                onClick={() => handleOpenModal()}
                className="btn btn-primary mt-3"
              >
                + Member
              </button>
              {showModal && (
                <div
                  className="modal show d-block"
                  tabIndex="-1"
                  style={{
                    backgroundColor: "rgba(0, 0, 0, 0.6)",
                    zIndex: 1050,
                  }}
                >
                  <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content border-0 shadow-lg rounded-4">
                      <div className="modal-header border-bottom-0 pb-0">
                        <h5 className="modal-title fw-bold">
                          Manage Team Members
                        </h5>
                        <button
                          type="button"
                          className="btn-close"
                          onClick={() => setShowModal(false)}
                        ></button>
                      </div>

                      <div className="modal-body">
                        <div className="mb-3">
                          <label className="form-label fw-medium text-secondary small">
                            Select Members
                          </label>
                          <div
                            className="border rounded p-2 bg-white"
                            style={{ maxHeight: "250px", overflowY: "auto" }}
                          >
                            {users?.Users?.map((u) => (
                              <div key={u._id} className="form-check mb-2">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  id={`member-${u._id}`}
                                  checked={selectedMembers.includes(u._id)}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setSelectedMembers([
                                        ...selectedMembers,
                                        u._id,
                                      ]);
                                    } else {
                                      setSelectedMembers(
                                        selectedMembers.filter(
                                          (id) => id !== u._id
                                        )
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
                            {!users?.Users && (
                              <span className="text-muted small">
                                Loading users...
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

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
                          onClick={addMember}
                        >
                          Save Changes
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamDetail;
