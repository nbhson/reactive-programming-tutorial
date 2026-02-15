# Pull vs Push

## Giá trị cốt lõi
Phân biệt cơ chế lấy dữ liệu (Pull) và nhận dữ liệu (Push).

## 1. Pull (Kéo) - The Iterator Pattern
Người tiêu thụ (Consumer) quyết định khi nào lấy dữ liệu từ người sản xuất (Producer).
-   **Bạn**: Gọi hàm `getData()`.
-   **Producer**: Trả về dữ liệu.
-   **Ví dụ**: Function call, Generator (`function*`).

```javascript
// Bạn chủ động gọi next()
const iterator = generator();
iterator.next(); // 1
iterator.next(); // 2
```

Xem ví dụ trong [1_iterator](./1_iterator).

## 2. Push (Đẩy) - The Observer Pattern
Người sản xuất (Producer) quyết định khi nào gửi dữ liệu cho người tiêu thụ (Consumer).
-   **Producer**: Bắn một sự kiện.
-   **Bạn**: "Đăng ký" (Subscribe) để lắng nghe.
-   **Ví dụ**: DOM Events, WebSocket, RxJS Observable.

```javascript
// Bạn chỉ ngồi chờ, Producer tự đẩy sự kiện tới
document.addEventListener('click', () => console.log('Clicked!'));
```

Xem ví dụ trong [2_observer](./2_observer).
RxJS là thư viện **Push-based**.
