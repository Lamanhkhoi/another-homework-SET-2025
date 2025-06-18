// Hàm prepareFood vẫn giữ nguyên, vì nó là nguồn cung cấp Promise
function prepareFood() {
  return new Promise((resolve, reject) => {
    console.log("Bếp đang chuẩn bị món ăn...");
    setTimeout(() => {
      if (Math.random() > 0.2) {
        resolve("Món ăn của bạn đã sẵn sàng!");
      } else {
        reject("Lỗi: Nhà bếp hết nguyên liệu.");
      }
    }, 2000);
  });
}

// Viết một hàm async để xử lý việc đặt hàng
async function handleOrder() {
  try {
    console.log("Khách hàng đặt món...");

    // Tạm dừng ở đây, chờ cho prepareFood() hoàn thành
    // và lấy kết quả trả về gán vào biến 'result'
    const result = await prepareFood();

    // Dòng này chỉ chạy SAU KHI await ở trên có kết quả
    console.log("THÀNH CÔNG:", result);

  } catch (error) {
    // Nếu prepareFood() bị reject, code sẽ nhảy vào khối catch này
    console.error("THẤT BẠI:", error);
  } finally {
    console.log("Quá trình đặt hàng kết thúc.");
  }
}

// Gọi hàm async để bắt đầu
handleOrder();