1. 資料庫連接設定
步驟 1: 安裝必要的套件
首先，確保已安裝所有必要的 Node.js 套件：
bashnpm install express mysql2 dotenv cors body-parser
步驟 2: 設定環境變數
創建一個 .env 文件並根據您的 MySQL 設定填寫：
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=您的密碼
DB_NAME=professor_website
PORT=3000
步驟 3: 初始化資料庫
執行我們提供的 database.sql 腳本來建立和初始化資料庫：
bashmysql -u root -p < database.sql
2. 連接和調用資料庫
我們使用 mysql2/promise 模組來建立連接池，這樣可以處理多個同時的資料庫請求：
javascript// 在 api.js 中
const mysql = require('mysql2/promise');

// 創建資料庫連接池
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'professor_website',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});
3. 如何查詢資料
查詢單筆資料
javascriptapp.get('/api/professor', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM professor_info LIMIT 1');

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: '找不到教授資訊'
            });
        }

        res.json({
            success: true,
            data: rows[0]
        });
    } catch (error) {
        console.error('獲取教授資料時發生錯誤:', error);
        res.status(500).json({
            success: false,
            message: '獲取教授資料時發生錯誤',
            error: error.message
        });
    }
});
查詢多筆資料
javascriptapp.get('/api/publications', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM publications ORDER BY year DESC, id DESC');

        res.json({
            success: true,
            data: rows
        });
    } catch (error) {
        console.error('獲取論文資料時發生錯誤:', error);
        res.status(500).json({
            success: false,
            message: '獲取論文資料時發生錯誤',
            error: error.message
        });
    }
});
使用參數查詢資料
當您需要在查詢中使用變數時，應使用參數化查詢以防止 SQL 注入攻擊：
javascriptapp.get('/api/awards/:year', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM awards WHERE year = ?', [req.params.year]);

        res.json({
            success: true,
            data: rows
        });
    } catch (error) {
        console.error('獲取獎項資料時發生錯誤:', error);
        res.status(500).json({
            success: false,
            message: '獲取獎項資料時發生錯誤',
            error: error.message
        });
    }
});
4. 如何新增、更新和刪除資料
新增資料
javascriptapp.post('/api/projects', async (req, res) => {
    try {
        const { title, year, funding_agency, description, is_internal } = req.body;

        // 驗證必要欄位
        if (!title || !year) {
            return res.status(400).json({
                success: false,
                message: '標題和年份是必填欄位'
            });
        }

        // 插入資料
        const [result] = await pool.query(
            'INSERT INTO research_projects (title, year, funding_agency, description, is_internal) VALUES (?, ?, ?, ?, ?)',
            [title, year, funding_agency, description, is_internal || false]
        );

        res.json({
            success: true,
            message: '成功新增研究計畫',
            data: { id: result.insertId }
        });
    } catch (error) {
        console.error('新增研究計畫時發生錯誤:', error);
        res.status(500).json({
            success: false,
            message: '新增研究計畫時發生錯誤',
            error: error.message
        });
    }
});
更新資料
javascriptapp.put('/api/professor/:id', async (req, res) => {
    try {
        const { name, title, email, phone, biography } = req.body;
        const professorId = req.params.id;

        // 更新資料
        await pool.query(
            'UPDATE professor_info SET name = ?, title = ?, email = ?, phone = ?, biography = ? WHERE id = ?',
            [name, title, email, phone, biography, professorId]
        );

        res.json({
            success: true,
            message: '成功更新教授資訊'
        });
    } catch (error) {
        console.error('更新教授資訊時發生錯誤:', error);
        res.status(500).json({
            success: false,
            message: '更新教授資訊時發生錯誤',
            error: error.message
        });
    }
});
刪除資料
javascriptapp.delete('/api/publications/:id', async (req, res) => {
    try {
        const publicationId = req.params.id;

        // 刪除資料
        await pool.query('DELETE FROM publications WHERE id = ?', [publicationId]);

        res.json({
            success: true,
            message: '成功刪除論文'
        });
    } catch (error) {
        console.error('刪除論文時發生錯誤:', error);
        res.status(500).json({
            success: false,
            message: '刪除論文時發生錯誤',
            error: error.message
        });
    }
});
5. 啟動服務器
javascript// 在 api.js 檔案的最後
app.listen(PORT, () => {
    console.log(`伺服器運行於 ${PORT} 端口`);
});
6. 前端調用資料庫資料
在前端 JavaScript (main.js) 中，使用 fetch API 來調用後端 API：
javascriptasync function fetchData(url, options = {}) {
    try {
        const response = await fetch(url, options);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error(`Fetch error for ${url}:`, error);
        throw error;
    }
}

// 調用 API 獲取數據
function loadProfessorData() {
    fetchData('/api/professor')
        .then(data => {
            if (data && data.success) {
                const professor = data.data;
                document.getElementById('professor-name').textContent = professor.name;
                // 更多處理...
            }
        })
        .catch(error => {
            console.error('獲取教授資料錯誤:', error);
            // 錯誤處理...
        });
}
7. 專案啟動步驟

安裝所有依賴項：
bashnpm install

創建 .env 檔案並設定資料庫連接參數
執行資料庫初始化腳本：
bashmysql -u root -p < database.sql

啟動服務器：
bashnpm start

開啟瀏覽器訪問：http://localhost:3000

透過以上步驟，您可以成功連接 MySQL 資料庫，並在您的網頁應用中調用資料庫的資料。