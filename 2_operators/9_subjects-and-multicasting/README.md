# Multicasting & Subjects High-Level Summary

Nhóm này giúp bạn **CHIA SẺ** dữ liệu. Biến một dòng chảy "độc quyền" (Unicast) thành "công cộng" (Multicast) để nhiều người cùng lắng nghe và nhận được cùng một giá trị tại cùng một thời điểm.

## Giá trị cốt lõi
Chia sẻ một nguồn phát (execution) cho nhiều người nghe. Biến **Cold Observable** (mỗi người 1 luồng riêng) thành **Hot Observable** (chung 1 luồng).

## Khi nào cần?
-   Khi bạn gọi API 1 lần nhưng muốn hiển thị kết quả ở 2 nơi trên màn hình.
-   Khi bạn muốn chia sẻ trạng thái (State Management).

## Các Operators/Classes phổ biến
-   **Subject**: Vừa là Observable, vừa là Observer. Bạn có thể `next()` giá trị vào nó thủ công.
-   **BehaviorSubject**: Giống Subject nhưng **luôn lưu trữ giá trị hiện tại**. Người đến sau vẫn nhận được giá trị mới nhất. (Cực kỳ quan trọng trong State Management).
-   **shareReplay(1)**: Operator giúp cache kết quả API để không phải gọi lại.


---

## 1. Subject (Cơ bản)
**Cách hoạt động**: "Cái loa phường". Nó vừa là **Observable** (để người dân lắng nghe) vừa là **Observer** (để ban quản lý phát tin).
-   **Đặc điểm**:
    -   Không có giá trị khởi tạo.
    -   Người nghe (Subscriber) đến sau thì **mất** tin tức trước đó. Chỉ nghe được từ lúc bắt đầu subscribe.
-   **Ứng dụng**: Event Bus (Truyền sự kiện click, toast notification) nơi mà dữ liệu quá khứ không quan trọng.
-   **Ví dụ Code**:
    ```javascript
    import { Subject } from 'rxjs';

    const speaker$ = new Subject();

    speaker$.subscribe(val => console.log('A nghe:', val));

    speaker$.next('Tin 1'); // A nghe: Tin 1

    speaker$.subscribe(val => console.log('B nghe:', val));

    speaker$.next('Tin 2'); 
    // A nghe: Tin 2
    // B nghe: Tin 2 (B không nghe được Tin 1)
    ```

---

## 2. BehaviorSubject (Quan trọng nhất)
**Cách hoạt động**: "Bảng tin tổ dân phố". Luôn luôn lưu giữ **1 GIÁ TRỊ MỚI NHẤT**. Bất cứ ai tham gia (subscribe) đều sẽ nhận được ngay lập tức giá trị hiện tại trên bảng tin, sau đó mới nhận tiếp các tin mới.
-   **Đặc điểm**:
    -   **Bắt buộc** có giá trị khởi tạo.
    -   Người đến sau luôn nhận được giá trị mới nhất ngay lập tức.
-   **Ứng dụng**: **State Management** (Lưu User hiện tại, Theme setting, Language). Bất cứ component nào subscribe cũng biết ngay User là ai.
-   **Ví dụ Code**:
    ```javascript
    import { BehaviorSubject } from 'rxjs';

    const user$ = new BehaviorSubject('Guest'); // Khởi tạo là Guest

    user$.subscribe(val => console.log('Component A:', val));
    // Output: Component A: Guest

    user$.next('Admin');
    // Output: Component A: Admin

    user$.subscribe(val => console.log('Component B:', val));
    // Output: Component B: Admin (Nhận được ngay giá trị mới nhất)
    ```

---

## 3. ReplaySubject
**Cách hoạt động**: "Máy ghi âm". Lưu lại **N** giá trị gần nhất. Người đến sau sẽ được nghe lại toàn bộ N giá trị đó.
-   **Đặc điểm**: Không cần giá trị khởi tạo, nhưng cần cấu hình bộ nhớ đệm (buffer size).
-   **Ứng dụng**: History log, Chat message (vào phòng chat thấy được 5 tin nhắn gần nhất).
-   **Ví dụ Code**:
    ```javascript
    import { ReplaySubject } from 'rxjs';

    const history$ = new ReplaySubject(2); // Nhớ 2 cái gần nhất

    history$.next('Phim 1');
    history$.next('Phim 2');
    history$.next('Phim 3');

    history$.subscribe(val => console.log('User xem:', val));
    // Output: User xem: Phim 2 -> Phim 3 (Phim 1 bị quên do buffer=2)
    ```

