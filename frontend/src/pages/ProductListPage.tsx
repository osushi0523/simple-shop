import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import type { Product } from '../types/Product'

type ProductsResponse = {
    products: Product[]
}

function ProductListPage() {
    const [products, setProducts] = useState<Product[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)

    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch(
                    `${apiBaseUrl}/api/products`,
                )

                if (!response.ok) {
                    throw new Error(`HTTP error: ${response.status}`)
                }

                const data: ProductsResponse = await response.json()
                setProducts(data.products)
            } catch (error) {
                console.error(error)
                setErrorMessage('商品一覧を取得できませんでした。')
            } finally {
                setIsLoading(false)
            }
        }

        fetchProducts()
    }, [])

    if (isLoading) {
        return <p>読み込み中です...</p>
    }

    if (errorMessage) {
        return <p>{errorMessage}</p>
    }

    return (
        <main>
            <h1>商品一覧</h1>

            {products.length === 0 ? (
                <p>商品はありません。</p>
            ) : (
                <ul>
                    {products.map((product) => (
                        <li key={product.id}>
                            <Link to={`/products/${product.id}`}>
                                {product.name}
                            </Link>

                            <span>：{product.price.toLocaleString()}円</span>
                        </li>
                    ))}
                </ul>
            )}
        </main>
    )
}

export default ProductListPage