import { Link } from "react-router-dom";
import useFetch from "../useFetch"; 
import { Bar, Line, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import Header from "./Header";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Reports = () => {
  const { data: lastWeekRaw, loading: loading1, error: err1 } = useFetch(`${process.env.REACT_APP_API_URL}/report/lastWeek`);
  const { data: pendingRaw, loading: loading2, error: err2 } = useFetch(`${process.env.REACT_APP_API_URL}/report/pending`);
  const { data: closedRaw, loading: loading3, error: err3 } = useFetch(`${process.env.REACT_APP_API_URL}/report/closedTasks`);
  const { data: projectsRaw, loading: loading4, error: err4 } = useFetch(`${process.env.REACT_APP_API_URL}/projects`);

  const isLoading = loading1 || loading2 || loading3 || loading4;
  const hasError = err1 || err2 || err3 || err4;

  let workDone = null;
  let pending = null;
  let team = null;
  let owner = null;

  if (!isLoading && !hasError && lastWeekRaw && pendingRaw && closedRaw && projectsRaw) {
    
    const daysOfWeek = [0, 0, 0, 0, 0, 0, 0];
    lastWeekRaw.Tasks?.forEach((task) => {
      const dayIndex = new Date(task.updatedAt).getDay();
      daysOfWeek[dayIndex] += 1;
    });
    // const reorderedDays = [...daysOfWeek.slice(1), daysOfWeek[0]];

    workDone = {
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      datasets: [
        {
          label: "Tasks Completed",
          data: daysOfWeek,
          borderColor: "#5d3fd3",
          backgroundColor: "rgba(93, 63, 211, 0.2)",
          tension: 0.3,
          fill: true,
        },
      ],
    };

    const projectMap = {};
    projectsRaw.Projects?.forEach((p) => {
      projectMap[p._id] = p.name;
    });

    const pendingByProject = pendingRaw.Tasks?.reduce((acc, task) => {
      const projName = projectMap[task.project] || "Unassigned";
      acc[projName] = (acc[projName] || 0) + (task.timeToComplete || 0);
      return acc;
    }, {});

    pending = {
      labels: Object.keys(pendingByProject || {}),
      datasets: [
        {
          label: "Days Pending",
          data: Object.values(pendingByProject || {}),
          backgroundColor: "#f8aa54",
          borderRadius: 4,
        },
      ],
    };

    team = {
      labels: Object.keys(closedRaw.byTeam || {}),
      datasets: [
        {
          label: "Tasks Closed",
          data: Object.values(closedRaw.byTeam || {}),
          backgroundColor: ["#5d3fd3", "#f8aa54", "#e83e8c", "#0dcaf0", "#20c997", "#ffc107"],
          borderWidth: 0,
        },
      ],
    };

    owner = {
      labels: Object.keys(closedRaw.byOwner || {}),
      datasets: [
        {
          label: "Tasks Closed",
          data: Object.values(closedRaw.byOwner || {}),
          backgroundColor: "#20c997",
          borderRadius: 4,
        },
      ],
    };
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "bottom" },
    },
  };

  return (
      
<div className="min-vh-100 bg-light d-flex flex-column">
    <Header/>
          <div className="flex-grow-1 p-5 overflow-auto">
        <div className="d-flex justify-content-between align-items-center mb-5">
          <h2 className="fw-bold mb-0">Report Overview</h2>
        </div>

         {isLoading && (
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
        {hasError && <p className="text-danger fw-bold">Error loading reports: {hasError}</p>}

        {!isLoading && !hasError && workDone && pending && team && owner && (
          <div className="row g-4">
            <div className="col-md-6">
              <div className="card border-0 shadow-sm rounded-4 p-4 h-100">
                <h6 className="fw-bold text-muted mb-4">Total Work Done Last Week</h6>
                <div style={{ height: "300px" }}>
                  <Line data={workDone} options={chartOptions} />
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div className="card border-0 shadow-sm rounded-4 p-4 h-100">
                <h6 className="fw-bold text-muted mb-4">Total Days of Work Pending</h6>
                <div style={{ height: "300px" }}>
                  {pending.labels.length > 0 ? (
                    <Bar data={pending} options={chartOptions} />
                  ) : (
                    <p className="text-muted mt-5 text-center">No pending tasks found.</p>
                  )}
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div className="card border-0 shadow-sm rounded-4 p-4 h-100">
                <h6 className="fw-bold text-muted mb-4">Tasks Closed by Team</h6>
                <div style={{ height: "300px", display: "flex", justifyContent: "center" }}>
                  {team.labels.length > 0 ? (
                    <Doughnut data={team} options={chartOptions} />
                  ) : (
                    <p className="text-muted mt-5 text-center">No closed tasks found.</p>
                  )}
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div className="card border-0 shadow-sm rounded-4 p-4 h-100">
                <h6 className="fw-bold text-muted mb-4">Tasks Closed by Owner</h6>
                <div style={{ height: "300px" }}>
                  {owner.labels.length > 0 ? (
                    <Bar data={owner} options={{ ...chartOptions, indexAxis: "y" }} />
                  ) : (
                    <p className="text-muted mt-5 text-center">No closed tasks found.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      </div>
  );
};

export default Reports;