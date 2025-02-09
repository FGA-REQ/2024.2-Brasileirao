import { useState, useEffect } from "react"
import axios from "axios"
import type { Product } from "./products" // Type-only import

export default function Dashboard() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  // State for new product form
  const [name, setName] = useState("")
  const [price, setPrice] = useState("")
  const [description, setDescription] = useState("")
  const [stockQuantity, setStockQuantity] = useState("")
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:3001/products")
        setProducts(response.data)
      } catch (error) {
        setError("Failed to load products")
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name || !price || !stockQuantity) {
      setError("Name, price, and stock quantity are required")
      return
    }

    setCreating(true)
    setError("")

    try {
      const response = await axios.post("http://localhost:3001/products", {
        name,
        price: parseFloat(price),
        description,
        stockQuantity: parseInt(stockQuantity),
      })

      setProducts([...products, response.data])
      setName("")
      setPrice("")
      setDescription("")
      setStockQuantity("")
    } catch (error) {
      setError("Failed to create product")
    } finally {
      setCreating(false)
    }
  }

  if (loading) return <div>Loading...</div>
  if (error) return <div>{error}</div>

  return (
    <div>
      <h1>Product Dashboard</h1>

      {/* Form for adding a new product */}
      <form onSubmit={handleCreateProduct}>
        <input
          type="text"
          placeholder="Product Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          type="number"
          placeholder="Stock Quantity"
          value={stockQuantity}
          onChange={(e) => setStockQuantity(e.target.value)}
          required
        />
        <button type="submit" disabled={creating}>
          {creating ? "Creating..." : "Add Product"}
        </button>
      </form>

      <ul>
        {products.map((product) => (
          <li key={product.id}>
            {product.name} - ${product.price} (Stock: {product.stockQuantity})
          </li>
        ))}
      </ul>
    </div>
  )
}