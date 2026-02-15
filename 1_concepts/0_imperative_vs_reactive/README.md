# Imperative vs Reactive

## Giá trị cốt lõi
Hiểu được sự thay đổi về tư duy từ "gán giá trị" sang "khai báo quan hệ".

## 1. Imperative (Mệnh lệnh)
Trong lập trình mệnh lệnh truyền thống, chúng ta viết code để thực hiện các bước tuần tự.

```javascript
let a = 10;
let b = a + 5;
console.log(b); // 15

a = 20;
console.log(b); // vẫn là 15! b không thay đổi trừ khi ta gán lại.
```

## 2. Reactive (Phản ứng)
Trong lập trình phản ứng, `b` sẽ tự động cập nhật khi `a` thay đổi. Hãy tưởng tượng `b` là một ô trong Excel có công thức `= A1 + 5`.

```javascript
// Giả mã (Pseudo-code)
let a$ = scale(10);
let b$ = a$.map(x => x + 5);

b$.subscribe(val => console.log(val)); // 15

a$.next(20);
// b$ tự động cập nhật và log ra 25!
```

**Tại sao cần Reactive?**
Trong các ứng dụng hiện đại, dữ liệu thay đổi liên tục (sự kiện chuột, API response, WebSocket). Thay vì phải gọi hàm để cập nhật lại UI thủ công ở nhiều nơi, chúng ta khai báo mối quan hệ dữ liệu ngay từ đầu.
