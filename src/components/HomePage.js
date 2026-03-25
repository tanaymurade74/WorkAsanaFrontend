import { useState, useEffect } from "react";
import useFetch from "../useFetch";
import { Link } from "react-router-dom";
import Header from "./Header";

const HomePage = () => {
  const [showModal, setShowModal] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [projectModal, setProjectModal] = useState(false);

  const [name, setName] = useState("");
  const [projectId, setProjectId] = useState("");
  const [teamId, setTeamId] = useState("");
  const [owners, setOwners] = useState([]);
  const [timeToComplete, setTimeToComplete] = useState("");
  const [tags, setTags] = useState("High");
  const [status, setStatus] = useState("To Do");

  const [projectsArray, setProjectsArray] = useState([]);
  const [tasksArray, setTasksArray] = useState([]);

  const [localSearch, setLocalSearch] = useState("");
  const [search, setSearch] = useState("");

  const { data, error, loading } = useFetch("http://localhost:3001/projects");

  const userString = localStorage.getItem("user");
  const user = userString ? JSON.parse(userString) : null;
  const userId = user ? user.id || user._id : "";

  const {
    data: userTask,
    error: userTaskError,
    loading: userTaskLoading,
  } = useFetch(`http://localhost:3001/tasks/${userId}`);

  useEffect(() => {
    setProjectsArray(data?.Projects || []);
    setTasksArray(userTask?.Task || []);
  }, [data, userTask]);

  useEffect(() => {
    const debounceSearch = setTimeout(() => {
      setSearch(localSearch);
    }, 500);
    return () => clearTimeout(debounceSearch);
  }, [localSearch]);

  const { data: users } = useFetch(`http://localhost:3001/users`);
  const usersArr = users?.Users;

  const { data: team } = useFetch(`http://localhost:3001/teams`);
  const teamsArr = team?.Teams || [];

  const getUserById = (id) => {
    if (users?.Users) {
      return users.Users.find((user) => user._id === id);
    }
    return null;
  };

  const getDueDate = (date, days) => {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + days);
    return newDate.toDateString();
  };

  const handleCreateProject = async () => {
    const payload = {
      name: projectName,
      description: projectDescription,
    };

    try {
      const response = await fetch(`http://localhost:3001/projects`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Unable to create project");
      }

      const data = await response.json();
      if (data.Project) {
        setProjectsArray((prevProj) => [...prevProj, data.Project]);
      }

      setProjectModal(false);
      setProjectDescription("");
      setProjectName("");
    } catch (error) {
      alert("unable to create project");
    }
  };

  const handleCreateTask = async () => {
    const tagsArray = tags
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag !== "");

    const payload = {
      name,
      project: projectId,
      team: teamId,
      owners,
      timeToComplete: Number(timeToComplete),
      tags: tagsArray,
      status,
    };

    try {
      const response = await fetch("http://localhost:3001/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        throw new Error("unable to add task");
      }

      const data = await response.json();

      if (data.Task) {
        if (data.Task.owners.find((t) => t === userId)) {
          setTasksArray((prevTasks) => [...prevTasks, data.Task]);
        }
      }

      setShowModal(false);
      setName("");
      setProjectId("");
      setTeamId("");
      setStatus("");
      setOwners([]);
      setTags("");
      setTimeToComplete("");
    } catch {
      alert("Unable to add task");
      setShowModal(false);
      setName("");
      setProjectId("");
      setTeamId("");
      setStatus("");
      setOwners([]);
      setTags("");
      setTimeToComplete("");
    }
  };

  const filteredProjects = projectsArray.filter((proj) => {
    const projName = proj.name || proj.title || "";
    
    return projName
      .toLowerCase()
      .trim()
      .includes(search.toLowerCase().trim());
  });

  return (
    <div className="min-vh-100 bg-light d-flex flex-column">
      <Header />
      <div className="flex-grow-1 p-5 overflow-auto text-center">
        
        <div className="mb-5">
          <div className="input-group shadow-sm rounded-3">
            <span className="input-group-text bg-white border-end-0 text-muted">
              <i className="bi bi-search"></i>
            </span>
            <input
              type="text"
              className="form-control border-start-0 ps-0"
              placeholder="Search Projects..."
              style={{ boxShadow: "none" }}
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="mb-5">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div className="d-flex align-items-center gap-3">
              <h4 className="fw-bold mb-0">Projects</h4>
            </div>
            <Link
              className="btn btn-primary btn-sm px-3 shadow-sm rounded-3"
              onClick={(e) => setProjectModal(true)}
            >
              + New Project
            </Link>

            {projectModal && (
              <div
                className="modal show d-block"
                tabIndex="-1"
                style={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }}
              >
                <div className="modal-dialog modal-dialog-centered">
                  <div className="modal-content border-0 shadow-lg rounded-4">
                    <div className="modal-header border-bottom-0 pb-0">
                      <h5 className="modal-title fw-bold">Create Project</h5>
                      <button
                        type="button"
                        className="btn-close"
                        onClick={() => setProjectModal(false)}
                      ></button>
                    </div>

                    <div className="modal-body">
                      <div className="mb-3">
                        <label className="form-label fw-medium text-secondary small">
                          Project Name
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="e.g. Website Redesign"
                          value={projectName}
                          onChange={(e) => setProjectName(e.target.value)}
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label fw-medium text-secondary small">
                          Description
                        </label>
                        <textarea
                          className="form-control"
                          rows="3"
                          placeholder="What is this project about?"
                          value={projectDescription}
                          onChange={(e) =>
                            setProjectDescription(e.target.value)
                          }
                        ></textarea>
                      </div>
                    </div>

                    <div className="modal-footer border-top-0 pt-0">
                      <button
                        type="button"
                        className="btn btn-light"
                        onClick={() => setProjectModal(false)}
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        className="btn btn-primary px-4"
                        onClick={handleCreateProject}
                      >
                        Create
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {loading && <p className="text-muted">Loading projects...</p>}
          {!loading && error && <p className="text-danger">Error loading projects.</p>}
          
          {!loading && filteredProjects.length === 0 && (
            <p className="text-muted">No projects found matching "{search}".</p>
          )}

          <div className="row g-4">
            {filteredProjects.map((proj) => (
              <div className="col-md-4" key={proj._id}>
                <Link
                  to={`/projects/${proj._id}`}
                  style={{ textDecoration: "none" }}
                  className="none"
                >
                  <div className="card h-100 border-0 shadow-sm p-4 rounded-4 bg-light bg-opacity-50">
                    <h6 className="fw-bold text-dark">
                      {proj.name || proj.title}
                    </h6>
                    <p
                      className="text-muted small mb-0"
                      style={{
                        overflow: "hidden",
                      }}
                    >
                      {proj.description || "No description provided."}
                    </p>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div className="d-flex align-items-center gap-3">
              <h4 className="fw-bold mb-0">My Tasks</h4>
            </div>
            <Link
              className="btn btn-primary btn-sm px-3 shadow-sm rounded-3"
              onClick={() => setShowModal(true)}
            >
              + New Task
            </Link>

            {showModal && (
              <div
                className="modal show d-block"
                tabIndex="-1"
                style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
              >
                <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                  <div className="modal-content border-0 shadow-lg rounded-4">
                    <div className="modal-header">
                      <h5 className="modal-title fw-bold">Create Task</h5>
                      <button
                        type="button"
                        className="btn-close"
                        onClick={() => setShowModal(false)}
                      ></button>
                    </div>

                    <div className="modal-body text-start">
                      <div className="mb-3">
                        <label className="form-label fw-medium small">
                          Task Name *
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                        />
                      </div>

                      <div className="mb-3">
                        <label className="form-label fw-medium small">
                          Project *
                        </label>
                        <select
                          className="form-select"
                          value={projectId}
                          onChange={(e) => setProjectId(e.target.value)}
                        >
                          <option value="">Select a Project...</option>
                          {projectsArray.map((p) => (
                            <option key={p._id} value={p._id}>
                              {p.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="mb-3">
                        <label className="form-label fw-medium small">
                          Team *
                        </label>
                        <select
                          className="form-select"
                          value={teamId}
                          onChange={(e) => setTeamId(e.target.value)}
                        >
                          <option value="">Select a Team...</option>
                          {teamsArr.map((t) => (
                            <option key={t._id} value={t._id}>
                              {t.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="mb-3">
                        <label className="form-label fw-medium small text-muted">
                          Owners *
                        </label>
                        <div
                          className="border rounded p-2 bg-white text-start"
                          style={{ maxHeight: "120px", overflowY: "auto" }}
                        >
                          {usersArr?.map((u) => (
                            <div key={u._id} className="form-check mb-1">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                id={`owner-${u._id}`}
                                checked={owners.includes(u._id)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setOwners([...owners, u._id]);
                                  } else {
                                    setOwners(
                                      owners.filter((id) => id !== u._id)
                                    );
                                  }
                                }}
                              />
                              <label
                                className="form-check-label text-dark small"
                                htmlFor={`owner-${u._id}`}
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

                      <div className="row">
                        <div className="col-md-6 mb-3 text-start">
                          <label className="form-label fw-medium small">
                            Time to Complete (Days) *
                          </label>
                          <input
                            type="number"
                            className="form-control"
                            min="1"
                            value={timeToComplete}
                            onChange={(e) => setTimeToComplete(e.target.value)}
                          />
                        </div>
                        <div className="col-md-6 mb-3 text-start">
                          <label className="form-label fw-medium small">
                            Status
                          </label>
                          <select
                            className="form-select"
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                          >
                            <option value="To Do">To Do</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                            <option value="Blocked">Blocked</option>
                          </select>
                        </div>
                      </div>

                      <div className="mb-3 text-start">
                        <label className="form-label fw-medium small">
                          Tags
                        </label>
                        <select
                          className="form-select"
                          value={status}
                          onChange={(e) => setTags(e.target.value)}
                        >
                          <option value="High">High</option>
                          <option value="Medium">Medium</option>
                          <option value="Low">Low</option>
                        </select>
                      </div>
                    </div>

                    <div className="modal-footer">
                      <button
                        type="button"
                        className="btn btn-light"
                        onClick={() => setShowModal(false)}
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={handleCreateTask}
                      >
                        Create Task
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {userTaskLoading && <p className="text-muted">Loading tasks...</p>}
          {userTaskError && <p className="text-danger">Error loading tasks.</p>}
          {!userTaskLoading && tasksArray.length === 0 && (
            <p className="text-muted">No tasks assigned to you yet.</p>
          )}

          <div className="row g-4">
            {tasksArray.map((task) => (
              <div className="col-md-4" key={task._id}>
                <Link to={`/tasks/taskDetail/${task._id}`} style={{ textDecoration: "none" }}>
                  <div className="card h-100 border-0 shadow-sm p-4 rounded-4 bg-light bg-opacity-50 d-flex flex-column">
                    <div className="mb-3">
                      <span
                        className={`badge rounded-pill ${
                          task.status === "Completed"
                            ? "bg-success-subtle text-success"
                            : task.status === "In Progress"
                            ? "bg-warning-subtle text-warning"
                            : "bg-danger-subtle text-danger"
                        }`}
                      >
                        {task.status || "In Progress"}
                      </span>
                    </div>
                    <h6 className="fw-bold text-dark">
                      {task.name || task.title}
                    </h6>
                    <p className="text-muted small mb-4">
                      {`Due on: ${getDueDate(
                        task.createdAt,
                        task.timeToComplete
                      )}`}
                    </p>

                    <div className="mt-auto d-flex justify-content-center gap-1">
                      {task.owners &&
                        task.owners.map((ownerId, idx) => {
                          const ownerObj = getUserById(ownerId);

                          const ownerName = ownerObj
                            ? ownerObj.name
                            : "Unknown";
                          const initials =
                            ownerName !== "Unknown"
                              ? ownerName
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")
                                  .toUpperCase()
                              : "?";

                          return (
                            <div
                              key={idx}
                              className="rounded-circle text-white d-flex align-items-center justify-content-center fw-bold shadow-sm"
                              style={{
                                width: "28px",
                                height: "28px",
                                fontSize: "0.7rem",
                                backgroundColor:
                                  idx % 2 === 0 ? "#f8aa54" : "#5d3fd3",
                              }}
                              title={ownerName}
                            >
                              {initials}
                            </div>
                          );
                        })}
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;