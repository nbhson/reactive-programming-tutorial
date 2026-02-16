# Utility Operators High-Level Summary

Nhóm này cung cấp các **CÔNG CỤ HỖ TRỢ** quan trọng. Giúp debug, xử lý tác vụ phụ (side effects), kiểm soát thời gian chờ (timeout), và chuyển đổi sang Promise.

## Giá trị cốt lõi
Giúp debug và thực hiện "tác dụng phụ" (Side Effects) mà không làm thay đổi dữ liệu của dòng chảy.

## Các Operators phổ biến
-   **tap**: "Nhìn trộm" vào dòng chảy. Dùng để `console.log` hoặc thay đổi một biến bên ngoài (ví dụ: loading = false). Nó không làm thay đổi giá trị trả về.
-   **delay**: Làm chậm dòng chảy một khoảng thời gian.
-   **finalize**: Chạy khi stream kết thúc (dù thành công hay thất bại). Dùng để tắt loading spinner.


---

## 1. tap
**Cách hoạt động**: "Kẻ nghe lén". Cho phép bạn thực hiện hành động phụ (Side Effect) mà **KHÔNG HỀ** làm thay đổi giá trị của dòng chảy.
-   **Ứng dụng**: Log console để debug, cập nhật biến toàn cục, set loading = true.
-   **Ví dụ Code**:
    ```javascript
    import { of } from 'rxjs';
    import { tap, map } from 'rxjs/operators';

    of(1, 2, 3).pipe(
        tap(val => console.log('Before Map:', val)), // Chỉ log, không sửa đổi
        map(val => val * 10),
        tap(val => console.log('After Map:', val))
    ).subscribe();
    ```

---

## 2. finalize
**Cách hoạt động**: "Chốt hạ". Một hàm callback sẽ **LUÔN LUÔN** được gọi khi stream kết thúc (dù là Complete hay Error).
-   **Tương tự**: `finally` trong `try-catch-finally`.
-   **Ứng dụng**: **Tắt xoay loading** (Loading Spinner) sau khi gọi API xong (dù thành công hay thất bại).
-   **Ví dụ Code**:
    ```javascript
    import { of } from 'rxjs';
    import { delay, finalize } from 'rxjs/operators';

    console.log('Spinner: ON');

    of('Data').pipe(
        delay(2000), // Giả lập lagg
        finalize(() => console.log('Spinner: OFF')) // Luôn chạy cuối cùng
    ).subscribe(console.log);
    ```

---

## 3. delay
**Cách hoạt động**: "Hẹn giờ". Hoãn việc phát giá trị của toàn bộ stream lại X ms.
-   **Ví dụ Code**: `delay(1000)` -> Chờ 1s mới bắt đầu phát.

---

## 4. timeout
**Cách hoạt động**: "Không đợi nữa". Nếu sau X ms mà stream chưa phát ra giá trị nào, nó sẽ **BẮN LỖI** (Error).
-   **Ứng dụng**: Giới hạn thời gian chờ API. Nếu server treo quá 10s -> Báo lỗi "Server too slow".
-   **Ví dụ Code**:
    ```javascript
    import { interval } from 'rxjs';
    import { timeout } from 'rxjs/operators';

    // Giả lập stream chậm (2s mới bắn)
    interval(2000).pipe(
        timeout(1000) // Chỉ cho phép chờ 1s
    ).subscribe({
        error: err => console.error('Lỗi: Quá hạn chờ!')
    });
    ```

---

## 5. repeat
**Cách hoạt động**: "Lặp lại". Nếu stream complete, nó sẽ tự động subscribe lại từ đầu thêm N lần nữa.
-   **Ví dụ Code**:
    ```javascript
    import { of } from 'rxjs';
    import { repeat } from 'rxjs/operators';

    of('Hello').pipe(
        repeat(3) // Lặp lại 3 lần
    ).subscribe(console.log);
    // Output: Hello -> Hello -> Hello
    ```

---

## 6. Chuyển đổi sang Promise (Convert to Promise)
RxJS cung cấp cách chuyển Observable thành Promise để dùng với `async/await`.
*Lưu ý: `toPromise()` đã bị deprecated (lỗi thời).*

### lastValueFrom (Phổ biến nhất)
-   **Cách hoạt động**: Chờ stream **complete**, lấy giá trị cuối cùng trả về Promise.
-   **Ví dụ Code**:
    ```javascript
    import { interval, lastValueFrom } from 'rxjs';
    import { take } from 'rxjs/operators';

    async function getData() {
        const source$ = interval(1000).pipe(take(3)); // 0, 1, 2 -> Complete
        const lastVal = await lastValueFrom(source$);
        console.log(lastVal); // 2
    }
    ```

### firstValueFrom
-   **Cách hoạt động**: Lấy giá trị đầu tiên rồi unsubscribe ngay, trả về Promise. (Giống `take(1)`).
