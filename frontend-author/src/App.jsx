import { ToastContainer, Flip } from "react-toastify";
import { Outlet, Navigate } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "./context/AuthContext";

function App() {
  const { isAuthenticated } = useContext(AuthContext);

  if (!isAuthenticated) {
    return <Navigate to='login' replace />;
  }

  return (
    <div className='min-h-screen lg:px-40 md:px-20 px-10 pb-20'>
      <h1 className='text-3xl mt-5 font-bold'>Author Dashboard</h1>

      <Outlet />
      <ToastContainer
        position="bottom-center"
        autoClose={3000}
        limit={5}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover={false}
        theme="colored"
        transition={Flip}
      />
    </div>
  );
}

export default App;
