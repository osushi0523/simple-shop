import {
  Navigate,
  Route,
  Routes,
} from 'react-router-dom'
import ProductDetailPage from './pages/ProductDetailPage'
import ProductListPage from './pages/ProductListPage'

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={<Navigate to="/products" replace />}
      />

      <Route
        path="/products"
        element={<ProductListPage />}
      />

      <Route
        path="/products/:id"
        element={<ProductDetailPage />}
      />

      <Route
        path="*"
        element={<p>ページが見つかりません。</p>}
      />
    </Routes>
  )
}

export default App