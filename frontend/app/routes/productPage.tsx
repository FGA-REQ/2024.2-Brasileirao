import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import axios from "axios"

type Product = {
    id: string
    name: string
    description?: string
    price: number
    stockQuantity: number
    createdAt: string
}

export default function ProductPage() {
    const { id } = useParams<{ id: string }>() // Get product ID from URL
    const [product, setProduct] = useState<Product | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/products/${id}`)
                setProduct(response.data)
            } catch (err) {
                setError("Failed to load product")
            } finally {
                setLoading(false)
            }
        }

        fetchProduct()
    }, [id])

    if (loading) return <div>Loading...</div>
    if (error) return <div>{error}</div>
    if (!product) return <div>Product not found</div>

    return (
        <div>
            <h1>{product.name}</h1>
            <p><strong>Price:</strong> ${product.price}</p>
            <p><strong>Description:</strong> {product.description || "No description available"}</p>
            <p><strong>Stock:</strong> {product.stockQuantity} units</p>
            <p><strong>Created At:</strong> {new Date(product.createdAt).toLocaleString()}</p>
        </div>
    )
}