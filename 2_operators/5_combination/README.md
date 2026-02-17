# Combination Operators High-Level Summary

Tiếp tục cuộc hành trình tìm hiểu về các `operators` của **RxJS** nhé. Lần này, chúng ta sẽ tìm hiểu về 1 loại `operators` rất quan trọng khi làm việc với **Angular** vì những `operators` này sẽ cho phép các bạn kết hợp nhiều `Observable` lại với nhau. Những `operators` này gọi là **Combination Operators**.

---

## 1. forkJoin
**Cách hoạt động**: "Đợi tất cả xong xuôi mới chốt đơn". Chờ *tất cả* stream con `complete`, sau đó lấy giá trị *cuối cùng* của từng stream và trả về 1 mảng kết quả duy nhất.

-   **Xử lý lỗi (Error)**: Nếu **bất kỳ** stream con nào bị lỗi, kết quả chung sẽ **lỗi ngay lập tức**. Giá trị của các stream đã chạy xong trước đó sẽ bị mất. (Cần dùng `catchError` cho từng stream con nếu muốn tránh điều này).
-   **Hoàn thành (Complete)**: Khi tất cả stream con đều `complete`.
-   **Lưu ý quan trọng**: Nếu một trong các stream con **không bao giờ complete** (ví dụ `interval`, `Subject`), `forkJoin` sẽ **treo mãi mãi** và không bao giờ trả về kết quả.

-   **Ví dụ Code**:
    ```javascript
    import { forkJoin, of, timer } from 'rxjs';
    import { delay } from 'rxjs/operators';

    // Giả lập 2 API request
    const user$ = of({ id: 1, name: 'Son' }).pipe(delay(1000)); // Mất 1s
    const setting$ = of({ theme: 'dark' }).pipe(delay(2000));   // Mất 2s

    console.log('Start forkJoin...');
    
    forkJoin([user$, setting$]).subscribe(result => {
        // Chạy xong sau 2s (thời gian của thằng chậm nhất)
        console.log(result); 
        // Output: [{ id: 1, name: 'Son' }, { theme: 'dark' }]
    });
    ```

---

## 2. combineLatest
**Cách hoạt động**: "Họp tổ dân phố". Khi *bất kỳ* stream nào có tin mới, lấy giá trị mới nhất của *tất cả* các stream rồi gộp lại.

-   **Điều kiện chạy**: Cần **tất cả** các stream con phải bắn ra **ít nhất 1 giá trị**. Nếu có 1 ông "im lặng" mãi, `combineLatest` sẽ không chạy gì cả.
-   **Xử lý lỗi**: Nếu 1 stream lỗi -> Toàn bộ lỗi ngay lập tức.
-   **Hoàn thành**: Khi tất cả các stream con đều `complete`.

-   **Ví dụ Code**:
    ```javascript
    import { combineLatest, BehaviorSubject } from 'rxjs';

    const color$ = new BehaviorSubject('Red');
    const size$ = new BehaviorSubject('M');

    combineLatest([color$, size$]).subscribe(([color, size]) => {
        console.log(`Filter: Color=${color}, Size=${size}`);
    });

    // Output ngay lập tức: "Filter: Color=Red, Size=M"

    color$.next('Blue'); 
    // Output: "Filter: Color=Blue, Size=M" (Lấy size M cũ ghép với Blue mới)

    size$.next('L');    
    // Output: "Filter: Color=Blue, Size=L"
    ```

---

## 3. zip
**Cách hoạt động**: "Ghép đôi 1-1". Ông A ra số thứ 1 thì chờ ông B ra số thứ 1 để ghép cặp. Ông A ra số thứ 2 thì chờ ông B ra số thứ 2.

