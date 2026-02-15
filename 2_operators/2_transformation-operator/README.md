# Transformation Operators High-Level Summary

Nhóm này chuyên dùng để **BIẾN ĐỔI** dữ liệu. Giúp bạn chuyển hóa dữ liệu từ dạng này sang dạng khác (số sang chuỗi, luồng đơn lẻ sang mảng...) để phù hợp với nhu cầu hiển thị hoặc xử lý tiếp theo.

## Giá trị cốt lõi
Giống như nhà máy chế biến: Nhập nguyên liệu thô (Raw Data) -> Qua dây chuyền (Operators) -> Xuất ra thành phẩm (Processed Data).

## Giá trị cốt lõi
Chuyển đổi dữ liệu trôi qua stream giống như `Array.map` nhưng theo thời gian.

## Các Operators phổ biến
-   **map**: `x => y`. Biến đổi 1-1.
-   **pluck**: Nhặt ra 1 thuộc tính trong object.
-   **scan**: Giống `Array.reduce`. Cộng dồn giá trị theo thời gian (ví dụ: tính tổng điểm số hiện tại).
-   **buffer**: Gom nhiều giá trị lại thành 1 mảng rồi mới phát đi.

---

## 1. map
**Cách hoạt động**: "Biến hình". Giống `Array.map`. Nhận vào 1 giá trị, trả ra 1 giá trị mới đã qua xử lý.
-   **Ứng dụng**: Lấy prop từ object, tính toán toán học, format date.
-   **Ví dụ Code**:
    ```javascript
    import { of } from 'rxjs';
    import { map } from 'rxjs/operators';

    of(1, 2, 3).pipe(
        map(x => x * 10) // Nhân 10
    ).subscribe(console.log);
    // Output: 10, 20, 30
    ```

---

## 2. scan
**Cách hoạt động**: "Cộng dồn liên tục". Giống `Array.reduce` nhưng **phát ra kết quả sau mỗi lần cộng dồn**. Nó nhớ trạng thái (accumulator) của lần trước.
-   **Ứng dụng**: Tính tổng tiền, đếm số lượng tin nhắn, State Management (Redux pattern).
-   **Ví dụ Code**:
    ```javascript
    import { of } from 'rxjs';
    import { scan } from 'rxjs/operators';

    of(1, 2, 3).pipe(
        scan((acc, curr) => acc + curr, 0) // Cộng dồn
    ).subscribe(console.log);
    // Output:
    // 1 (0 + 1)
    // 3 (1 + 2)
    // 6 (3 + 3)
    ```

---

## 3. reduce
**Cách hoạt động**: "Cộng dồn rồi chốt". Giống hệt `scan`, nhưng chỉ phát ra giá trị **DUY NHẤT** là kết quả cuối cùng khi stream **COMPLETE**.
-   **Ứng dụng**: Tính tổng kết cuối ngày, tính điểm trung bình.
-   **Ví dụ Code**:
    ```javascript
    import { of } from 'rxjs';
    import { reduce } from 'rxjs/operators';

    of(1, 2, 3).pipe(
        reduce((acc, curr) => acc + curr, 0)
    ).subscribe(console.log);
    // Output: 6 (Chỉ 1 số duy nhất)
    ```

---

## 4. buffer
**Cách hoạt động**: "Gom hàng chờ lệnh". Gom các giá trị vào một mảng `[]`, chờ đến khi có "tín hiệu" (Notifier) thì trả mảng đó ra và reset mảng mới.
-   **Ví dụ Code**:
    ```javascript
    import { interval, fromEvent } from 'rxjs';
    import { buffer } from 'rxjs/operators';

    const source$ = interval(100); // Phát số liên tục
    const click$ = fromEvent(document, 'click'); // Tín hiệu

    source$.pipe(
        buffer(click$) // Gom số lại, khi click mới nhả ra
    ).subscribe(console.log);
    // Output khi click: [0, 1, 2, 3...]
    ```

## 5. bufferTime
**Cách hoạt động**: "Gom hàng theo giờ". Giống `buffer` nhưng tín hiệu là thời gian (ví dụ: cứ 1 giây nhả hàng 1 lần).
-   **Ví dụ Code**:
    ```javascript
    import { interval } from 'rxjs';
    import { bufferTime } from 'rxjs/operators';

    interval(100).pipe(
        bufferTime(1000) // Cứ 1s gom lại thành 1 mảng
    ).subscribe(console.log);
    // Output: [0, 1, ... 9], [10, 11, ... 19]
    ```

---

## 6. toArray
**Cách hoạt động**: "Gom tất cả". Chờ stream **complete**, rồi gom toàn bộ giá trị đã phát ra thành 1 mảng duy nhất.
-   **Ví dụ Code**:
    ```javascript
    import { of } from 'rxjs';
    import { toArray } from 'rxjs/operators';

    of('A', 'B', 'C').pipe(
        toArray()
    ).subscribe(console.log);
    // Output: ['A', 'B', 'C']
    ```

---

## Tóm tắt So sánh Accumulation

| Operator | Hành vi | Phát giá trị khi nào? | Kiểu dữ liệu trả về |
| :--- | :--- | :--- | :--- |
| **scan** | Cộng dồn | Sau mỗi lần có giá trị mới | Giá trị (Accumulator) |
| **reduce** | Cộng dồn | Chỉ khi Complete | Giá trị (Final Accumulator) |
| **toArray** | Gom mảng | Chỉ khi Complete | Mảng (Array) |
| **buffer** | Gom mảng | Khi có tín hiệu | Mảng (Array chunk) |
