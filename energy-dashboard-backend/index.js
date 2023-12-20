const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Client } = require('@elastic/elasticsearch');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

// Elasticsearch client
const esClient = new Client({ node: 'http://localhost:9200' });

// Secret key for JWT
const secretKey = 'yourSecretKey';

// In-memory storage for refresh tokens (You should use a more persistent storage in a production environment)
const refreshTokens = [];

// Middleware to verify JWT
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  jwt.verify(token, secretKey, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }

    req.user = user;
    next();
  });
};

// Kullanıcı kaydı ve JWT oluşturma
app.post('/api/register', async (req, res) => {
  try {
    const { username, password, name, email, role } = req.body;

    // Şifreyi hashle
    const hashedPassword = await bcrypt.hash(password, 10);

    // Elasticsearch'e kullanıcı ekleme
    await esClient.index({
      index: 'users',
      body: { username, password: hashedPassword, name, email, role },
    });

    // JWT oluştur
    const accessToken = jwt.sign({ username, role }, secretKey, { expiresIn: '15m' });

    // Refresh token oluştur
    const refreshToken = jwt.sign({ username, role }, secretKey);

    // Refresh token'i sakla (gerçek bir uygulama için daha kalıcı bir saklama yöntemi kullanmalısınız)
    refreshTokens.push(refreshToken);

    res.status(201).json({ message: 'Kullanıcı başarıyla kaydedildi', accessToken, refreshToken });
  } catch (error) {
    console.error('Kayıt hatası:', error);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

// Kullanıcı girişi ve JWT oluşturma
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Elasticsearch üzerinde kullanıcı sorgulama
    const result = await esClient.search({
      index: 'users',
      body: {
        query: {
          match: {
            username,
          },
        },
      },
    });

    if (result.body.hits.total.value > 0) {
      // Kullanıcı bulundu, şifre kontrolü yapılabilir
      const user = result.body.hits.hits[0]._source;
      if (await bcrypt.compare(password, user.password)) {
        // JWT oluştur
        const accessToken = jwt.sign({ username, role: user.role }, secretKey, { expiresIn: '15m' });

        // Refresh token oluştur
        const refreshToken = jwt.sign({ username, role: user.role }, secretKey);

        // Refresh token'i sakla (gerçek bir uygulama için daha kalıcı bir saklama yöntemi kullanmalısınız)
        refreshTokens.push(refreshToken);

        res.status(200).json({ message: 'Başarıyla giriş yapıldı', accessToken, refreshToken });
      } else {
        res.status(401).json({ error: 'Geçersiz şifre' });
      }
    } else {
      res.status(404).json({ error: 'Kullanıcı bulunamadı' });
    }
  } catch (error) {
    console.error('Giriş hatası:', error);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

// Refresh token kullanarak yeni bir JWT oluşturma
app.post('/api/refresh-token', (req, res) => {
  const refreshToken = req.body.refreshToken;

  if (!refreshToken || !refreshTokens.includes(refreshToken)) {
    return res.status(403).json({ error: 'Invalid refresh token' });
  }

  jwt.verify(refreshToken, secretKey, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid refresh token' });
    }

    const accessToken = jwt.sign({ username: user.username, role: user.role }, secretKey, { expiresIn: '15m' });

    res.status(200).json({ accessToken });
  });
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
