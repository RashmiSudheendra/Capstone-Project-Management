import AppLayout from "./components/AppLayout";
import { Routes, Route } from "react-router-dom";
import Task from "./components/Task";
import Login from "./components/Login";
// import Welcome from "./components/Welcome";
// import Navbar from "./components/Navbar";
// import Sidebar from "./components/Sidebar";
import Signup from "./components/Signup";

function App() {
  console.log('render app..')
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/project/:projectId" element={<Task />} />
        <Route path="/project" element={<AppLayout/>}/>
      </Routes>
    </>
  );
}

export default App;
