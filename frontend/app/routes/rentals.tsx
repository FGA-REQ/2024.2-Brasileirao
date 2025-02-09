import { useState, useEffect } from "react"
import axios from "axios"
import { Link } from "react-router-dom"
import type { Rental } from "../types/rental"

export default function RentalDashboard() {
    const [rentals, setRentals] = useState<Rental[]>([])
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

    // Fetch rentals on initial load
    useEffect(() => {
        const fetchRentals = async () => {
            try {
                const response = await axios.get("http://localhost:3001/rentals")
                setRentals(response.data)
            } catch (error) {
                setError("Failed to load rentals")
            } finally {
                setLoading(false)
            }
        }

        fetchRentals()
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
            const response = await axios.post("http://localhost:3001/rentals", {
                userId,
                productId,
                startDate,
                endDate,
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
            const response = await axios.put(`http://localhost:3001/rentals/${editing}`, {
                userId,
                productId,
                startDate,
                endDate,
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

    if (loading) return <div>Loading...</div>
    if (error) return <div>{error}</div>

    return (
        <div>
            <h1>Rental Dashboard</h1>

            {/* Form for adding or editing a rental */}
            <form onSubmit={editing ? handleUpdateRental : handleCreateRental}>
                <input
                    type="text"
                    placeholder="User ID"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Product ID"
                    value={productId}
                    onChange={(e) => setProductId(e.target.value)}
                    required
                />
                <input
                    type="datetime-local"
                    placeholder="Start Date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                />
                <input
                    type="datetime-local"
                    placeholder="End Date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    required
                />
                <button type="submit" disabled={creating}>
                    {editing ? "Update Rental" : creating ? "Creating..." : "Add Rental"}
                </button>
            </form>

            {/* Rental List */}
            <ul>
                {rentals.map((rental) => (
                    <li key={rental.id}>
                        <Link to={`/rentals/${rental.id}`}>
                            Rental: {rental.productId} for User: {rental.userId} from {rental.startDate} to {rental.endDate}
                        </Link>

                        {/* Edit button */}
                        <button onClick={() => handleEditRental(rental)}>Edit</button>

                        {/* Delete button with confirmation */}
                        {confirmDelete === rental.id ? (
                            <div>
                                <button onClick={() => handleDelete(rental.id)}>Confirm Delete</button>
                                <button onClick={() => setConfirmDelete(null)}>Cancel</button>
                            </div>
                        ) : (
                            <button onClick={() => handleDelete(rental.id)}>Delete</button>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    )
}