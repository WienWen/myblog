import express from 'express';
import mysql from 'mysql2/promise';

const app = express();
const port = 3000;
app.use(express.json());

// 创建数据库连接池
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'myblog',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// 获取单篇文章的路由
app.get('/api/articles/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, title, content, createTime, updateTime FROM articles WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: '文章未找到' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('获取文章数据时出错:', error);
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
});

// 获取所有文章的路由（带分页）
app.get('/api/articles', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 9;
    const offset = (page - 1) * pageSize;

    const [articles] = await pool.query('SELECT id, title, LEFT(content, 40) AS content, createTime, updateTime FROM articles LIMIT ? OFFSET ?', [pageSize, offset]);
    const [totalCount] = await pool.query('SELECT COUNT(*) as count FROM articles');

    res.json({
      articles: articles,
      total: totalCount[0].count
    });
  } catch (error) {
    console.error('获取文章列表时出错:', error);
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
});

// 新增搜索API
app.get('/api/search', async (req, res) => {
  try {
    const { keyword, page = 1, pageSize = 9 } = req.query;
    const offset = (page - 1) * pageSize;

    const searchQuery = `%${keyword}%`;
    const [articles] = await pool.query(
      'SELECT id, title, LEFT(content, 40) AS content, createTime, updateTime FROM articles WHERE title LIKE ? OR content LIKE ? LIMIT ? OFFSET ?',
      [searchQuery, searchQuery, parseInt(pageSize), offset]
    );

    const [totalCount] = await pool.query(
      'SELECT COUNT(*) as count FROM articles WHERE title LIKE ? OR content LIKE ?',
      [searchQuery, searchQuery]
    );

    res.json({
      articles: articles,
      total: totalCount[0].count
    });
  } catch (error) {
    console.error('搜索文章时出错:', error);
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
});

// 获取所有留言的路由
app.get('/api/messages', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, name, email, content, createTime FROM messages ORDER BY createTime DESC');
    res.json(rows);
  } catch (error) {
    console.error('获取留言时出错:', error);
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
});

// 提交新留言的路由
app.post('/api/messages', async (req, res) => {
  const { name, email, content } = req.body;
  if (!name || !email || !content) {
    return res.status(400).json({ message: '请填写所有必填字段' });
  }
  try {
    const [result] = await pool.query('INSERT INTO messages (name, email, content) VALUES (?, ?, ?)', [name, email, content]);
    res.status(201).json({ id: result.insertId, name, email, content, createTime: new Date() });
  } catch (error) {
    console.error('提交留言时出错:', error);
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
});

// 删除文章的路由
app.delete('/api/articles/:id', async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM articles WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      res.status(404).json({ message: '文章不存在' });
    } else {
      res.status(200).json({ message: '文章已删除' });
    }
  } catch (error) {
    console.error('删除文章时出错:', error);
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
});

// 删除留言的路由
app.delete('/api/messages/:id', async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM messages WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      res.status(404).json({ message: '留言不存在' });
    } else {
      res.status(200).json({ message: '留言已删除' });
    }
  } catch (error) {
    console.error('删除留言时出错:', error);
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
});

// 添加文章的路由
app.post('/api/articles', async (req, res) => {
  try {
    const { title, content } = req.body
    const [result] = await pool.query(
      'INSERT INTO articles (title, content) VALUES (?, ?)',
      [title, content]
    )
    const [newArticle] = await pool.query('SELECT * FROM articles WHERE id = ?', [result.insertId])
    res.status(201).json(newArticle[0])
  } catch (error) {
    console.error('添加文章时出错:', error)
    res.status(500).json({ message: '服务器错误', error: error.message })
  }
})

// 更新文章的路由
app.put('/api/articles/:id', async (req, res) => {
  try {
    const { title, content } = req.body
    await pool.query(
      'UPDATE articles SET title = ?, content = ?, updateTime = CURRENT_TIMESTAMP WHERE id = ?',
      [title, content, req.params.id]
    )
    const [updatedArticle] = await pool.query('SELECT * FROM articles WHERE id = ?', [req.params.id])
    res.json(updatedArticle[0])
  } catch (error) {
    console.error('更新文章时出错:', error)
    res.status(500).json({ message: '服务器错误', error: error.message })
  }
})

app.listen(port, () => {
  console.log(`服务器运行在 http://localhost:${port}`);
});
