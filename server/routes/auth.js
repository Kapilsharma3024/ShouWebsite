import { Router } from 'express'
import jwt from 'jsonwebtoken'

const router = Router()

const ADMIN_PASSWORD = 'admin123'
const JWT_SECRET = 'success-academy-jwt-secret-key-2025'

router.post('/login', (req, res) => {
  const { password } = req.body

  if (password !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Invalid password' })
  }

  const token = jwt.sign({ role: 'admin' }, JWT_SECRET, { expiresIn: '24h' })
  res.json({ success: true, token })
})

router.get('/verify', (req, res) => {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ valid: false })
  }

  const token = authHeader.split(' ')[1]
  try {
    jwt.verify(token, JWT_SECRET)
    res.json({ valid: true })
  } catch {
    res.status(401).json({ valid: false })
  }
})

export { JWT_SECRET }
export default router
