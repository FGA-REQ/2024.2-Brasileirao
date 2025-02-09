import { Link, useLocation, useNavigate } from "react-router-dom";

const Sidebar = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('currentUser');
        navigate('/login');
    };

    const isActive = (path: string) => {
        return location.pathname === path ? "bg-blue-500 text-white" : "text-gray-700 hover:bg-blue-100";
    };

    const currentUserStr = localStorage.getItem('currentUser')
    const currentUser = currentUserStr ? JSON.parse(currentUserStr) : null
    const userId = currentUser ? currentUser.id : ''
    const isAdmin = currentUser?.role === 'ADMIN'

    return (
        <div className="w-68 h-screen bg-gray-800 text-white p-4 flex flex-col">
            <div className="text-2xl font-bold mb-6 text-center">Grupo Gestão</div>

            <nav className="flex-1">
                <ul className="space-y-4">
                    <li>
                        <Link
                            to="/dashboard"
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${isActive("/dashboard")}`}
                        >
                            Dashboard
                        </Link>
                    </li>

                    {isAdmin && (
                        <li>
                            <Link
                                to="/rentals"
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${isActive("/rentals")}`}
                            >
                                Aluguéis
                            </Link>
                        </li>
                    )}

                    <li>
                        <Link
                            to={`/profile/${userId}`}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${isActive("/profile")}`}
                        >
                            Perfil
                        </Link>
                    </li>
                </ul>
            </nav>

            <button
                onClick={handleLogout}
                className="w-60 px-4 py-2 mt-auto text-white bg-red-500 hover:bg-red-700 rounded-lg transition-colors"
            >
                Sair
            </button>
        </div>
    );
};

export default Sidebar;