---

## 4. AsyncSubject
**Cách hoạt động**: "Di chúc". Chỉ phát ra giá trị **CUỐI CÙNG** và chỉ khi nào stream **COMPLETE** thì mới phát.
-   **Đặc điểm**: Giống `Promise`. Nếu stream chưa complete, subscriber chưa nhận được gì cả.
-   **Ứng dụng**: Đợi tính toán xong xuôi mới lấy kết quả (HTTP Request).
-   **Ví dụ Code**:
    ```javascript
    import { AsyncSubject } from 'rxjs';

    const task$ = new AsyncSubject();

    task$.next('Đang làm...');
    task$.next('Sắp xong...');
    task$.next('Hoàn thành!');
    task$.complete(); // Bắt buộc phải complete

    task$.subscribe(console.log);
    // Output: "Hoàn thành!" (Chỉ nhận cái cuối)
    ```

---

## 5. Operators: share / shareReplay
**Cách hoạt động**: "Dùng chung nguồn". Biến một Observable thông thường (Unicast - mỗi người 1 nguồn) thành Multicast (dùng chung 1 nguồn).
-   **share()**: Giống như gắn vào một `Subject`. Nếu không còn ai subscribe, nó sẽ hủy nguồn gốc. Khi có người mới subscribe, nó tạo lại nguồn.
-   **shareReplay(n)**: Giống như gắn vào một `ReplaySubject(n)`. Nó cache lại kết quả. Kể cả khi người cuối cùng unsubscribe, nó vẫn có thể giữ kết quả (tùy config) để phục vụ người sau.
-   **Ứng dụng**: **Cache API Response**.
-   **Ví dụ Code**:
    ```javascript
    import { ajax } from 'rxjs/ajax';
    import { shareReplay } from 'rxjs/operators';

    // Chỉ gọi API 1 lần duy nhất, dù có 100 component subscribe
    const users$ = ajax.getJSON('/api/users').pipe(
        shareReplay(1) 
    );

    users$.subscribe(); // Component A
    users$.subscribe(); // Component B (Lấy lại kết quả đã cache, KHÔNG gọi API mới)
    ```

---

## Phân biệt: Unsubscribe vs Complete

Rất nhiều bạn bị nhầm lẫn giữa việc hủy đăng ký (subscription) và hủy bản thân cái Subject.

### 1. Unsubscribe Subscription (`sub.unsubscribe()`)
-   **Ý nghĩa**: "Tôi (Component) không muốn nghe nữa, gạch tên tôi ra khỏi danh sách."
-   **Kết quả**: Subject **VẪN SỐNG**, vẫn hoạt động bình thường cho các subscribers khác.
-   **Dùng khi**: Component bị hủy (Destroy). Đây là việc **BẮT BUỘC** phải làm để tránh Memory Leak.

### 2. Complete Subject (`subject.complete()`)
-   **Ý nghĩa**: "Giải tán đám đông! Cái loa phường này đóng cửa vĩnh viễn."
-   **Kết quả**: Subject **DỪNG HOẠT ĐỘNG**. Tất cả mọi người đang nghe sẽ nhận được sự kiện `complete` và tự động unsubscribe. Không ai subscribe được nữa.
-   **Dùng khi**: Luồng dữ liệu thực sự kết thúc (ví dụ: Service bị hủy, hoặc công việc đã xong).

### 3. Unsubscribe Subject (`subject.unsubscribe()`)
-   **Ý nghĩa**: "Đập nát cái loa phường."
-   **Kết quả**: Subject bị lỗi nếu ai đó cố tình dùng tiếp (`ObjectUnsubscribedError`).
-   **Lưu ý**: Rất ít khi dùng cái này thủ công, thường chỉ `complete()` là đủ.
