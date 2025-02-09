import { useState, useEffect } from "react"
import axios from "axios"
import { Link } from "react-router-dom"
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

  // State for product deletion confirmation
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)

  // Fetch products on initial load
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

  // Handle the creation of a new product
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

  // Handle product deletion
  const handleDelete = async (id: string) => {
    if (confirmDelete !== id) {
      setConfirmDelete(id)
      return
    }

    try {
      // Send DELETE request to backend
      await axios.delete(`http://localhost:3001/products/${id}`)
      // Remove the product from the state after deletion
      setProducts((prevProducts) => prevProducts.filter((product) => product.id !== id))
      setConfirmDelete(null) // Reset the confirmation state
    } catch (error) {
      setError("Failed to delete product")
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

      {/* Product List */}
      <ul>
        {products.map((product) => (
          <li key={product.id}>
            <Link to={`/products/${product.id}`}>
              {product.name} - ${product.price} (Stock: {product.stockQuantity})
            </Link>
            {/* Delete button with confirmation */}
            {confirmDelete === product.id ? (
              <div>
                <button onClick={() => handleDelete(product.id)}>Confirm Delete</button>
                <button onClick={() => setConfirmDelete(null)}>Cancel</button>
              </div>
            ) : (
              <button onClick={() => handleDelete(product.id)}>Delete</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}