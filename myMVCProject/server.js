// File: server.js

const express = require('express');
const cors = require('cors');

// Khởi tạo ứng dụng express
const app = express();
const PORT = 3000;

// --- Cấu hình Middleware ---
// Cho phép các request từ các nguồn khác (frontend)
app.use(cors()); 
// Cho phép server đọc dữ liệu JSON được gửi lên trong body của request
app.use(express.json()); 

// --- ROUTER LAYER ---
// Đây là Router cho chức năng đăng nhập
app.post('/api/login', (req, res) => {
    // req.body chứa dữ liệu mà frontend gửi lên (nhờ có app.use(express.json()))
    const { email, password } = req.body;

    console.log('✅ Backend đã nhận được thông tin:');
    console.log('Email:', email);
    console.log('Password:', password);

    // Phản hồi tạm thời về cho frontend
    // Sau này chúng ta sẽ xử lý logic thật ở đây
    if (email && password) {
        res.status(200).json({ success: true, message: 'Backend đã nhận được thông tin!' });
    } else {
        res.status(400).json({ success: false, message: 'Vui lòng cung cấp email và password.' });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
});