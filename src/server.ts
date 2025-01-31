import { Hono } from 'hono'

const app = new Hono()

app.get('/', (c) => {

  const payload = {
    message: 'Hello Hono!',
  }
  return c.json(payload)
})

export default app
