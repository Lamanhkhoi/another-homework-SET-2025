function prepareFood() {
  // Hàm này trả về một "Lời hứa"
  return new Promise((resolve, reject) => {
    console.log("Bếp đang chuẩn bị món ăn...");
    // Giả sử việc chuẩn bị mất 2 giây
    setTimeout(() => {
      // Giả lập 80% thành công, 20% thất bại
      if (Math.random() > 0.2) {
        // Thành công! Gọi resolve() và trả về kết quả
        resolve("Món ăn của bạn đã sẵn sàng!");
      } else {
        // Thất bại! Gọi reject() và trả về lỗi
        reject("Lỗi: Nhà bếp hết nguyên liệu.");
      }
    }, 2000);
  });
}

// Bây giờ, chúng ta sử dụng Promise này
console.log("Khách hàng đặt món...");

prepareFood()
  .then(successMessage => {
    // Chạy khi Promise ở trạng thái "fulfilled"
    console.log("THÀNH CÔNG:", successMessage);
  })
  .catch(errorMessage => {
    // Chạy khi Promise ở trạng thái "rejected"
    console.error("THẤT BẠI:", errorMessage);
  })
  .finally(() => {
    // Luôn chạy cuối cùng
    console.log("Quá trình đặt hàng kết thúc.");
  });