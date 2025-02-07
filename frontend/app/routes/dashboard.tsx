import { useState, useEffect } from 'react'
import axios from 'axios'
import type { Product } from './products' // Use type-only import

export default function Dashboard() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:3001/products')
        setProducts(response.data)
        setLoading(false)
      } catch (error) {
        setError('Failed to load products')
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>{error}</div>
  }

  return (
    <div>
      <h1>Product Dashboard</h1>
      <ul>
        {products.map(product => (
          <li key={product.id}>
            {product.name} - ${product.price}
          </li>
        ))}
      </ul>
    </div>
  )
}