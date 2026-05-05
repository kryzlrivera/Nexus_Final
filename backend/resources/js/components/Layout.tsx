import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import BottomNav from './BottomNav';

function Layout() {
  return (
    <div className="app-wrapper">
      <Navbar />
      <main className="container main-content">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}

export default Layout;
