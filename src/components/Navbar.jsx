import { NavLink, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useLanguage } from '../context/LanguageContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const { language, toggleLanguage } = useLanguage();
    const location = useLocation();
    const navigate = useNavigate();

    // Check if user is on a paid plan
    const planName = (user?.subscription?.planName || 'free').toLowerCase();
    const isPaidUser = planName !== 'free';
    const showUpgrade = planName === 'free';

    // Return null on specific game pages to maximize focus, or handle via Layout wrapper
    if (location.pathname === '/practice-session') return null;

    return (
        <nav className="sticky top-0 z-50 w-full px-4 py-2 flex justify-between items-center border-b border-white/5 bg-dark/80 backdrop-blur-md transition-all duration-300">
            <Link to="/practice" className="text-xl font-extrabold text-white tracking-tight hover:opacity-90 transition-opacity">
                key<span className="text-primary drop-shadow-neon-blue">Skill</span>
            </Link>

            <div className="flex items-center gap-4">
                {/* Language Toggle */}
                <div
                    onClick={() => toggleLanguage()}
                    className="cursor-pointer flex items-center gap-1.5 text-xs font-bold bg-white/5 px-2 py-1 rounded-full hover:bg-white/10 transition-colors"
                >
                    <span className={language === 'english' ? 'text-primary' : 'text-textMuted'}>EN</span>
                    <span className="text-white/20">/</span>
                    <span className={language === 'hindi' ? 'text-primary' : 'text-textMuted'}>HI</span>
                </div>

                <div className="flex items-center gap-4">

                    {user ? (
                        <>
                            <NavLink to="/practice" className={({ isActive }) => `text-xs font-medium transition-colors hover:text-primary ${isActive ? "text-primary" : "text-textMuted"}`}>Practice</NavLink>
                            <NavLink to="/typing-exams" className={({ isActive }) => `text-xs font-medium transition-colors hover:text-primary ${isActive ? "text-primary" : "text-textMuted"}`}>Exams</NavLink>
                            <NavLink to="/game" className={({ isActive }) => `text-xs font-medium transition-colors hover:text-primary ${isActive ? "text-primary" : "text-textMuted"}`}>Games</NavLink>
                            <NavLink to="/report" className={({ isActive }) => `text-xs font-medium transition-colors hover:text-primary ${isActive ? "text-primary" : "text-textMuted"}`}>Reports</NavLink>

                            {/* Plan Badge */}
                            <div className={`px-2 py-0.5 text-[10px] font-bold rounded-full border ${isPaidUser ? 'bg-primary/10 text-primary border-primary/30' : 'bg-white/5 text-gray-400 border-white/10'}`}>
                                {planName === 'free' ? 'FREE' : planName.toUpperCase()}
                            </div>

                            {showUpgrade && (
                                <button
                                    onClick={() => navigate('/pricing')}
                                    className="px-3 py-1 text-[10px] font-bold bg-gradient-to-r from-primary to-accent text-black rounded hover:brightness-110 shadow-neon-blue transition-all"
                                >
                                    Upgrade
                                </button>
                            )}
                            <button onClick={logout} className="text-xs font-medium text-textMuted hover:text-error transition-colors">Logout</button>
                        </>
                    ) : (
                        <>
                            <NavLink to="/login" className={({ isActive }) => `text-xs font-medium transition-colors hover:text-primary ${isActive ? "text-primary" : "text-textMuted"}`}>Login</NavLink>
                            <NavLink to="/register" className="px-4 py-1.5 text-xs font-bold bg-primary text-black rounded hover:bg-primary/90 shadow-neon-blue transition-all">
                                Register
                            </NavLink>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};


export default Navbar;
