import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import type { Product } from "./products";
import Sidebar from "../components/Sidebar";

export default function Dashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [stockQuantity, setStockQuantity] = useState("");
  const [creating, setCreating] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [editing, setEditing] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:3001/products");
        setProducts(response.data);
      } catch (error) {
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price || !stockQuantity) {
      setError("Name, price, and stock quantity are required");
      return;
    }
    setCreating(true);
    setError("");
    try {
      const response = await axios.post("http://localhost:3001/products", {
        name,
        price: parseFloat(price),
        description,
        stockQuantity: parseInt(stockQuantity),
      });
      setProducts([...products, response.data]);
      resetForm();
      setShowForm(false);
    } catch (error) {
      setError("Failed to create product");
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirmDelete !== id) {
      setConfirmDelete(id);
      return;
    }
    try {
      await axios.delete(`http://localhost:3001/products/${id}`);
      setProducts((prevProducts) => prevProducts.filter((product) => product.id !== id));
      setConfirmDelete(null);
    } catch (error) {
      setError("Failed to delete product");
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditing(product.id);
    setName(product.name);
    setPrice(product.price.toString());
    setDescription(product.description || "");
    setStockQuantity(product.stockQuantity.toString());
    setShowForm(true);
  };

  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price || !stockQuantity) {
      setError("Name, price, and stock quantity are required");
      return;
    }
    try {
      const response = await axios.put(`http://localhost:3001/products/${editing}`, {
        name,
        price: parseFloat(price),
        description,
        stockQuantity: parseInt(stockQuantity),
      });
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.id === editing ? { ...product, ...response.data } : product
        )
      );
      resetForm();
      setShowForm(false);
    } catch (error) {
      setError("Failed to update product");
    }
  };

  const resetForm = () => {
    setEditing(null);
    setName("");
    setPrice("");
    setDescription("");
    setStockQuantity("");
  };

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

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            {showForm ? "Cancelar" : "Adicionar Produto"}
          </button>
        </div>

        {showForm && (
          <form
            onSubmit={editing ? handleUpdateProduct : handleCreateProduct}
            className="bg-white p-6 rounded-lg shadow-md mb-8 space-y-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Nome do produto
                </label>
                <input
                  id="name"
                  type="text"
                  placeholder="Nome do produto..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg 
                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                           hover:border-gray-400 transition-colors"
                  required
                />
              </div>

              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                  Preço
                </label>
                <input
                  id="price"
                  type="number"
                  step="0.01"
                  placeholder="Preço..."
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg 
                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                           hover:border-gray-400 transition-colors"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Descrição
                </label>
                <input
                  id="description"
                  type="text"
                  placeholder="Descrição..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg 
                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                           hover:border-gray-400 transition-colors"
                />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">
                  Unidades disponíveis
                </label>
                <input
                  id="stock"
                  type="number"
                  placeholder="Quantidade disponível..."
                  value={stockQuantity}
                  onChange={(e) => setStockQuantity(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg 
                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                           hover:border-gray-400 transition-colors"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={creating}
              className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg 
                       hover:bg-blue-600 transition-colors disabled:bg-blue-300
                       disabled:cursor-not-allowed"
            >
              {editing ? "Confirmar" : creating ? "Criando..." : "Adicionar Produto"}
            </button>
          </form>
        )}

        <div className="bg-white rounded-lg shadow-md">
          <div className="divide-y">
            {products.map((product) => (
              <div key={product.id} className="p-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <Link
                    to={`/products/${product.id}`}
                    className="flex-1"
                  >
                    <div className="space-y-1">
                      <h3 className="text-lg font-medium text-gray-900">{product.name}</h3>
                      <div className="flex gap-4 text-sm text-gray-500">
                        <span>R${product.price}</span>
                        <span>Unidades disponíveis: {product.stockQuantity}</span>
                      </div>
                    </div>
                  </Link>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditProduct(product)}
                      className="px-3 py-1 text-sm text-blue-500 hover:text-blue-600 transition-colors"
                    >
                      Editar
                    </button>

                    {confirmDelete === product.id ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="px-3 py-1 text-sm text-green-500 hover:text-green-600 transition-colors"
                        >
                          Confirmar
                        </button>
                        <button
                          onClick={() => setConfirmDelete(null)}
                          className="px-3 py-1 text-sm text-gray-500 hover:text-gray-600 transition-colors"
                        >
                          Cancelar
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="px-3 py-1 text-sm text-red-500 hover:text-red-600 transition-colors"
                      >
                        Deletar
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}