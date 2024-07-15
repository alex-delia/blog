import { Outlet, Navigate } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "./context/AuthContext";
import NavBar from "./components/layout/Navbar";

function App() {
  const { isAuthenticated } = useContext(AuthContext);

  if (!isAuthenticated) {
    return <Navigate to='login' replace />;
  }

  return (
    <div className='min-h-screen lg:px-40 md:px-20 px-10 pb-20'>
      <NavBar />
      <Outlet />
    </div>
  );
}

export default App;
