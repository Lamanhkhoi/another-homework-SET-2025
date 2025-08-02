// 1. Lấy ra các phần tử HTML cần tương tác qua id của chúng
const loginForm = document.getElementById('loginForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const messageDiv = document.getElementById('message');

// 2. Gắn một sự kiện "submit" vào form
loginForm.addEventListener('submit', function(event) {
    // Ngăn chặn hành vi mặc định của form là tải lại trang
    event.preventDefault(); 

    // 3. Lấy giá trị từ các ô input mà người dùng đã nhập
    const email = emailInput.value;
    const password = passwordInput.value;

    // Kiểm tra xem người dùng đã nhập đủ thông tin chưa
    if (email === '' || password === '') {
        messageDiv.textContent = 'Vui lòng nhập đầy đủ email và mật khẩu!';
        messageDiv.style.color = 'red';
        return; 
    }
    
    // Hiển thị thông báo cho thấy DOM đã lấy dữ liệu thành công
    messageDiv.textContent = `Đã lấy dữ liệu! Sẵn sàng gửi đi... Email: ${email}`;
    messageDiv.style.color = 'green';
    

    fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: email, password: password })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Phản hồi từ server:', data);
        if (data.success) {
            messageDiv.textContent = data.message;
            messageDiv.style.color = 'blue';
            // Ví dụ: lưu token và chuyển hướng trang
            // localStorage.setItem('token', data.token);
            // window.location.href = '/dashboard';
        } else {
            messageDiv.textContent = data.message;
            messageDiv.style.color = 'red';
        }
    })
    .catch(error => {
        console.error('Lỗi khi kết nối tới server:', error);
        messageDiv.textContent = 'Có lỗi xảy ra, không thể kết nối tới server.';
        messageDiv.style.color = 'red';
    });

});