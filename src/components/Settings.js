import { useState, useEffect } from "react";
import useFetch from "../useFetch";
import Header from "./Header";

const Settings = () => {
  const [allProjects, setAllProjects] = useState([]);
  const [allTeams, setAllTeams] = useState([]);
  const [allTasks, setAllTasks] = useState([]);
  const [activeView, setActiveView] = useState("projects");

  const { data: projectsData } = useFetch(`${process.env.REACT_APP_API_URL}/projects`);
  const { data: teamsData } = useFetch(`${process.env.REACT_APP_API_URL}/teams`);
  const { data: tasksData } = useFetch(`${process.env.REACT_APP_API_URL}/tasks`);

  useEffect(() => {
    if (projectsData?.Projects) {
      setAllProjects(projectsData.Projects);
    }
    if (teamsData?.Teams) {
      setAllTeams(teamsData.Teams);
    }
    if (tasksData?.Task) {
      setAllTasks(tasksData.Task);
    }
  }, [projectsData, teamsData, tasksData]);

  const handleProjectDelete = async (projectId) => {
    setAllProjects(allProjects.filter((p) => p._id !== projectId));
    setAllTasks(allTasks.filter((t) => t.project !== projectId));

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/projects/${projectId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to delete project");
    } catch {
      setAllProjects(allProjects);
      alert("Error while trying to delete project.");
    }
  };

  const handleTeamDelete = async (teamId) => {
    setAllTeams(allTeams.filter((t) => t._id !== teamId));

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${process.env.REACT_APP_API_URL}/teams/${teamId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to delete team");
    } catch {
      setAllTeams(allTeams);
      alert("Error while trying to delete team.");
    }
  };

  const handleTaskDelete = async (taskId) => {
    setAllTasks(allTasks.filter((t) => t._id !== taskId));

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${process.env.REACT_APP_API_URL}/tasks/${taskId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to delete task");
    } catch {
      setAllTasks(allTasks);
      alert("Error while trying to delete task.");
    }
  };

  return (
<div className="min-vh-100 bg-light d-flex flex-column">    
    <Header/>
      <div className="flex-grow-1 p-3 p-md-5 overflow-auto w-100">
        <h2 className="fw-bold mb-4">Settings</h2>

        <div className="row g-3 g-md-4 mb-4 text-center">
          <div className="col-12 col-md-4">
            <div className="card p-4 border-0 shadow-sm rounded-4 border-4 border-start border-primary">
              <h6 className="text-muted fw-bold">Total Projects</h6>
              <h2 className="text-primary mb-0">{allProjects.length}</h2>
            </div>
          </div>
          <div className="col-12 col-md-4">
            <div className="card p-4 border-0 shadow-sm rounded-4 border-4 border-start border-success">
              <h6 className="text-muted fw-bold">Total Teams</h6>
              <h2 className="text-success mb-0">{allTeams.length}</h2>
            </div>
          </div>
          <div className="col-12 col-md-4">
            <div className="card p-4 border-0 shadow-sm rounded-4 border-4 border-start border-warning">
              <h6 className="text-muted fw-bold">Total Tasks</h6>
              <h2 className="text-warning mb-0">{allTasks.length}</h2>
            </div>
          </div>
        </div>

        <div className="d-flex flex-wrap gap-2 gap-md-3 mb-4 border-bottom pb-3">
          <button
            className={`btn rounded-pill px-4 ${
              activeView === "projects"
                ? "btn-primary shadow-sm"
                : "btn-light text-muted"
            }`}
            onClick={() => setActiveView("projects")}
          >
            Manage Projects
          </button>
          <button
            className={`btn rounded-pill px-4 ${
              activeView === "teams"
                ? "btn-primary shadow-sm"
                : "btn-light text-muted"
            }`}
            onClick={() => setActiveView("teams")}
          >
            Manage Teams
          </button>
          <button
            className={`btn rounded-pill px-4 ${
              activeView === "tasks"
                ? "btn-primary shadow-sm"
                : "btn-light text-muted"
            }`}
            onClick={() => setActiveView("tasks")}
          >
            Manage Tasks
          </button>
        </div>

        {activeView === "projects" && (
          <div>
            <h5 className="fw-bold mb-3">Manage Projects</h5>
            {allProjects.length === 0 && (
              <p className="text-muted">No projects found.</p>
            )}
            <div className="row g-3 g-md-4">
              {allProjects.map((project) => (
                <div className="col-12 col-md-4" key={project._id}>
                  <div className="card h-100 p-4 border-0 shadow-sm rounded-4 bg-white d-flex flex-column text-center">
                    <h6 className="fw-bold text-dark text-truncate">
                      {project.name}
                    </h6>
                    <p className="text-muted small mb-4 text-truncate">
                      {project.description}
                    </p>
                    <button
                      className="btn btn-outline-danger btn-sm mt-auto fw-medium rounded-3"
                      onClick={() => handleProjectDelete(project._id)}
                    >
                      <i className="bi bi-trash3 me-2"></i> Delete Project
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeView === "teams" && (
          <div>
            <h5 className="fw-bold mb-3">Manage Teams</h5>
            {allTeams.length === 0 && (
              <p className="text-muted">No teams found.</p>
            )}
            <div className="row g-3 g-md-4">
              {allTeams.map((team) => (
                <div className="col-12 col-md-4" key={team._id}>
                  <div className="card h-100 p-4 border-0 shadow-sm rounded-4 bg-white d-flex flex-column text-center">
                    <h6 className="fw-bold text-dark text-truncate">
                      {team.name}
                    </h6>
                    <p className="text-muted small mb-4 text-truncate">
                      {team.description}
                    </p>
                    <button
                      className="btn btn-outline-danger btn-sm mt-auto fw-medium rounded-3"
                      onClick={() => handleTeamDelete(team._id)}
                    >
                      <i className="bi bi-trash3 me-2"></i> Delete Team
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeView === "tasks" && (
          <div>
            <h5 className="fw-bold mb-3">Manage Tasks</h5>
            {allTasks.length === 0 && (
              <p className="text-muted">No tasks found.</p>
            )}
            <div className="row g-3 g-md-4">
              {allTasks.map((task) => (
                <div className="col-12 col-md-4" key={task._id}>
                  <div className="card h-100 p-4 border-0 shadow-sm rounded-4 bg-white d-flex flex-column justify-content-center text-center">
                    <div className="d-flex flex-column align-items-center mb-3 gap-2 text-center">
                      <h6 className="fw-bold text-dark mb-0 lh-base text-center">
                        {task.name}
                      </h6>
                      <span
                        className={`badge rounded-pill text-nowrap text-center ${
                          task.status === "Completed"
                            ? "bg-success-subtle text-success"
                            : task.status === "In Progress"
                            ? "bg-warning-subtle text-warning"
                            : "bg-danger-subtle text-danger"
                        }`}
                      >
                        {task.status || "To Do"}
                      </span>
                    </div>
                    <p className="text-muted small mb-4">
                      Time to Complete: {task.timeToComplete} days
                    </p>
                    <button
                      className="btn btn-outline-danger btn-sm mt-auto fw-medium rounded-3"
                      onClick={() => handleTaskDelete(task._id)}
                    >
                      <i className="bi bi-trash3 me-2"></i> Delete Task
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      </div>
  );
};

export default Settings;
