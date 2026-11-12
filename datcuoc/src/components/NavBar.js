import { NavLink } from 'react-router-dom';

const cls = ({ isActive }) => (isActive ? 'nav-link active' : 'nav-link');

const NavBar = () => (
  <nav className="nav">
    <NavLink to="/" end className={cls}>Trang chủ</NavLink>
    <NavLink to="/questions" className={cls}>Ngân hàng câu hỏi</NavLink>
    <NavLink to="/history" className={cls}>Lịch sử</NavLink>
  </nav>
);

export default NavBar;
