import { Outlet } from 'react-router-dom';
import NavBar from './NavBar';

const Layout = () => (
  <>
    <NavBar />
    <main className="main">
      <Outlet />
    </main>
  </>
);

export default Layout;
