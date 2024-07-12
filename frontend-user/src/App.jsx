import NavBar from './components/layout/NavBar.jsx';
import { Outlet } from 'react-router-dom';
import { ToastContainer, Flip } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <div className='min-h-screen lg:px-40 md:px-20 px-10 pb-20'>
      <NavBar />
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