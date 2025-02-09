import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
    const location = useLocation();

    const isActive = (path: string) => {
        return location.pathname === path ? "bg-blue-500 text-white" : "text-gray-700 hover:bg-blue-100";
    };

    const currentUserStr = localStorage.getItem('currentUser')
    const currentUser = currentUserStr ? JSON.parse(currentUserStr) : null
    const userId = currentUser ? currentUser.id : ''
    const isAdmin = currentUser?.role === 'ADMIN'

    return (
        <div className="w-68 h-screen bg-gray-800 text-white p-4">
            <div className="text-2xl font-bold mb-6 text-center">Grupo Gestão</div>

            <nav>
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
        </div>
    );
};

export default Sidebar;