-   **Lệch pha**: Nếu stream A bắn nhanh quá (ra 1, 2, 3) mà stream B chưa bắn gì, các giá trị của A sẽ được **lưu vào bộ nhớ (buffer)** để chờ B.
-   **Xử lý lỗi**: Nếu 1 stream lỗi -> Toàn bộ lỗi.
-   **Hoàn thành**: Khi **bất kỳ** stream nào `complete`, kết quả chung sẽ `complete` ngay lập tức (dừng cuộc chơi vì không còn ai để ghép cặp nữa).

-   **Ví dụ Code**:
    ```javascript
    import { zip, of } from 'rxjs';
    import { delay } from 'rxjs/operators';

    const age$ = of(27, 25, 29);
    const name$ = of('Son', 'Huy', 'Tung').pipe(delay(1000)); // Tên đến chậm 1s

    zip(age$, name$).subscribe(([age, name]) => {
        console.log(`${name} is ${age} years old`);
    });

    // Sau 1s, tất cả log ra cùng lúc vì age$ phải chờ name$:
    // "Son is 27 years old"
    // "Huy is 25 years old"
    // "Tung is 29 years old"
    ```

---

## 4. concat
**Cách hoạt động**: "Xếp hàng". Stream A chạy xong (complete) thì Stream B mới được chạy. Tuần tự tuyệt đối.

-   **Xử lý lỗi**: Nếu stream A lỗi -> Toàn bộ lỗi ngay lập tức. Stream B **không bao giờ được chạy**.
-   **Hoàn thành**: Khi stream cuối cùng trong hàng đợi `complete`.
-   **Lưu ý**: Nếu stream A không bao giờ complete (VD: `interval`), stream B sẽ chờ đến "thiên thu".

-   **Ví dụ Code**:
    ```javascript
    import { concat, of } from 'rxjs';
    import { delay } from 'rxjs/operators';

    const cache$ = of('Cache Data');
    const network$ = of('Network Data').pipe(delay(2000)); // Mất 2s

    concat(cache$, network$).subscribe(val => console.log(val));

    // Output:
    // "Cache Data" (Hiện ngay lập tức)
    // ... chờ 2s ...
    // "Network Data" (Hiện sau khi cache đã xong)
    ```

---

## 5. merge
**Cách hoạt động**: "Mở cửa tự do". Không quan tâm thứ tự, ai có dữ liệu thì đẩy ra ngay. Chạy song song.

-   **Xử lý lỗi**: Nếu 1 stream lỗi -> Toàn bộ lỗi ngay lập tức.
-   **Hoàn thành**: Khi **tất cả** các stream con đều `complete`.
-   **Đặc biệt**: Có thể giới hạn số lượng chạy song song bằng tham số `concurrent`. `merge(a$, b$, c$, 2)` -> Chỉ chạy a, b. Khi a xong mới chạy c.

-   **Ví dụ Code**:
    ```javascript
    import { merge, interval } from 'rxjs';
    import { map, take } from 'rxjs/operators';

    const fast$ = interval(1000).pipe(map(val => `Fast ${val}`), take(3));
    const slow$ = interval(2000).pipe(map(val => `Slow ${val}`), take(2));

    merge(fast$, slow$).subscribe(console.log);

    // Output xen kẽ theo thời gian thực:
    // Fast 0 (1s)
    // Low 0  (2s)
    // Fast 1 (2s)
    // Fast 2 (3s) -> Fast xong
    // Slow 1 (4s) -> Slow xong -> Complete
    ```

---

## 6. race
**Cách hoạt động**: "Đua xe". Ai ra kết quả (emit hoặc error) đầu tiên thì người đó thắng.

-   **Người thua cuộc**: Tất cả các stream còn lại sẽ bị **unsubscribe** (hủy bỏ) ngay lập tức.
-   **Xử lý lỗi**: Nếu "người nhanh nhất" bị lỗi -> Kết quả lỗi. Nếu "người chậm hơn" bị lỗi -> Không quan tâm (vì đã bị hủy).

