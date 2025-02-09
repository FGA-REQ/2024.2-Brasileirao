import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

type User = {
    id: string;
    name: string;
    email: string;
    role: string;
};

export default function ProfilePage() {
    const { id } = useParams<{ id: string }>();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/user/${id}`);
                setUser(response.data);
            } catch (err) {
                setError("Failed to load user profile");
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [id]);

    if (loading) return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
    );

    if (error) return (
        <div className="max-w-4xl mx-auto p-4">
            <div className="bg-red-50 border-l-4 border-red-500 p-4 text-red-700">
                {error}
            </div>
        </div>
    );

    if (!user) return (
        <div className="max-w-4xl mx-auto p-4">
            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 text-yellow-700">
                User not found
            </div>
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto p-4">
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-2xl font-semibold text-gray-800">{user.name}</h1>
                <Link
                    to="/dashboard"
                    className="text-blue-500 hover:text-blue-600 transition-colors"
                >
                    Voltar ao Dashboard
                </Link>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
                <div className="space-y-4 pt-4">
                    <div>
                        <h2 className="text-sm font-medium text-gray-500">Email</h2>
                        <p className="mt-1 text-gray-900">{user.email}</p>
                    </div>

                    <div>
                        <h2 className="text-sm font-medium text-gray-500">Role</h2>
                        <p className="mt-1 text-gray-900">{user.role}</p>
                    </div>

                    <div>
                        <h2 className="text-sm font-medium text-gray-500">ID</h2>
                        <p className="mt-1 text-gray-900 font-medium">{user.id}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}