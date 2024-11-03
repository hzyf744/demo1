const express = require('express');
const { Pool } = require('pg');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');


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
app.use(cors());



app.post('/add-product', async (req, res) => {
    const { product_name, product_description, product_price, product_quantity } = req.body;
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


app.put('/update-product/:id', async (req, res) => {
    const { id } = req.params;
    const { product_name, product_description, product_price, product_quantity } = req.body;

    const query = `
        UPDATE products 
        SET product_name = $1, product_description = $2, product_price = $3, product_quantity = $4 
        WHERE id = $5
    `;

    try {
        await pool.query(query, [product_name, product_description, product_price, product_quantity, id]);
        res.status(200).json({ message: 'Ürün başarıyla güncellendi' });
    } catch (error) {
        console.error('Ürün güncelleme hatası:', error.message);
        res.status(500).json({ error: `Ürün güncelleme sırasında hata oluştu: ${error.message}` });
    }
});


app.delete('/delete-product/:id', async (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM products WHERE id = $1 RETURNING *';

    try {
        const result = await pool.query(query, [id]);
        if (result.rowCount > 0) {
            res.status(200).json({ message: 'Ürün başarıyla silindi' });
        } else {
            res.status(404).json({ error: 'Ürün bulunamadı' });
        }
    } catch (error) {
        console.error('Ürün silme hatası', error.message);
        res.status(500).json({ error: 'Ürün silme sırasında hata oluştu' });
    }
});


app.get('/products', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM products');
        res.json(result.rows);
    } catch (error) {
        console.error('Ürünleri alma hatası:', error.message);
        res.status(500).json({ error: `Ürünleri alma sırasında hata oluştu: ${error.message}` });
    }
});


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
            console.log('Giriş başarılı:', result.rows[0]); 
            res.redirect('http://192.168.92.128:7474/home.html');
        } else {
            console.log('Yanlış email veya şifre'); 
            res.status(401).json({ message: 'Yanlış email veya şifre' });
        }
    } catch (error) {
        console.error('Giriş hatası:', error);
        res.status(500).json({ error: 'Giriş sırasında hata oluştu' });
    }
});


app.get('/users', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM users');
        res.render('users', { users: result.rows }); 
    } catch (error) {
        console.error('Veri çekme hatası', error);
        res.status(500).json({ error: 'Veri çekme sırasında hata oluştu' });
    }
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Sunucu http://0.0.0.0:${port} adresinde çalışıyor`);
});


