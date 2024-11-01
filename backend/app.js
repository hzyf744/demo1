const express = require('express');
const { Pool } = require('pg');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3000;

const pool = new Pool({
  user: 'recep',
  host: 'db',
  database: 'new',
  password: 'R12345678',
  port: 5432,
});

app.set('views', path.join(__dirname, 'kayitlar'));
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'frontend')));

app.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  const query = 'INSERT INTO users(name, email, password) VALUES($1, $2, $3) RETURNING *';

  try {
    const result = await pool.query(query, [name, email, password]);
    res.status(201).json({ message: 'Kayıt başarılı', user: result.rows[0] });
  } catch (error) {
    console.error('Kayıt hatası', error);
    res.status(500).json({ error: 'Kayıt sırasında hata oluştu' });
  }
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const query = 'SELECT * FROM users WHERE email = $1 AND password = $2';

  try {
    const result = await pool.query(query, [email, password]);
    if (result.rows.length > 0) {
      res.sendFile(path.join(__dirname, 'home.html')); 
    } else {
      res.status(401).json({ message: 'Yanlış email veya şifre' });
    }
  } catch (error) {
    console.error('Giriş hatası', error);
    res.status(500).json({ error: 'Giriş sırasında hata oluştu' });
  }
});

app.post('/add-product', async (req, res) => {
    const { product_name, product_description, product_price, product_quantity } = req.body;  // Alan adları güncellendi
    const query = `
        INSERT INTO products (product_name, product_description, product_price, product_quantity)
        VALUES ($1, $2, $3, $4) RETURNING *
    `;

    try {
        const result = await pool.query(query, [product_name, product_description, product_price, product_quantity]);
        res.status(201).json({ message: 'Ürün başarıyla eklendi', product: result.rows[0] });
    } catch (error) {
        console.error('Ürün ekleme hatası:', error.message); 
        res.status(500).json({ error: `Ürün ekleme sırasında hata oluştu: ${error.message}` });  
    }
});

app.get('/products', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM products');
        res.json(result.rows);
    } catch (error) {
        console.error('Hata:', error);
        res.status(500).send('Ürünler alınırken hata oluştu.');
    }
});


app.get('/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users');
    res.render('users', { users: result.rows }); 
  } catch (error) {
    console.error('Error fetching data', error);
    res.status(500).json({ error: 'Error fetching data' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

