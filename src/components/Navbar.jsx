import { NavLink, Link, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const location = useLocation();

    if (location.pathname === '/practice-session') return null;

    return (
        <nav className="navbar">
            <Link to="/" className="logo">key<span className="text-primary">Skill</span></Link>
            <div className="nav-links">
                <NavLink to="/" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Home</NavLink>
                {user ? (
                    <>
                        <NavLink to="/practice" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Practice</NavLink>
                        <NavLink to="/game" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Games</NavLink>
                        <NavLink to="/report" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Reports</NavLink>
                        <a href="#" onClick={logout} className="nav-link">Logout</a>
                    </>
                ) : (
                    <>
                        <NavLink to="/login" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Login</NavLink>
                        <NavLink to="/register" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Register</NavLink>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
