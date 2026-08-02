import { createClient } from '@supabase/supabase-js'
import { Hono } from 'hono'
import { cors } from 'hono/cors'

type Bindings = {
  SUPABASE_URL: string
  SUPABASE_ANON_KEY: string
}

type ProductRow = {
  id: number
  name: string
  description: string
  price: number
  created_at: string
}

const app = new Hono<{ Bindings: Bindings }>()

app.use(
  '/api/*',
  cors({
    origin: 'http://localhost:5173',
  }),
)

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.get('/api/hello', (c) => {
  return c.json({
    message: 'Hello from Hono!',
  })
})

app.get('/api/products', async (c) => {
  const supabase = createClient(
    c.env.SUPABASE_URL,
    c.env.SUPABASE_ANON_KEY,
  )

  const { data, error } = await supabase
    .from('products')
    .select('id, name, description, price, created_at')
    .order('id')

  if (error) {
    console.error('Failed to fetch products:', error)

    return c.json(
      {
        message: '商品一覧の取得に失敗しました。',
      },
      500,
    )
  }

  const products: ProductRow[] = data

  return c.json({
    products,
  })
})

app.get('/api/products/:id', async (c) => {
  const id = c.req.param('id')

  const supabase = createClient(
    c.env.SUPABASE_URL,
    c.env.SUPABASE_ANON_KEY,
  )

  const { data, error } = await supabase
    .from('products')
    .select('id, name, price, description')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Failed to fetch product:', error)

    return c.json(
      {
        message: '商品を取得できませんでした',
      },
      404,
    )
  }

  return c.json(data)
})

export default app