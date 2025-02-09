import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import type { Product } from './products';
import Sidebar from '../components/Sidebar';

export default function Dashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [stockQuantity, setStockQuantity] = useState('');
  const [inputImage, setInputImage] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [editing, setEditing] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:3001/products');
        setProducts(response.data);
      } catch (error) {
        setError('Failed to load products');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const convertBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        resolve(fileReader.result as string);
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };

  const handleFileRead = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const base64 = await convertBase64(file);
    setInputImage(base64);
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price || !stockQuantity) {
      setError('Name, price, and stock quantity are required');
      return;
    }
    setCreating(true);
    setError('');
    try {
      const response = await axios.post('http://localhost:3001/products', {
        name,
        price: parseFloat(price),
        description,
        stockQuantity: parseInt(stockQuantity),
        image: inputImage,
      });
      setProducts([...products, response.data]);
      resetForm();
      setShowForm(false);
    } catch (error) {
      setError('Failed to create product');
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
      setProducts((prevProducts) =>
        prevProducts.filter((product) => product.id !== id)
      );
      setConfirmDelete(null);
    } catch (error) {
      setError('Failed to delete product');
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditing(product.id);
    setName(product.name);
    setPrice(product.price.toString());
    setDescription(product.description || '');
    setStockQuantity(product.stockQuantity.toString());
    setShowForm(true);
  };

  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price || !stockQuantity) {
      setError('Name, price, and stock quantity are required');
      return;
    }
    try {
      const response = await axios.put(
        `http://localhost:3001/products/${editing}`,
        {
          name,
          price: parseFloat(price),
          description,
          stockQuantity: parseInt(stockQuantity),
        }
      );
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.id === editing ? { ...product, ...response.data } : product
        )
      );
      resetForm();
      setShowForm(false);
    } catch (error) {
      setError('Failed to update product');
    }
  };

  const resetForm = () => {
    setEditing(null);
    setName('');
    setPrice('');
    setDescription('');
    setStockQuantity('');
  };

  if (loading)
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500'></div>
      </div>
    );

  if (error)
    return (
      <div className='max-w-4xl mx-auto p-4'>
        <div className='bg-red-50 border-l-4 border-red-500 p-4 text-red-700'>
          {error}
        </div>
      </div>
    );

  return (
    <div className='flex'>
      <Sidebar />
      <div className='flex-1 p-4'>
        <div className='flex justify-between items-center mb-8'>
          <h1 className='text-2xl font-semibold text-gray-800'>
            Product Dashboard
          </h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className='bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors'
          >
            {showForm ? 'Cancel' : 'Add Product'}
          </button>
        </div>

        {showForm && (
          <form
            onSubmit={editing ? handleUpdateProduct : handleCreateProduct}
            className='bg-white p-6 rounded-lg shadow-md mb-8 space-y-4'
          >
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <label
                  htmlFor='name'
                  className='block text-sm font-medium text-gray-700 mb-1'
                >
                  Product Name
                </label>
                <input
                  id='name'
                  type='text'
                  placeholder='Enter product name...'
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg 
                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                           hover:border-gray-400 transition-colors'
                  required
                />
              </div>

              <div>
                <label
                  htmlFor='price'
                  className='block text-sm font-medium text-gray-700 mb-1'
                >
                  Price
                </label>
                <input
                  id='price'
                  type='number'
                  step='0.01'
                  placeholder='Enter price...'
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg 
                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                           hover:border-gray-400 transition-colors'
                  required
                />
              </div>

              <div className='md:col-span-2'>
                <label
                  htmlFor='description'
                  className='block text-sm font-medium text-gray-700 mb-1'
                >
                  Description
                </label>
                <input
                  id='description'
                  type='text'
                  placeholder='Enter product description...'
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg 
                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                           hover:border-gray-400 transition-colors'
                />
              </div>

              <div className='md:col-span-2'>
                <label
                  htmlFor='stock'
                  className='block text-sm font-medium text-gray-700 mb-1'
                >
                  Image
                </label>
                <input
                  id='stock'
                  type='file'
                  accept='image/gif, image/jpeg, image/png'
                  onChange={(e) => handleFileRead(e)}
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg 
                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                           hover:border-gray-400 transition-colors'
                  required
                />
              </div>

              <div className='md:col-span-2'>
                <label
                  htmlFor='stock'
                  className='block text-sm font-medium text-gray-700 mb-1'
                >
                  Stock Quantity
                </label>
                <input
                  id='stock'
                  type='number'
                  placeholder='Enter stock quantity...'
                  value={stockQuantity}
                  onChange={(e) => setStockQuantity(e.target.value)}
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg 
                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                           hover:border-gray-400 transition-colors'
                  required
                />
              </div>
            </div>
            <button
              type='submit'
              disabled={creating}
              className='w-full bg-blue-500 text-white px-4 py-2 rounded-lg 
                       hover:bg-blue-600 transition-colors disabled:bg-blue-300
                       disabled:cursor-not-allowed'
            >
              {editing
                ? 'Update Product'
                : creating
                ? 'Creating...'
                : 'Add Product'}
            </button>
          </form>
        )}

        <div className='bg-white rounded-lg shadow-md'>
          <div className='divide-y'>
            {products.map((product) => (
              <div key={product.id} className='p-4 hover:bg-gray-50'>
                <div className='flex items-center justify-between'>
                  <div className='flex-1'>
                    <img width={100} height={100} src={product.image} />
                  </div>
                  <Link to={`/products/${product.id}`} className='flex-1'>
                    <div className='space-y-1'>
                      <h3 className='text-lg font-medium text-gray-900'>
                        {product.name}
                      </h3>
                      <div className='flex gap-4 text-sm text-gray-500'>
                        <span>${product.price}</span>
                        <span>Stock: {product.stockQuantity}</span>
                      </div>
                    </div>
                  </Link>

                  <div className='flex gap-2'>
                    <a
                      href={`https://wa.me/5511999999999?text=Olá, tenho interesse no produto ${product.name}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className='flex items-center gap-1 px-3 py-1 text-sm text-green-600 hover:text-green-700 transition-colors'
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                      Entrar em contato
                    </a>
                    <button
                      onClick={() => handleEditProduct(product)}
                      className='px-3 py-1 text-sm text-blue-500 hover:text-blue-600 transition-colors'
                    >
                      Editar
                    </button>

                    {confirmDelete === product.id ? (
                      <div className='flex gap-2'>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className='px-3 py-1 text-sm text-green-500 hover:text-green-600 transition-colors'
                        >
                          Confirmar
                        </button>
                        <button
                          onClick={() => setConfirmDelete(null)}
                          className='px-3 py-1 text-sm text-gray-500 hover:text-gray-600 transition-colors'
                        >
                          Cancelar
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleDelete(product.id)}
                        className='px-3 py-1 text-sm text-red-500 hover:text-red-600 transition-colors'
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
