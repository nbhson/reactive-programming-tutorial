# Higher-Order Mapping Operators High-Level Summary

Nhóm này chuyên xử lý các **Higher-Order Observables** (Observable lồng trong Observable). Đây là nhóm quan trọng nhất để xử lý các tác vụ bất đồng bộ (API calls) dựa trên một sự kiện nào đó (User input, click).

# Higher-Order Mapping (The Difficult Part)

## Giá trị cốt lõi
Đây là phần khó nhất nhưng quan trọng nhất của RxJS: **Xử lý Stream lồng trong Stream**.
Khi bạn gọi một API từ một sự kiện (ví dụ: gõ phím -> gọi API), mỗi lần gõ phím tạo ra một Observable mới (API Call). Bạn phải quyết định làm gì với Observable bên trong đó?

## Chiến lược "Flattening" (Làm phẳng)
Bạn có 4 chiến lược chính để gộp stream con vào stream cha:

1.  **MergeMap (Song song)**:
    -   "Không quan tâm thứ tự, cứ chạy hết đi".
    -   Ví dụ: Tải nhiều ảnh cùng lúc.
    -   Nguy hiểm: Có thể gây race condition nếu thứ tự quan trọng.

2.  **ConcatMap (Tuần tự)**:
    -   "Xếp hàng". Người trước xong người sau mới được chạy.
    -   Ví dụ: Thêm item vào giỏ hàng, Save settings (cần sự toàn vẹn).

3.  **SwitchMap (Hủy bỏ cái cũ)**:
    -   "Chỉ quan tâm cái mới nhất".
    -   Nếu sự kiện mới đến khi sự kiện cũ chưa xong -> Hủy sự kiện cũ.
    -   Ví dụ: Auto-complete search. (Gõ 'A', gọi API A -> Gõ 'AB', hủy API A, gọi API AB).

4.  **ExhaustMap (Bỏ qua cái mới)**:
    -   "Đang bận, đừng làm phiền".
    -   Nếu sự kiện mới đến khi sự kiện cũ chưa xong -> Bỏ qua sự kiện mới hoàn toàn.
    -   Ví dụ: Nút Submit Form (tránh double-click), Animation.

---

## 1. switchMap
**Cách hoạt động**: "Có mới nới cũ". Khi có giá trị (sự kiện) mới đến, nó sẽ **HỦY NGAY LẬP TỨC** (unsubscribe) stream bên trong (internal/inner observable) đang chạy, và chuyển sang chạy cái mới.
-   **Chiến lược**: Latest wins (Mới nhất thắng).
-   **Ứng dụng**: Auto-complete Search. Khi user gõ từ khóa mới, hủy ngay request tìm kiếm cũ (vì kết quả cũ không còn giá trị).
-   **Ví dụ Code**:
    ```javascript
    import { fromEvent, interval } from 'rxjs';
    import { switchMap } from 'rxjs/operators';

    const clicks$ = fromEvent(document, 'click');

    clicks$.pipe(
        // Mỗi lần click, start một bộ đếm mới.
        // NHƯNG nếu click tiếp, bộ đếm cũ sẽ bị HỦY ngay lập tức.
        switchMap(() => interval(1000))
    ).subscribe(count => console.log(count));
    
    // Output:
    // Click 1: 0 -> 1 -> 2 ...
    // Click 2 (tại giây 3): (Hủy bộ đếm cũ) -> 0 -> 1 ...
    ```
- Quy trình chuẩn của switchMap:
    - Outer Observable phát ra giá trị (Ví dụ: user gõ phím 'A').
    - switchMap nhận giá trị đó, và subscribe vào Inner Observable (Ví dụ: gọi API tìm kiếm 'A').
    - Inner Observable chạy và phát ra kết quả.
    - Nếu Outer phát ra giá trị mới (gõ tiếp 'B') trong khi Inner cũ chưa xong -> Inner cũ bị hủy (unsubscribe) ngay lập tức.

---

