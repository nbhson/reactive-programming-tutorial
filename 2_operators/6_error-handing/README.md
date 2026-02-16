# Error Handling & Conditional Operators High-Level Summary

Nhóm này giúp ứng dụng của bạn **TRÂU BÒ HƠN** (Resilient). Giúp xử lý khi có lỗi xảy ra (thay vì crash app) hoặc xử lý các điều kiện rẽ nhánh dòng chảy.

## Giá trị cốt lõi
Không để lỗi làm sập luồng (stream). Biến lỗi thành cơ hội để phục hồi, thử lại, hoặc thông báo nhẹ nhàng cho người dùng.

## Các Operators phổ biến
-   **catchError**: Bắt lỗi và trả về một Observable mới để thay thế. (Ví dụ: Trả về mảng rỗng [] khi API lỗi).
-   **retry(n)**: Thử lại n lần trước khi bỏ cuộc.
-   **retryWhen**: Thử lại nhưng có điều kiện (ví dụ: chờ 1s rồi mới thử lại).

---

## 1. catchError
**Cách hoạt động**: "Lưới đỡ". Khi stream gặp lỗi, thay vì chết (error), nó sẽ nhảy vào `catchError`. Tại đây bạn có thể trả về một stream mới (fallback) để luồng tiếp tục chạy, hoặc ném lỗi tiếp.
-   **Ví dụ Code**:
    ```javascript
    import { of } from 'rxjs';
    import { map, catchError } from 'rxjs/operators';

    const apiData$ = of('Data', 'Error Here').pipe(
        map(val => {
            if (val === 'Error Here') throw new Error('Boom!');
            return val;
        }),
        catchError(err => {
            console.error('Caught:', err.message);
            return of('Fallback Data'); // Trả về giá trị thay thế
        })
    );

    apiData$.subscribe(val => console.log(val));
    // Output: "Data" -> "Caught: Boom!" -> "Fallback Data" -> Complete
    ```
-   **Ứng dụng**: API lỗi thì hiển thị data từ Cache hoặc thông báo "Vui lòng thử lại", không để màn hình trắng xóa.


### So sánh: throwError vs catchError

Khác nhau hoàn toàn về vai trò: **Một thằng GÂY RA LỖI, một thằng ĐI DỌN LỖI.**

#### 1. throwError (Kẻ gây rối - Producer)
-   **Vai trò**: Là một **Creation Operator** (giống `of`, `from`).
-   **Hành động**: Tạo ra một Observable mà vừa subscribe vào là **chết ngay lập tức** (bắn ra error).
-   **Tương đương**: `throw new Error('Lỗi rồi')` trong JS thuần.
-   **Dùng khi nào?**:
    1.  Giả lập lỗi để test.
    2.  Dùng bên trong `catchError` để **ném lỗi tiếp** (Re-throw) nếu không muốn xử lý.

#### 2. catchError (Người dọn dẹp - Consumer)
-   **Vai trò**: Là một **Pipeable Operator** (nằm trong `.pipe()`).
-   **Hành động**: Đứng canh me. Nếu stream phía trên trôi chảy bình thường -> Nó đứng im. Nếu có **Error** bắn xuống -> Nó nhảy ra đỡ lấy (catch).
-   **Tương đương**: Khối `catch(err) { ... }` trong `try-catch`.
-   **Dùng khi nào?**: Khi muốn xử lý lỗi để app không bị crash (ví dụ: trả về data rỗng, log lỗi, hoặc hiển thị thông báo).

---

## 2. retry
**Cách hoạt động**: "Thử lại ngay". Khi gặp lỗi, nó sẽ tự động **resubscribe** (chạy lại từ đầu) stream gốc. 
-   **Tham số**: Số lần thử lại (count).
-   **Ví dụ Code**:
    ```javascript
    import { throwError, of } from 'rxjs';
    import { mergeMap, retry } from 'rxjs/operators';

    let count = 0;
    const unstableApi$ = of('Request').pipe(
        mergeMap(val => {
            if (count++ < 2) {
                console.log('API Failed...');
                return throwError('Network Error');
            }
            return of('Success!');
        })
    );

    unstableApi$.pipe(
        retry(2) // Thử lại tối đa 2 lần
    ).subscribe({
        next: val => console.log(val),
        error: err => console.log('Final Error:', err)
    });
    // Output:
    // API Failed... (Lần 1)
    // API Failed... (Lần 2 - retry 1)
    // "Success!"    (Lần 3 - retry 2 thành công)
    ```

---

## 3. defaultIfEmpty
**Cách hoạt động**: "Chống rỗng". Nếu stream chạy xong (complete) mà **CHƯA HỀ** phát ra bất kỳ giá trị nào, nó sẽ phát ra một giá trị mặc định.
-   **Ví dụ Code**:
    ```javascript
    import { of } from 'rxjs';
    import { defaultIfEmpty } from 'rxjs/operators';

    of().pipe( // Stream rỗng
        defaultIfEmpty('No Data Found')
    ).subscribe(console.log);
    // Output: "No Data Found"
    ```

---

## 4. throwIfEmpty
**Cách hoạt động**: "Bắt buộc có hàng". Nếu stream complete mà không có giá trị nào, nó sẽ **bắn lỗi** (Throw Error).
-   **Ví dụ Code**:
    ```javascript
    import { of } from 'rxjs';
    import { throwIfEmpty } from 'rxjs/operators';

    of().pipe(
        throwIfEmpty(() => new Error('Data is required!'))
    ).subscribe({
        error: err => console.error(err.message)
    });
    // Output: "Data is required!"
    ```

---

## 5. iif (Conditional)
**Cách hoạt động**: "Rẽ nhánh lúc subscribe". Kiểm tra điều kiện **ngay tại thời điểm subscribe** để quyết định sẽ chạy Stream A hay Stream B.
-   **Ví dụ Code**:
    ```javascript
    import { iif, of } from 'rxjs';

    let isLoggedIn = true;

    const pageContent$ = iif(
        () => isLoggedIn,
        of('Dashboard Data'), // Nếu true
        of('Login Page')      // Nếu false
    );

    pageContent$.subscribe(console.log); 
    // Output: "Dashboard Data"

    isLoggedIn = false;
    pageContent$.subscribe(console.log); 
    // Output: "Login Page"
    ```
