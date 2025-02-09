import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import axios from "axios"

type Rental = {
    id: string
    user: {
        id: string
        name: string
        email: string
    }
    product: {
        id: string
        name: string
        description?: string
        price: number
    }
    startDate: string
    endDate: string
    createdAt: string
}

export default function RentalPage() {
    const { id } = useParams<{ id: string }>()
    const [rental, setRental] = useState<Rental | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        const fetchRental = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/rentals/${id}`)
                setRental(response.data)
            } catch (err) {
                setError("Failed to load rental")
            } finally {
                setLoading(false)
            }
        }

        fetchRental()
    }, [id])

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

    if (!rental) return (
        <div className="max-w-4xl mx-auto p-4">
            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 text-yellow-700">
                Rental not found
            </div>
        </div>
    )

    return (
        <div className="max-w-4xl mx-auto p-4">
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-2xl font-semibold text-gray-800">Rental Details</h1>
                <Link
                    to="/rentals"
                    className="text-blue-500 hover:text-blue-600 transition-colors"
                >
                    Back to Rentals
                </Link>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
                <div className="flex justify-between items-center pb-4 border-b">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">{rental.product.name}</h2>
                        <p className="text-gray-600">Product ID: {rental.product.id}</p>
                    </div>
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                        ${rental.product.price}
                    </span>
                </div>

                <div className="space-y-4 pt-4">
                    <div>
                        <h2 className="text-sm font-medium text-gray-500">Product Description</h2>
                        <p className="mt-1 text-gray-900">
                            {rental.product.description || "No description available"}
                        </p>
                    </div>

                    <div>
                        <h2 className="text-sm font-medium text-gray-500">Rental Details</h2>
                        <div className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div className="bg-gray-50 px-4 py-3 rounded-lg">
                                <div className="text-sm text-gray-500">Start Date</div>
                                <div className="mt-1 text-gray-900 font-medium">
                                    {new Date(rental.startDate).toLocaleDateString()}
                                </div>
                            </div>
                            <div className="bg-gray-50 px-4 py-3 rounded-lg">
                                <div className="text-sm text-gray-500">End Date</div>
                                <div className="mt-1 text-gray-900 font-medium">
                                    {new Date(rental.endDate).toLocaleDateString()}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h2 className="text-sm font-medium text-gray-500">User Information</h2>
                        <div className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div className="bg-gray-50 px-4 py-3 rounded-lg">
                                <div className="text-sm text-gray-500">Name</div>
                                <div className="mt-1 text-gray-900 font-medium">{rental.user.name}</div>
                            </div>
                            <div className="bg-gray-50 px-4 py-3 rounded-lg">
                                <div className="text-sm text-gray-500">Email</div>
                                <div className="mt-1 text-gray-900 font-medium">{rental.user.email}</div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h2 className="text-sm font-medium text-gray-500">Additional Information</h2>
                        <div className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div className="bg-gray-50 px-4 py-3 rounded-lg">
                                <div className="text-sm text-gray-500">Rental ID</div>
                                <div className="mt-1 text-gray-900 font-medium">{rental.id}</div>
                            </div>
                            <div className="bg-gray-50 px-4 py-3 rounded-lg">
                                <div className="text-sm text-gray-500">Created At</div>
                                <div className="mt-1 text-gray-900 font-medium">
                                    {new Date(rental.createdAt).toLocaleString()}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}