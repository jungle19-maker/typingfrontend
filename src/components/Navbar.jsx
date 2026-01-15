import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);

    return (
        <nav className="navbar">
            <Link to="/" className="logo">Typing<span>Master</span></Link>
            <div className="nav-links">
                <Link to="/">Home</Link>
                {user ? (
                    <>
                        <Link to="/dashboard">Dashboard</Link>
                        <a href="#" onClick={logout}>Logout</a>
                    </>
                ) : (
                    <>
                        <Link to="/login">Login</Link>
                        <Link to="/register">Register</Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
