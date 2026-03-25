import './App.css';
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap/dist/js/bootstrap.min.js"
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import SignUp from './components/SignUp';
import HomePage from './components/HomePage';
import Team from './components/Team';
// import Project from './components/Project';
import ProjectDetail from './components/ProjectDetail';
import TeamDetail from './components/TeamDetail';
import TaskDetail from './components/TaskDetail';
import Reports from './components/Reports';
import Settings from './components/Settings';
function App() {
  return (
    <Router>
      <Routes>
        <Route path = "/" element = {<Login/>}/>
        <Route path = "/signUp" element = {<SignUp/>}/>
        <Route path = "/homePage" element = {<HomePage/>}/>
        <Route path = "/projects/:projectId" element = {<ProjectDetail/>}/>
        <Route path = "/teams" element = {<Team/>}/>
        {/* <Route path = "/projects" element = {<Project/>}/> */}
        <Route path = "/teams/:teamId" element = {<TeamDetail/>}/>
        <Route path = "/tasks/taskDetail/:taskId" element = {<TaskDetail/>}/>
        <Route path = "/reports" element = {<Reports/>}/>
        <Route path = "/settings" element = {<Settings/>}/>
      </Routes>
    </Router>
  );
}

export default App;