-   **Ví dụ Code**:
    ```javascript
    import { race, interval, of } from 'rxjs';
    import { delay, map } from 'rxjs/operators';

    const apiA$ = of('CDN A (Fast)').pipe(delay(500));
    const apiB$ = of('CDN B (Slow)').pipe(delay(2000));

    race(apiA$, apiB$).subscribe(val => console.log('Winner:', val));

    // Output: "Winner: CDN A (Fast)"
    // apiB$ bị hủy (cancel) ngay lập tức, không chạy nữa.
    ```

---

## 7. withLatestFrom
**Cách hoạt động**: "Nhìn sang nhà hàng xóm". Stream chính (Outer) quyết định nhịp độ. Khi stream chính bắn, nó lấy kèm giá trị mới nhất của stream phụ.

-   **Điều kiện**: Nếu stream chính bắn rầm rầm mà stream phụ **chưa có giá trị nào**, thì stream chính sẽ bị **bỏ qua** (không emit gì cả) cho đến khi stream phụ có giá trị đầu tiên.
-   **Hoàn thành**: Khi Stream chính `complete`. (Không quan tâm stream phụ còn sống hay chết).

-   **Ví dụ Code**:
    ```javascript
    import { fromEvent, interval } from 'rxjs';
    import { withLatestFrom } from 'rxjs/operators';

    const clicks$ = fromEvent(document, 'click'); // Stream chính
    const timer$ = interval(1000);                // Stream phụ (0, 1, 2...)

    clicks$.pipe(
        withLatestFrom(timer$)
    ).subscribe(([event, time]) => {
        console.log(`Clicked at second: ${time}`);
    });

    // Nếu click nút lúc giây thứ 5:
    // Output: "Clicked at second: 4" (Lấy giá trị gần nhất của timer)
    ```

---

## 8. startWith
**Cách hoạt động**: "Đặt gạch giữ chỗ". Phát ra một giá trị đồng bộ ngay lập tức khi subscribe.

-   **Tác dụng phụ**: Nó làm thay đổi kiểu dữ liệu của dòng chảy nếu giá trị start khác kiểu với giá trị chính.
-   **Ví dụ Code**:
    ```javascript
    import { of } from 'rxjs';
    import { startWith } from 'rxjs/operators';

    of('Data Loaded').pipe(
        startWith('Loading...')
    ).subscribe(console.log);

    // Output:
    // "Loading..." (Hiện ngay lập tức)
    // "Data Loaded"
    ```

---

## 9. endWith
**Cách hoạt động**: "Lời trăng trối". Phát ra giá trị khi stream gốc `complete`.

-   **Lưu ý**: Nếu stream gốc bị lỗi (error), `endWith` sẽ **không được chạy**. (Nó chỉ chạy khi `complete` success).
-   **Ví dụ Code**:
    ```javascript
    import { of } from 'rxjs';
    import { endWith } from 'rxjs/operators';

    of('Data 1', 'Data 2').pipe(
        endWith('Goodbye')
    ).subscribe(console.log);

    // Output:
    // "Data 1"
    // "Data 2"
    // "Goodbye" (Luôn là thằng cuối cùng)
    ```

---

## 10. pairwise
**Cách hoạt động**: "So sánh với người yêu cũ". Gộp giá trị `[cũ, mới]`.

-   **Điều kiện**: Cần ít nhất **2 giá trị** được emit thì mới bắt đầu chạy. Nếu stream chỉ có 1 giá trị rồi complete -> `pairwise` không emit gì cả.
-   **Ví dụ Code**:
    ```javascript
    import { from } from 'rxjs';
    import { pairwise } from 'rxjs/operators';

    from([100, 150, 140, 200]).pipe(
        pairwise()
    ).subscribe(([prev, curr]) => {
        console.log(`Prev: ${prev} -> Curr: ${curr}`);
    });

    // Output:
    // Prev: 100 -> Curr: 150 (Tăng)
    // Prev: 150 -> Curr: 140 (Giảm)
    // Prev: 140 -> Curr: 200 (Tăng)
    ```