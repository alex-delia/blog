import NavBar from './components/layout/NavBar.jsx';
import { Outlet } from 'react-router-dom';

function App() {

  return (
    <div className='min-h-screen lg:px-40 md:px-20 px-10'>
      <NavBar />
      <Outlet />
    </div>
  );
}

export default App;
