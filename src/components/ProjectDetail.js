import { useParams } from "react-router-dom";
import useFetch from "../useFetch";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Layout from "./Layout";
import Header from "./Header";

const ProjectDetail = () => {
  const [showModal, setShowModal] = useState(false);
  const [tasksArr, setTasksArr] = useState([]);
  const [sortBy, setSortBy] = useState("default");
  const [name, setName] = useState("");
  const [teamId, setTeamId] = useState("");
  const [owners, setOwners] = useState([]);
  const [timeToComplete, setTimeToComplete] = useState("");
  const [tags, setTags] = useState("High");
  const [status, setStatus] = useState("To Do");

  const param = useParams();
  const projectId = param.projectId;

  const { data, error, loading } = useFetch(
    `http://localhost:3001/projects/${projectId}`
  );
  const proj = data?.Project;

  const {
    data: tasks,
    error: tasksError,
    loading: tasksLoading,
  } = useFetch(`http://localhost:3001/tasks/project/${projectId}`);

  useEffect(() => {
    setTasksArr(tasks?.Tasks || []);
  }, [tasks]);

  const { data: users, error: usersError, loading: usersLoading } = useFetch(
    `http://localhost:3001/users`
  );
  const usersArr = users?.Users;

  const { data: team, error: teamError, loading: teamLoading } = useFetch(
    "http://localhost:3001/teams"
  );
  const teamsArr = team?.Teams || [];

  const getUserById = (id) => {
    if (users?.Users) {
      return users.Users.find((user) => user._id === id);
    }
    return null;
  };

  const getDueDateObj = (createdAt, timeToComplete) => {
    const date = new Date(createdAt);
    date.setDate(date.getDate() + (timeToComplete || 0));
    return date;
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
      status,
      tags: tagsArray,
      timeToComplete: Number(timeToComplete),
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
        throw new Error("Unable to add tasks");
      }
      const data = await response.json();

      if (data.Task) {
        setTasksArr((prevTasks) => [...prevTasks, data.Task]);
      }

      setShowModal(false);
      setName("");
      setTeamId("");
      setStatus("");
      setOwners([]);
      setTags("High");
      setTimeToComplete("");
    } catch {
      alert("unable to add task");
      setShowModal(false);
      setName("");
      setTeamId("");
      setStatus("");
      setOwners([]);
      setTags("High");
      setTimeToComplete("");
    }
  };

  const tagWeights = { high: 3, medium: 2, low: 1 };

  const sortedTasks = [...tasksArr].sort((a, b) => {
    if (sortBy === "dueDateAsc") {
      return getDueDateObj(a.createdAt, a.timeToComplete) - getDueDateObj(b.createdAt, b.timeToComplete);
    } else if (sortBy === "dueDateDesc") {
      return getDueDateObj(b.createdAt, b.timeToComplete) - getDueDateObj(a.createdAt, a.timeToComplete);
    } else if (sortBy === "tagDesc" || sortBy === "tagAsc") {
      const tagA = a.tags && a.tags.length > 0 ? a.tags[0].toLowerCase() : "";
      const tagB = b.tags && b.tags.length > 0 ? b.tags[0].toLowerCase() : "";

      const weightA = tagWeights[tagA] || 0;
      const weightB = tagWeights[tagB] || 0;

      if (sortBy === "tagDesc") {
        return weightB - weightA;
      } else {
        return weightA - weightB;
      }
    }
    return 0;
  });

  return (
    <div className="min-vh-100 bg-light d-flex flex-column">
      <Header />
      <div className="flex-grow-1 p-5 overflow-auto">
        {(loading || tasksLoading) && <p className="text-muted">Loading...</p>}
        {(!loading || !tasksLoading) && error && (
          <p className="text-danger">Error while fetching</p>
        )}

        {!loading && !tasksLoading && proj && (
          <div>
            <div className="mb-4">
              <h4 className="fw-bold mb-1">{proj.name}</h4>
              <h6 className="text-muted">{proj.description}</h6>
            </div>

            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
              <div className="d-flex align-items-center gap-2">
                <label className="fw-bold text-secondary small mb-0 text-nowrap">
                  Sort By:
                </label>
                <select
                  className="form-select form-select-sm shadow-sm"
                  style={{ width: "auto" }}
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="default">Default</option>
                  <option value="dueDateAsc">Due Date (Earliest)</option>
                  <option value="dueDateDesc">Due Date (Latest)</option>
                  <option value="tagDesc">Priority (High to Low)</option>
                  <option value="tagAsc">Priority (Low to High)</option>
                </select>
              </div>

              <button
                className="btn btn-primary btn-sm px-3 shadow-sm rounded-3"
                onClick={() => setShowModal(true)}
              >
                + New Task
              </button>

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
                            className="border rounded p-2 bg-white"
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
                          <div className="col-md-6 mb-3">
                            <label className="form-label fw-medium small">
                              Time to Complete (Days) *
                            </label>
                            <input
                              type="number"
                              className="form-control"
                              min="1"
                              value={timeToComplete}
                              onChange={(e) =>
                                setTimeToComplete(e.target.value)
                              }
                            />
                          </div>
                          <div className="col-md-6 mb-3">
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

                        <div className="mb-3">
                          <label className="form-label fw-medium small">
                            Tags
                          </label>
                          <select
                            className="form-select"
                            value={tags}
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

            <div className="row g-4">
              {sortedTasks.length > 0 &&
                sortedTasks.map((task) => (
                  <div className="col-md-4" key={task._id}>
                    <Link
                      to={`/tasks/taskDetail/${task._id}`}
                      style={{ textDecoration: "none" }}
                    >
                      <div className="card h-100 border-0 shadow-sm p-4 rounded-4 bg-light text-center">
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

                        <h6 className="fw-bold">{task.name}</h6>
                        
                        {task.tags && task.tags.length > 0 && (
                            <span className={`badge border mb-2 align-self-center ${
                              task.tags[0] === "High" ? "bg-danger-subtle text-danger" :
                              task.tags[0] === "Medium" ? "bg-warning-subtle text-warning" :
                              "bg-info-subtle text-info"
                            }`}>
                                Priority: {task.tags[0]}
                            </span>
                        )}

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
        )}
      </div>
    </div>
  );
};

export default ProjectDetail;