import { useState, useEffect } from "react"
import axios from "axios"
import { Link } from "react-router-dom"
import type { Rental } from "../types/rental"
import type { Product as ProductType } from './products';
import Sidebar from "../components/Sidebar"

export default function RentalDashboard() {
    const [rentals, setRentals] = useState<Rental[]>([])
    const [products, setProducts] = useState<ProductType[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    // State for new rental form
    const [userId, setUserId] = useState("")
    const [productId, setProductId] = useState("")
    const [startDate, setStartDate] = useState("")
    const [endDate, setEndDate] = useState("")
    const [creating, setCreating] = useState(false)

    // State for rental deletion confirmation
    const [confirmDelete, setConfirmDelete] = useState<string | null>(null)

    // State for editing rental
    const [editing, setEditing] = useState<string | null>(null)

    // State for showing the form
    const [showForm, setShowForm] = useState(false)

    // Fetch rentals on initial load
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [rentalsResponse, productsResponse] = await Promise.all([
                    axios.get("http://localhost:3001/rentals"),
                    axios.get("http://localhost:3001/products")
                ])
                setRentals(rentalsResponse.data)
                setProducts(productsResponse.data)
            } catch (error) {
                setError("Failed to load data")
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [])

    // Handle the creation of a new rental
    const handleCreateRental = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!userId || !productId || !startDate || !endDate) {
            setError("User ID, product ID, start date, and end date are required")
            return
        }

        setCreating(true)
        setError("")

        try {
            // Format the dates to include seconds and timezone
            const formattedStartDate = new Date(startDate).toISOString()
            const formattedEndDate = new Date(endDate).toISOString()

            const response = await axios.post("http://localhost:3001/rentals", {
                userId,
                productId,
                startDate: formattedStartDate,
                endDate: formattedEndDate,
            })

            setRentals([...rentals, response.data])
            setUserId("")
            setProductId("")
            setStartDate("")
            setEndDate("")
        } catch (error) {
            setError("Failed to create rental")
        } finally {
            setCreating(false)
        }
    }

    // Handle rental deletion
    const handleDelete = async (id: string) => {
        if (confirmDelete !== id) {
            setConfirmDelete(id)
            return
        }

        try {
            // Send DELETE request to backend
            await axios.delete(`http://localhost:3001/rentals/${id}`)
            // Remove the rental from the state after deletion
            setRentals((prevRentals) => prevRentals.filter((rental) => rental.id !== id))
            setConfirmDelete(null) // Reset the confirmation state
        } catch (error) {
            setError("Failed to delete rental")
        }
    }

    // Handle rental edit
    const handleEditRental = (rental: Rental) => {
        setEditing(rental.id)
        setUserId(rental.userId)
        setProductId(rental.productId)
        setStartDate(rental.startDate)
        setEndDate(rental.endDate)
    }

    // Handle updating a rental
    const handleUpdateRental = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!userId || !productId || !startDate || !endDate) {
            setError("User ID, product ID, start date, and end date are required")
            return
        }

        try {
            // Format the dates to include seconds and timezone
            const formattedStartDate = new Date(startDate).toISOString()
            const formattedEndDate = new Date(endDate).toISOString()

            const response = await axios.put(`http://localhost:3001/rentals/${editing}`, {
                userId,
                productId,
                startDate: formattedStartDate,
                endDate: formattedEndDate,
            })

            // Update the rental in the state
            setRentals((prevRentals) =>
                prevRentals.map((rental) =>
                    rental.id === editing ? { ...rental, ...response.data } : rental
                )
            )
            setEditing(null) // Reset editing state
            setUserId("")
            setProductId("")
            setStartDate("")
            setEndDate("")
        } catch (error) {
            setError("Failed to update rental")
        }
    }

    if (loading) return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
    )

    if (error) return (
        <div className="max-w-4xl mx-auto p-4">
            <div className="bg-red-50 border-l-4 border-red-500 p-4 text-red-700">
                {error}
            </div>
        </div>
    )

    return (
        <div className="flex">
            <Sidebar />
            <div className="flex-1 p-4">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl font-semibold text-gray-800">Aluguéis</h1>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                    >
                        {showForm ? "Cancelar" : "Adicionar Aluguel"}
                    </button>
                </div>

                {showForm && (
                    <form
                        onSubmit={editing ? handleUpdateRental : handleCreateRental}
                        className="bg-white p-6 rounded-lg shadow-md mb-8 space-y-4"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="userId" className="block text-sm font-medium text-gray-700 mb-1">
                                    Id do usuário
                                </label>
                                <input
                                    id="userId"
                                    type="text"
                                    value={userId}
                                    onChange={(e) => setUserId(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg 
                                             focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                                             hover:border-gray-400 transition-colors"
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="productId" className="block text-sm font-medium text-gray-700 mb-1">
                                    Produto
                                </label>
                                <select
                                    id="productId"
                                    value={productId}
                                    onChange={(e) => setProductId(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg 
                                             focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                                             hover:border-gray-400 transition-colors"
                                    required
                                >
                                    <option value="">Selecione um produto</option>
                                    {products.map((product) => (
                                        <option key={product.id} value={product.id}>
                                            {product.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                                    Data de início
                                </label>
                                <input
                                    id="startDate"
                                    type="datetime-local"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg 
                                             focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                                             hover:border-gray-400 transition-colors"
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                                    Data de entrega
                                </label>
                                <input
                                    id="endDate"
                                    type="datetime-local"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
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
                            {editing ? "Editar aluguel" : creating ? "Criando..." : "Adicionar aluguel"}
                        </button>
                    </form>
                )}

                <div className="bg-white rounded-lg shadow-md">
                    <div className="divide-y">
                        {rentals.map((rental) => (
                            <div key={rental.id} className="p-4 hover:bg-gray-50">
                                <div className="flex items-center justify-between">
                                    <Link
                                        to={`/rentals/${rental.id}`}
                                        className="flex-1"
                                    >
                                        <div className="space-y-1">
                                            <h3 className="text-lg font-medium text-gray-900">
                                                Aluguel do produto: {rental.productId}
                                            </h3>
                                            <div className="flex gap-4 text-sm text-gray-500">
                                                <span>Usuário: {rental.userId}</span>
                                                <span>De: {rental.startDate}</span>
                                                <span>Até: {rental.endDate}</span>
                                            </div>
                                        </div>
                                    </Link>

                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleEditRental(rental)}
                                            className="px-3 py-1 text-sm text-blue-500 hover:text-blue-600 transition-colors"
                                        >
                                            Editar
                                        </button>

                                        {confirmDelete === rental.id ? (
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleDelete(rental.id)}
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
                                                onClick={() => handleDelete(rental.id)}
                                                className="px-3 py-1 text-sm text-red-500 hover:text-red-600 transition-colors"
                                            >
                                                Delete
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
    )
}