## 2. mergeMap
**Cách hoạt động**: "Ai đến cũng tiếp". Khi có giá trị mới, nó vẫn giữ các stream cũ đang chạy bình thường và chạy thêm stream mới **SONG SONG**. Không hủy ai cả.
-   **Chiến lược**: Parallel (Song song/Đồng thời).
-   **Ứng dụng**: Xử lý các tác vụ độc lập, không liên quan nhau. Ví dụ: Chat message (gửi tin nhắn A không cần chờ tin nhắn B, không hủy tin nhắn B), Tải nhiều file cùng lúc.
-   **Lưu ý**: Cẩn thận memory leak nếu tạo ra quá nhiều stream song song mà không complete.
-   **Ví dụ Code**:
    ```javascript
    import { of } from 'rxjs';
    import { mergeMap, delay } from 'rxjs/operators';

    const source$ = of('Task 1', 'Task 2', 'Task 3');

    source$.pipe(
        mergeMap(task => of(`${task} Done`).pipe(delay(Math.random() * 1000)))
    ).subscribe(console.log);

    // Output: Thứ tự hoàn thành ngẫu nhiên (ai xong trước log trước)
    // "Task 2 Done"
    // "Task 1 Done" (Xong sau dù được gọi trước)
    // "Task 3 Done"
    ```

---

## 3. concatMap
**Cách hoạt động**: "Xếp hàng lần lượt". Khi có giá trị mới, nếu stream cũ chưa chạy xong, giá trị mới phải **XẾP HÀNG CHỜ**. Khi nào stream cũ xong (complete) thì stream mới mới được chạy.
-   **Chiến lược**: Queue/Sequential (Tuần tự).
-   **Ứng dụng**: Cập nhật dữ liệu cần thứ tự (Update A xong mới được Update B), Upload files theo thứ tự.
-   **Ví dụ Code**:
    ```javascript
    import { of } from 'rxjs';
    import { concatMap, delay } from 'rxjs/operators';

    const source$ = of('Step 1', 'Step 2', 'Step 3');

    source$.pipe(
        // Bắt buộc Step 1 xong (sau 1s) mới tới Step 2...
        concatMap(step => of(`${step} Done`).pipe(delay(1000)))
    ).subscribe(console.log);

    // Output:
    // (sau 1s) "Step 1 Done"
    // (sau 2s) "Step 2 Done"
    // (sau 3s) "Step 3 Done"
    ```

---

## 4. exhaustMap
**Cách hoạt động**: "Bận đừng làm phiền". Khi một stream đang chạy, nếu có giá trị mới đến, nó sẽ **BỎ QUA HOÀN TOÀN** giá trị mới đó. Chỉ khi nào stream hiện tại chạy xong, nó mới nhận yêu cầu mới.
-   **Chiến lược**: Ignore while busy (Phớt lờ khi bận).
-   **Ứng dụng**: Nút Submit Form / Login. Khi user bấm Login, đang gọi API thì dù user có bấm thêm 10 lần nữa cũng không gọi thêm API nào (tránh spam request).
-   **Ví dụ Code**:
    ```javascript
    import { fromEvent, interval } from 'rxjs';
    import { exhaustMap, take } from 'rxjs/operators';

    const clicks$ = fromEvent(document, 'click');

    clicks$.pipe(
        // Khi click, đếm 0->4 (mất 5s).
        // Trong 5s này, mọi click khác đều bị LƠ ĐI.
        exhaustMap(() => interval(1000).pipe(take(5)))
    ).subscribe(console.log);
    ```

---

## Tóm tắt So sánh Mapping Operators

| Operator | Chiến lược | Hành động khi có cái mới | Thích hợp cho |
| :--- | :--- | :--- | :--- |
| **switchMap** | Mới nhất thắng | Hủy cái cũ | Search, Get Data (Read) |
| **mergeMap** | Song song | Chạy thêm cái mới | Chat, Delete, Fire-and-forget |
| **concatMap** | Tuần tự | Xếp hàng chờ | Save System, Upload (Write order matters) |
| **exhaustMap** | Một mình một ngựa | Bỏ qua cái mới | Login Button, Submit Form |
