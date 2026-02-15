# Sync vs Async & The Evolution to Streams

## Giá trị cốt lõi
Hiểu được giới hạn của `Promise` và tại sao chúng ta cần `Observable` để xử lý các sự kiện đa giá trị (multi-value) theo thời gian.

## 1. Callback (Quá khứ)
Dễ gây ra "Callback Hell", khó quản lý lỗi và luồng chạy.

## 2. Promise (Hiện tại - cho Single Value)
`Promise` giải quyết tốt vấn đề của Callback nhưng có một giới hạn lớn: **Nó chỉ resolve một lần duy nhất.**

```javascript
// Promise chỉ trả về 1 giá trị rồi đóng kết nối
const promise = new Promise(resolve => {
    setTimeout(() => resolve('Hello'), 1000);
    setTimeout(() => resolve('World'), 2000); // Bị lờ đi!
});
```

Xem ví dụ trong [1_promise_limitations](./1_promise_limitations) để thấy rõ điều này.

## 3. Observable (Tương lai - cho Multi Value)
Thực tế, dữ liệu thường đến theo luồng liên tục:
-   Người dùng click chuột (nhiều lần).
-   Socket gửi tin nhắn (nhiều lần).
-   Bộ đếm thời gian (setInterval).

`Promise` không thể xử lý những thứ này một cách tự nhiên. Đó là lý do `Observable` ra đời.

> **Tổng kết:**
> -   **Function**: Trả 1 giá trị, đồng bộ.
> -   **Iterator**: Trả nhiều giá trị, đồng bộ (Pull).
> -   **Promise**: Trả 1 giá trị, bất đồng bộ.
> -   **Observable**: Trả nhiều giá trị, bất đồng bộ (Push).
