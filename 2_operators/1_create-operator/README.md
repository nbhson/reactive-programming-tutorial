# Creation Operators High-Level Summary

Nhóm này chuyên dùng để **TẠO RA** các Observable từ nhiều nguồn khác nhau (giá trị, sự kiện, thời gian...). Đây là bước đầu tiên để bước vào thế giới Reactive.

## Giá trị cốt lõi
Biến bất cứ thứ gì (Event, Promise, Array, Timer) thành một Observable Stream. Đây là cầu nối giữa thế giới "tĩnh" và thế giới "động".

## Các Operators phổ biến
-   **of**: Biến danh sách giá trị rời rạc thành stream.
-   **from**: Biến mảng hoặc Promise thành stream.
-   **fromEvent**: Biến DOM Event (click, scroll) thành stream.
-   **interval / timer**: Tạo stream theo thời gian (giống setInterval).

---

## 1. of
**Cách hoạt động**: "Phát hàng ngay lập tức". Tạo ra một Observable phát ra các giá trị được truyền vào theo thứ tự, rồi complete ngay lập tức.
-   **Nguồn**: Giá trị tĩnh (primitive, object, array...).
-   **Hoàn thành (Complete)**: Ngay sau khi phát hết các giá trị.
-   **Ví dụ Code**:
    ```javascript
    import { of } from 'rxjs';

    of(1, 2, 'Hello', { id: 4 }).subscribe({
        next: val => console.log(val),
        complete: () => console.log('Done')
    });
    // Output: 1 -> 2 -> 'Hello' -> { id: 4 } -> Done
    ```

---

## 2. from
**Cách hoạt động**: "Chuyển đổi sang Observable". Biến các cấu trúc dữ liệu khác (Array, Promise, Iterable) thành Observable.
-   **Nguồn**: Array, Promise, Set, Map, String...
-   **Promise**: Nếu truyền vào Promise, nó sẽ đợi Promise resolve rồi phát giá trị (hoặc error nếu reject) rồi complete.
-   **Ví dụ Code**:
    ```javascript
    import { from } from 'rxjs';

    // 1. Từ Array
    from([10, 20, 30]).subscribe(console.log); 
    // Output: 10 -> 20 -> 30

    // 2. Từ Promise
    const promise = new Promise(resolve => setTimeout(() => resolve('Resolved!'), 1000));
    from(promise).subscribe(console.log);
    // Output (sau 1s): "Resolved!"
    ```

---

## 3. fromEvent
**Cách hoạt động**: "Lắng nghe sự kiện". Tạo Observable từ các sự kiện DOM (click, keyup...) hoặc Node.js EventEmitter.
-   **Hoàn thành**: **KHÔNG BAO GIỜ** tự complete. Bạn phải chủ động `unsubscribe` hoặc dùng operator như `take`, `takeUntil` để tránh tràn bộ nhớ (memory leak).
-   **Ví dụ Code**:
    ```javascript
    import { fromEvent } from 'rxjs';

    const clicks$ = fromEvent(document, 'click');

    const sub = clicks$.subscribe(event => {
        console.log('User clicked at:', event.clientX, event.clientY);
    });

    // Đừng quên:
    // sub.unsubscribe(); // Khi component destroy
    ```

---

## 4. interval
**Cách hoạt động**: "Đồng hồ đếm nhịp". Phát ra các số nguyên tăng dần (0, 1, 2...) theo một chu kỳ thời gian nhất định (ms).
-   **Hoàn thành**: **KHÔNG BAO GIỜ** tự complete. Cần unsubscribe thủ công.
-   **Ví dụ Code**:
    ```javascript
    import { interval } from 'rxjs';

    interval(1000).subscribe(val => console.log(`Tick: ${val}`));
    // Output: Tick: 0 (sau 1s) -> Tick: 1 (sau 2s) -> ... mãi mãi
    ```

---

## 5. timer
**Cách hoạt động**: "Hẹn giờ".
    1.  **Dạng 1 (1 tham số)**: Chờ X ms, phát ra số 0, rồi **complete**. (Giống `setTimeout`).
    2.  **Dạng 2 (2 tham số)**: Chờ X ms, phát ra số 0, sau đó cứ mỗi Y ms phát ra số tiếp theo (1, 2...). (Giống `setTimeout` + `setInterval`).
-   **Ví dụ Code**:
    ```javascript
    import { timer } from 'rxjs';

    // Dạng 1: Delay 2s rồi chạy
    timer(2000).subscribe(() => console.log('After 2 seconds'));

    // Dạng 2: Delay 1s, sau đó tick mỗi 500ms
    timer(1000, 500).subscribe(val => console.log(`Timer: ${val}`));
    // Output: (chờ 1s) -> 0 -> (chờ 0.5s) -> 1 -> (chờ 0.5s) -> 2...
    ```

---

## 6. throwError
**Cách hoạt động**: "Báo lỗi ngay". Tạo ra một Observable không phát giá trị nào cả, mà bắn ra lỗi ngay lập tức.
-   **Ứng dụng**: Thường dùng trong `catchError` để ném lỗi lại cho subscriber xử lý sau khi đã log lỗi.
-   **Ví dụ Code**:
    ```javascript
    import { throwError } from 'rxjs';

    throwError(() => new Error('Something went wrong!')).subscribe({
        next: val => console.log(val),
        error: err => console.error('Caught error:', err.message)
    });
    // Output: Caught error: Something went wrong!
    ```

---

## 7. defer
**Cách hoạt động**: "Trì hoãn khởi tạo". Chỉ khi nào có người `subscribe` thì mới bắt đầu tạo Observable (gọi hàm factory).
-   **Điểm hay**: Mỗi subscriber sẽ nhận được một Observable **mới tinh**. Giúp giá trị khởi tạo luôn mới nhất tại thời điểm subscribe (ví dụ `Date.now()` hoặc `Math.random()`).
-   **Ví dụ Code**:
    ```javascript
    import { of, defer } from 'rxjs';

    // Cách thường: Random được tính NGAY LÚC KHAI BÁO
    const randomNormal$ = of(Math.random());

    // Cách defer: Random được tính LÚC SUBSCRIBE
    const randomDefer$ = defer(() => of(Math.random()));

    console.log('--- Normal ---');
    randomNormal$.subscribe(val => console.log(val)); // 0.123
    randomNormal$.subscribe(val => console.log(val)); // 0.123 (Giống hệt nhau)

    console.log('--- Defer ---');
    randomDefer$.subscribe(val => console.log(val)); // 0.456
    randomDefer$.subscribe(val => console.log(val)); // 0.789 (Khác nhau!)
    ```
