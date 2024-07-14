import { Outlet, Navigate } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "./context/AuthContext";
import Button from "./components/common/Button";

function App() {
  const { isAuthenticated, logout } = useContext(AuthContext);

  if (!isAuthenticated) {
    return <Navigate to='login' replace />;
  }

  return (
    <div className='min-h-screen lg:px-40 md:px-20 px-10 pb-20'>
      <div className="flex items-center justify-between mt-5">
        <h1 className='text-3xl font-bold'>Author Dashboard</h1>
        <Button text='Logout' onClick={logout} bgColor="bg-red-500" hoverColor="bg-red-400" />
      </div>
      <Outlet />
    </div>
  );
}

export default App;
