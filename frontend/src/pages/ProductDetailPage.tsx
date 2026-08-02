import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import type { Product } from '../types/Product'

function ProductDetailPage() {
    const { id } = useParams()

    const [product, setProduct] = useState<Product | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [errorMessage, setErrorMessage] = useState<string | null>(
        null,
    )

    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL

    useEffect(() => {
        if (!id) {
            setErrorMessage('商品IDが指定されていません。')
            setIsLoading(false)
            return
        }

        const fetchProduct = async () => {
            try {
                const response = await fetch(
                    `${apiBaseUrl}/api/products/${id}`,
                )

                if (!response.ok) {
                    throw new Error(`HTTP error: ${response.status}`)
                }

                const data: Product = await response.json()
                setProduct(data)
            } catch (error) {
                console.error(error)
                setErrorMessage('商品を取得できませんでした。')
            } finally {
                setIsLoading(false)
            }
        }

        fetchProduct()
    }, [id])

    if (isLoading) {
        return <p>読み込み中です...</p>
    }

    if (errorMessage) {
        return (
            <main>
                <p>{errorMessage}</p>
                <Link to="/products">商品一覧へ戻る</Link>
            </main>
        )
    }

    if (!product) {
        return <p>商品が見つかりません。</p>
    }

    return (
        <main>
            <Link to="/products">← 商品一覧へ戻る</Link>

            <h1>{product.name}</h1>

            <p>{product.description}</p>

            <p>{product.price.toLocaleString()}円</p>

            <button type="button">購入する</button>
        </main>
    )
}

export default ProductDetailPage