import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
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
    const { id } = useParams<{ id: string }>() // Get rental ID from URL
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

    if (loading) return <div>Loading...</div>
    if (error) return <div>{error}</div>
    if (!rental) return <div>Rental not found</div>

    return (
        <div>
            <h1>Rental Details</h1>
            <h2>{rental.product.name}</h2>
            <p><strong>Price:</strong> ${rental.product.price}</p>
            <p><strong>Description:</strong> {rental.product.description || "No description available"}</p>
            <p><strong>Start Date:</strong> {new Date(rental.startDate).toLocaleDateString()}</p>
            <p><strong>End Date:</strong> {new Date(rental.endDate).toLocaleDateString()}</p>
            <p><strong>User:</strong> {rental.user.name} ({rental.user.email})</p>
            <p><strong>Created At:</strong> {new Date(rental.createdAt).toLocaleString()}</p>
        </div>
    )
}