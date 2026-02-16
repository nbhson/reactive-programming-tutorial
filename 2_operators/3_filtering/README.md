# Filtering Operators High-Level Summary

Nhóm này chuyên dùng để **LỌC BỎ** dữ liệu. Giúp bạn chỉ nhận được những gì mình thực sự quan tâm từ dòng chảy.

## Giá trị cốt lõi
"Chắn cống". Loại bỏ những sự kiện (events) không cần thiết để giảm tải xử lý.

## Các Operators phổ biến
-   **filter**: Điều kiện Boolean. (Chỉ lấy số chẵn, chỉ lấy user actie).
-   **first**: Lấy giá trị đầu tiên rồi complete ngay (giống Promise).
-   **take(n)**: Lấy n giá trị rồi complete.
-   **debounceTime**: Chờ người dùng ngừng gõ phím mới gửi request (Search suggesion).
-   **distinctUntilChanged**: Nếu giá trị mới giống hệt giá trị cũ thì bỏ qua.

---

## 1. Cơ bản (Basic)

### filter
**Cách hoạt động**: "Bộ lọc". Giống `Array.filter`. Chỉ cho phép những giá trị thỏa mãn điều kiện đi qua.
-   **Ví dụ Code**:
    ```javascript
    import { from } from 'rxjs';
    import { filter } from 'rxjs/operators';

    from([1, 2, 3, 4, 5]).pipe(
        filter(num => num % 2 === 0) // Chỉ lấy số chẵn
    ).subscribe(console.log);
    // Output: 2, 4
    ```

---

## 2. Cắt Lấy & Bỏ Qua (Slicing)

### take
**Cách hoạt động**: "Lấy N cái đầu". Lấy đúng N giá trị đầu tiên rồi **complete** ngay lập tức.
-   **Ứng dụng**: Lấy Snapshot data, chỉ cần sự kiện click đầu tiên.
-   **Ví dụ Code**: `take(2)` -> Lấy 1, 2 rồi nghỉ.

### takeLast
**Cách hoạt động**: "Lấy N cái cuối". Đợi đến khi stream **complete**, rồi mới nhả ra N giá trị cuối cùng.
-   **Lưu ý**: Nếu stream không bao giờ complete (VD: `interval`), `takeLast` sẽ không bao giờ chạy.

### skip
**Cách hoạt động**: "Bỏ qua N cái đầu". Bỏ qua N giá trị đầu tiên, sau đó lấy tất cả.
-   **Ví dụ Code**: `skip(2)` -> Bỏ 1, 2. Lấy 3, 4, 5...

---

## 3. Cắt theo Điều kiện (Conditional Slicing)

### takeUntil
**Cách hoạt động**: "Lấy cho đến khi...". Lấy giá trị cho đến khi một **Notifier Stream** khác phát tín hiệu. Khi Notifier phát, stream chính sẽ **complete** ngay lập tức.
-   **Ứng dụng**: **Cực kỳ quan trọng** để hủy subscription khi component bị destroy (tránh memory leak).
-   **Ví dụ Code**:
    ```javascript
    import { interval, timer } from 'rxjs';
    import { takeUntil } from 'rxjs/operators';

    const source$ = interval(1000);
    const apiTimer$ = timer(5000); // Sau 5s thì bắn

    source$.pipe(
        takeUntil(apiTimer$) // Chạy cho đến khi apiTimer bắn
    ).subscribe(console.log);
    // Output: 0, 1, 2, 3... (Dừng ở giây thứ 5)
    ```

### takeWhile
**Cách hoạt động**: "Lấy khi còn đúng". Lấy giá trị chừng nào điều kiện kiểm tra vẫn trả về `true`. Gặp `false` là dừng ngay.

### skipUntil
**Cách hoạt động**: "Bỏ qua cho đến khi...". Bỏ qua mọi giá trị lúc đầu, cho đến khi **Notifier Stream** phát tín hiệu thì mới bắt đầu lấy.
-   **Tương tự**: Giống như nút "Record" (Ghi âm). Dù ca sĩ có hát trước đó, nhưng chỉ khi bấm Record thì mới bắt đầu thu.

### skipWhile
**Cách hoạt động**: "Bỏ qua khi còn đúng". Bỏ qua các giá trị đầu miễn là điều kiện còn `true`. Gặp `false` cái là bắt đầu lấy luôn từ đó về sau (kể cả các giá trị sau đó có quay lại `true` cũng vẫn lấy).

---

## 4. Tìm kiếm (Finding)

### first
**Cách hoạt động**: "Lấy cái đầu tiên".
-   Nếu không truyền điều kiện: Lấy giá trị đầu tiên rồi complete.
-   Nếu truyền điều kiện: Lấy giá trị đầu tiên **thỏa mãn** điều kiện rồi complete.
-   **Lỗi**: Nếu stream complete mà không tìm thấy gì -> **Throw EmptyError**.

### last
**Cách hoạt động**: "Lấy cái cuối cùng".
-   Chờ stream complete, rồi lấy giá trị cuối cùng (hoặc giá trị cuối cùng thỏa mãn điều kiện).
-   **Lỗi**: Nếu không tìm thấy -> **Throw EmptyError**.

### find
**Cách hoạt động**: Giống `first` có điều kiện.
-   Khác biệt: Nếu không tìm thấy, nó phát ra `undefined` rồi complete thay vì bắn lỗi. (An toàn hơn `first`).

### single
**Cách hoạt động**: "Duy nhất một".
-   Đảm bảo stream chỉ phát ra **đúng 1 giá trị** thỏa mãn điều kiện.
-   Nếu có 2 giá trị thỏa mãn -> **Throw Error**.
-   Nếu không có giá trị nào -> **Throw Error**.

---

## 5. Sự duy nhất (Uniqueness)

### distinct
**Cách hoạt động**: "Khác biệt toàn bộ". Chỉ phát ra các giá trị **chưa từng xuất hiện** từ đầu đến giờ.
-   **Lưu ý**: Cần bộ nhớ để lưu tất cả giá trị đã qua -> Cẩn thận memory leak nếu stream chạy lâu dài với dữ liệu lớn.
-   **Ví dụ Code**: `of(1, 2, 1, 3, 1)` -> `distinct()` -> Output: `1, 2, 3`.

### distinctUntilChanged
**Cách hoạt động**: "Khác biệt liền kề". Chỉ bỏ qua nếu giá trị mới **giống hệt** giá trị ngay trước nó.
-   **Ứng dụng**: Input field (người dùng gõ 'A', xong xóa, xong gõ lại 'A' -> không cần handle lại). State management (chỉ update UI khi state thực sự đổi).
-   **Ví dụ Code**:
    ```javascript
    import { of } from 'rxjs';
    import { distinctUntilChanged } from 'rxjs/operators';

    of(1, 1, 2, 2, 2, 1, 1, 3).pipe(
        distinctUntilChanged()
    ).subscribe(console.log);
    // Output: 1 -> 2 -> 1 -> 3
    ```

### distinctUntilKeyChanged
**Cách hoạt động**: Giống `distinctUntilChanged` nhưng dùng cho Object, chỉ so sánh 1 key cụ thể.
-   **Ví dụ Code**: `distinctUntilKeyChanged('name')`.
