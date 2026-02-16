# Testing Asynchronous Streams (Marble Diagrams)

## Giá trị cốt lõi
Viết test cho code bất đồng bộ mà **không cần dùng `setTimeout`** hay chờ đợi thật sự.

## Marble Diagrams
Là cách biểu diễn trực quan luồng thời gian bằng các ký tự ASCII.

-   `-`: Một đơn vị thời gian (1 frame).
-   `x`: Một giá trị được emit.
-   `|`: Stream kết thúc (complete).
-   `#`: Stream lỗi (error).

## Ví dụ
Giả sử ta test hàm `debounceTime(10)`:

```javascript
const source = cold('-a-b-c-|');
const expected =    '-----c-|'; // a và b bị bỏ qua vì quá gần nhau
expectObservable(source.pipe(debounceTime(10))).toBe(expected);
```

Test chạy ngay lập tức, không cần chờ 10ms!
