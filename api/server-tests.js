const request = require('supertest')
const server = require('../server')
const db = require('../data/db-config')

beforeAll(async () => {
  await db.migrate.rollback()
  await db.migrate.latest()
})
beforeEach(async () => {
  await db.seed.run()
})
afterAll(async () => {
  await db.destroy()
})

it('sanity check', () => {
  expect(true).not.toBe(false)
})

describe('server.js', () => {
  it('is the correct testing environment', async () => {
    expect(process.env.NODE_ENV).toBe('testing')
  })
})

describe("[POST] /api/auth/register", () => {
  let input = { username: 'foo', password: 'bar', role_name: 'user' }

  test('[1] returns a new user with status 201', async () => {
    const response = await request(server)
      .post('/api/auth/register')
      .send(input)

    expect(response.status).toBe(201)
    expect(response.body).toHaveProperty('username', 'foo')
  })

  test('[2] returns error on invalid credentials', async () => {
    delete input.role_name;
    const response = await request(server)
      .post('/api/auth/register')
      .send(input)
    expect(response.status).toBe(400)
  })

  test('[3] returns error message on invalid username', async () => {
    input.role_name = "owner"
    await request(server).post('/api/auth/register').send(input)
    const response = await request(server)
      .post('/api/auth/register')
      .send(input)

    expect(response.status).toBe(400)
    expect(response.body.message).toMatch(/user already exists/i)
  })
})

describe('[POST] /api/auth/login', () => {
  beforeEach(async () => {
    await request(server)
      .post('/api/auth/register')
      .send({ username: 'foo', password: 'bar', role_name: 'user' })
  })
  let input = { username: 'foo', password: 'bar' }
  test('[1] returns a welcome message on successful login', async () => {
    const response = await request(server)
      .post('/api/auth/login')
      .send(input)

    expect(response.status).toBe(200)
    expect(response.body.message).toMatch(/welcome foo/i)
  })

  test('[2] returns error message on invalid login credentials', async () => {
    delete input.password;
    const response = await request(server)
      .post('/api/auth/login')
      .send(input)

    expect(response.status).toBe(400)
    expect(response.body.message).toMatch(/username and password are required/i)
  })

  test('[3] returns error message on invalid user login', async () => {
    input = { username: "fiz", password: "baz" }
    const response = await request(server)
      .post('/api/auth/login')
      .send(input)

    expect(response.status).toBe(404)
    expect(response.body.message).toMatch(/user not found/i)
  })
})

describe('[GET] /api/products/:id', () => {
  let login;
  beforeEach(async () => {
    await request(server)
      .post('/api/auth/register')
      .send({ username: 'foo', password: 'bar', role_name: 'user' })

    login = await request(server)
      .post('/api/auth/login')
      .send({ username: 'foo', password: 'bar' })
  })

  test('returns products accroding to category_id', async () => {
    const response = await request(server)
      .get('/api/products/1')
      .set("Authorization", login.body.token)

    expect(response.status).toBe(200)
    expect(response.body[0]).toHaveProperty("product")
    expect(response.body[0].category_id).toBe(1)
  })

  test('returns error message on invalid categor_id', async () => {
    const response = await request(server)
      .get('/api/products/134212')
      .set("Authorization", login.body.token)

    expect(response.status).toBe(400)
    expect(response.body.message).toMatch(/Invalid category/i)
  })
})

describe('[POST] /api/products', () => {
  let login;
  let input;
  beforeEach(async () => {
    input = {
      product: "Long dress",
      description: "Traditional long dress",
      price: 40,
      category: "Clothing"
    }
    await request(server)
      .post('/api/auth/register')
      .send({ username: 'foo', password: 'bar', role_name: 'user' })

    login = await request(server)
      .post('/api/auth/login')
      .send({ username: 'foo', password: 'bar' })
  })
  test('[1] return 201 status code on adding new product', async () => {
    const response = await request(server)
      .post('/api/products')
      .send(input)
      .set("Authorization", login.body.token)

    expect(response.status).toBe(201)
  })

  test('[2] return 400 status code on missing product name', async () => {
    delete input.product;
    const response = await request(server)
      .post('/api/products')
      .send(input)
      .set("Authorization", login.body.token)

    expect(response.status).toBe(400)
    expect(response.body.message).toMatch(/product name, price and category are required/i)
  })
  test('[3] return 400 status code on missing price', async () => {
    delete input.price;
    const response = await request(server)
    .post('/api/products')
    .send(input)
    .set("Authorization", login.body.token)
    
    expect(response.status).toBe(400)
    expect(response.body.message).toMatch(/product name, price and category are required/i)
  })
  test('[4] return 400 status code on missing category', async () => {
    delete input.category;
    const response = await request(server)
    .post('/api/products')
    .send(input)
    .set("Authorization", login.body.token)
    
    expect(response.status).toBe(400)
    expect(response.body.message).toMatch(/product name, price and category are required/i)
  })
})