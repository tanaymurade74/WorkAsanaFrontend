import { useParams } from "react-router-dom";
import useFetch from "../useFetch";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Header from "./Header";
const TaskDetail = () => {
    const[task, setTask] = useState();
  const { taskId } = useParams();

  const { data, error, loading } = useFetch(
    `${process.env.REACT_APP_API_URL}/tasks/taskDetail/${taskId}`
  );
  console.log(data);
  useEffect(() => {
    setTask(data?.Task)
  }, [data])

  const {
    data: user,
    error: userError,
    loading: userLoading,
  } = useFetch(`${process.env.REACT_APP_API_URL}/users`);
  //   console.log("user",user?.Users);

  const usersArr = user?.Users || [];
  //   console.log("users",usersArr)

  const {
    data: project,
    error: projectError,
    loading: projectLoading,
  } = useFetch(`${process.env.REACT_APP_API_URL}/projects`);
  const projArr = project?.Projects || [];

  const {
    data: team,
    error: teamError,
    loading: teamLoading,
  } = useFetch(`${process.env.REACT_APP_API_URL}/teams`);
  const teamArr = team?.Teams || [];

  const getUserById = (id) => {
    if (usersArr) {
      return usersArr.find((us) => us._id === id);
    }
    return null;
  };

  const getByProjectId = (id) => {
    if (projArr.length > 0) {
      return projArr.find((proj) => proj._id === id);
    }
    return null;
  };

  const getByTeamId = (id) => {
    if (teamArr.length > 0) {
      return teamArr.find((team) => team._id === id);
    }
    return null;
  };

  const Project = getByProjectId(`${task?.project}`);
  const Team = getByTeamId(`${task?.team}`);

  const DueDate = (createdAt) => {
    const date = new Date(createdAt);
    date.setDate(date.getDate() + task.timeToComplete)
    console.log(date)
    return date.toDateString();

  }

  console.log("Project", Project);
  console.log("Team", team);

  console.log(data);


  const markTaskComplete =async  () => {


    const payload = {
        status: "Completed"
    }
    console.log("Payload", payload)

    try{
        const response = await fetch(`${process.env.REACT_APP_API_URL}/tasks/${task._id}`, {
            method: "PATCH",
            headers : {
                "Content-Type": "application/json",
                 "Authorization": `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify(payload)
        }       
        )

        if(!response.ok){
            throw new Error("Unable to update")
        }

        const data = await response.json();
        console.log(data);
        setTask(prevTask => ({
            ...prevTask,
            status: "Completed"
        }))

    }catch{

        alert("Unable to update status to completed.")

    }

  }

  return (
    <div className="d-flex flex-column min-vh-100" style={{ backgroundColor: "#ffffff" }}>
        <Header/>
    

      <div className="mt-5 container">
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
        {!loading && error && <p>Error...</p>}

        {!loading && task && (
          <div className="text-center">
            <h2 className="fw-bold shadow-sm mb-3">{task.name}</h2>

            <div className="card h-100 border-0 shadow-sm p-4 mt-3 rounded-4 bg-light bg-opacity-50 d-flex flex-column">
              <div>
                <span
                  className={`badge rounded-pill ${
                    task.status === "Completed"
                      ? "bg-success-subtle text-success"
                      : task.status === "In Progress"
                      ? "bg-warning-subtle text-warning"
                      : "bg-danger-subtle text-danger"
                  } mb-3`}
                >
                  {task.status || "In Progress"}
                </span>
                <h5>{Team?.name}</h5>
                <h5 className="text-secondary">{Project?.name}</h5>
                <p>{`Due Date - ${DueDate(task.createdAt)}`}</p>

                <div className="mt-auto d-flex flex-column gap-1">
                  {task.owners.map((owner, index) => {
                    const userObj = getUserById(owner);
                    const userName = userObj ? userObj.name : "Unknown";
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
                        key={userObj}
                        className="d-flex align-items-center justify-content-center gap-3 "
                      >
                        <div
                          key={userObj}
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
                </div>
              </div>

             {task.status !== "Completed" ?  <button onClick = {() => markTaskComplete()} className="btn btn-primary mt-3">Mark Complete</button> : ""}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskDetail;
