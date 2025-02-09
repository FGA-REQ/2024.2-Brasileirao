import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

type Product = {
    id: string;
    name: string;
    description?: string;
    price: number;
    stockQuantity: number;
    createdAt: string;
    image?: string; // Add this line
};

export default function ProductPage() {
    const { id } = useParams<{ id: string }>();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/products/${id}`);
                setProduct(response.data);
            } catch (err) {
                setError("Failed to load product");
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
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

    if (!product) return (
        <div className="max-w-4xl mx-auto p-4">
            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 text-yellow-700">
                Product not found
            </div>
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto p-4">
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-2xl font-semibold text-gray-800">{product.name}</h1>
                <Link
                    to="/dashboard"
                    className="text-blue-500 hover:text-blue-600 transition-colors"
                >
                    Voltar ao Dashboard
                </Link>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
                {product.image && (
                    <div className="flex justify-center mb-6">
                        <img 
                            src={product.image} 
                            alt={product.name}
                            className="max-w-full h-auto rounded-lg shadow-md"
                            style={{ maxHeight: '400px' }}
                        />
                    </div>
                )}
                
                <div className="flex justify-between items-center pb-4 border-b">
                    <span className="text-2xl font-bold text-gray-900">
                        R${product.price}
                    </span>
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                        {product.stockQuantity} unidades disponíveis
                    </span>
                </div>

                <div className="space-y-4 pt-4">
                    <div>
                        <h2 className="text-sm font-medium text-gray-500">Descrição</h2>
                        <p className="mt-1 text-gray-900">
                            {product.description || "No description available"}
                        </p>
                    </div>

                    <div>
                        <h2 className="text-sm font-medium text-gray-500">Detalhes do produto</h2>
                        <div className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div className="bg-gray-50 px-4 py-3 rounded-lg">
                                <div className="text-sm text-gray-500">ID do produto</div>
                                <div className="mt-1 text-gray-900 font-medium">{product.id}</div>
                            </div>
                            <div className="bg-gray-50 px-4 py-3 rounded-lg">
                                <div className="text-sm text-gray-500">Criado em</div>
                                <div className="mt-1 text-gray-900 font-medium">
                                    {new Date(product.createdAt).toLocaleString()}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}