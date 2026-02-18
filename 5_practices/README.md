# RxJS Real-world Practices & Techniques

Danh sách các kỹ thuật RxJS thực tế, được phân loại và trỏ nguồn về **[angular.love](https://angular.love/)** - một trong những blog chất lượng nhất về Angular & RxJS.

## 🏆 Top 10 Kỹ thuật "Phải biết" (Must Known)

1.  **[Auto-Unsubscribe (Memory Leak Protection)](https://angular.love/?s=unsubscribe)**: Sử dụng pattern `takeUntil(destroy$)` hoặc `Async Pipe` để tự động hủy subscribe khi component bị hủy.
2.  **[Type-ahead Search (Autocomplete)](https://angular.love/?s=typeahead)**: Kết hợp `debounceTime`, `distinctUntilChanged`, và `switchMap` để tạo ô tìm kiếm thông minh, tránh spam server.
3.  **[API Caching (Chia sẻ kết quả)](https://angular.love/?s=caching+rxjs)**: Sử dụng `shareReplay(1)` để cache kết quả API, giúp nhiều component cùng subscribe nhưng chỉ gọi API 1 lần.
4.  **[Race Condition Handling](https://angular.love/?s=switchMap)**: Sử dụng `switchMap` để hủy các request cũ khi request mới được gửi đi (ví dụ: chuyển tab nhanh, filter nhanh).
5.  **[Error Handling & Recovery](https://angular.love/?s=catchError)**: Sử dụng `catchError` để bắt lỗi và `EMPTY` hoặc `of(defaultValue)` để giữ cho stream không bị chết (crash).
6.  **[Loading Spinner State](https://angular.love/?s=loading+spinner+rxjs)**: Sử dụng `finalize()` để tắt loading spinner bất kể request thành công hay thất bại.
7.  **[Polling (Lấy dữ liệu định kỳ)](https://angular.love/the-simple-way-to-reload-data-using-rxjs)**: Sử dụng `timer` kết hợp `switchMap` để gọi API định kỳ (ví dụ: cập nhật trạng thái đơn hàng).
8.  **[Form Value Changes](https://angular.love/?s=form+value+changes)**: Sử dụng `combineLatest` để lắng nghe thay đổi của nhiều field trong form cùng lúc.
9.  **[Prevent Double Clicks](https://angular.love/?s=prevent+double+click)**: Sử dụng `exhaustMap` cho nút Submit để chặn người dùng click nhiều lần khi request chưa xong.
10. **[Global State Management](https://angular.love/?s=state+management+rxjs)**: Sử dụng `BehaviorSubject` như một Store đơn giản (mini-Redux) để chia sẻ dữ liệu giữa các component.

---

## 🛠 Nhóm I: Xử lý User Interface & DOM Events

11. **[Drag and Drop](https://angular.love/?s=drag+and+drop)**: Kết hợp `mousedown`, `mousemove`, `mouseup` với `takeUntil` và `switchMap`.
12. **[Double Click Detection](https://angular.love/?s=double+click+rxjs)**: Sử dụng `buffer`, `throttleTime` và `filter` để phát hiện sự kiện double click.
13. **[Window Resize Optimization](https://angular.love/?s=window+resize+rxjs)**: Dùng `throttleTime` để giảm số lần tính toán lại layout khi user thay đổi kích thước cửa hàng.
14. **[Infinite Scroll](https://angular.love/?s=infinite+scroll)**: Lắng nghe sự kiện scroll, dùng `throttleTime`, tính toán vị trí, và gọi `concatMap` để tải thêm dữ liệu.
15. **[Mouse Hover Intent](https://angular.love/?s=hover+intent)**: Dùng `delay` hoặc `debounce` để xác định user thực sự muốn hover hay chỉ lướt qua.
16. **[Keyboard Shortcuts](https://angular.love/?s=keyboard+shortcuts)**: Lắng nghe `document keyup`, dùng `filter` để bắt tổ hợp phím cụ thể.
17. **[Click Outside](https://angular.love/?s=click+outside)**: Lắng nghe click toàn document (`fromEvent(document, 'click')`), lọc xem click đó có nằm trong element hay không.

## 📡 Nhóm II: Xử lý HTTP & Network Patterns

18. **[Exponential Backoff Retry](https://angular.love/?s=exponential+backoff)**: Khi API lỗi, thử lại sau 1s, 2s, 4s, 8s... (`retryWhen` + `timer`).
19. **[Sequential Request Dependency](https://angular.love/?s=concatMap)**: Gọi API A, lấy kết quả gọi API B (`concatMap` hoặc `switchMap`).
20. **[Parallel Requests (ForkJoin)](https://angular.love/?s=forkJoin)**: Gọi song song 3 API, đợi cả 3 xong mới render (`forkJoin`).
21. **[Cancel Request on Navigation](https://angular.love/?s=cancel+request)**: Hủy request đang chạy khi user chuyển trang (Router guards + `takeUntil`).
22. **[Offline Support](https://angular.love/?s=offline+support)**: Dùng `online`/`offline` event kết hợp với `retryWhen` để tự động gửi lại request khi có mạng.
23. **[Progress Bar Upload](https://angular.love/?s=upload+progress)**: Lắng nghe sự kiện `upload progress` từ HTTP, map ra % để hiển thị thanh tiến trình.
24. **[Long Polling với điều kiện](https://angular.love/the-simple-way-to-reload-data-using-rxjs)**: Chỉ polling khi tab đang active (dùng `fromEvent(document, 'visibilitychange')`).

## ⚙️ Nhóm III: Logic xử lý Dữ liệu & State

25. **[Store + Action Pattern](https://angular.love/?s=state+management)**: Mô phỏng Redux với `Subject` (Action) và `scan` (Reducer).
26. **[Undo/Redo](https://angular.love/?s=undo+redo)**: Lưu lịch sử thay đổi vào mảng với `scan`, cho phép quay lui trạng thái.
27. **[Filter List Client-side](https://angular.love/?s=filter+list)**: Combine `searchTerm$` và `listData$` bằng `combineLatest` để lọc danh sách real-time.
28. **[Auto-Save](https://angular.love/?s=auto+save)**: Dùng `debounceTime` sau khi user nhập liệu để tự động lưu nháp.
29. **[Countdown Timer](https://angular.love/?s=countdown+timer)**: Dùng `timer`, `map` và `takeWhile` để làm đồng hồ đếm ngược.
30. **[Stopwatch](https://angular.love/?s=stopwatch)**: Dùng `interval` để làm đồng hồ bấm giờ.

## 🧪 Nhóm IV: Advanced & Performance

31. **[Lazy Loading Observable](https://angular.love/?s=lazy+loading+rxjs)**: Dùng `defer` để trì hoãn việc tạo Promise/Observable cho đến khi subscribe.
32. **[Custom Operators](https://angular.love/?s=custom+operators)**: Viết operator riêng để tái sử dụng logic (ví dụ: `debug()`, `poll()`).
33. **[Batch Processing](https://angular.love/?s=batch+processing)**: Dùng `bufferTime` hoặc `bufferCount` để gom nhóm dữ liệu (ví dụ: gom 10 log rồi mới gửi về server).
34. **[Pause/Resume Stream](https://angular.love/?s=pause+resume+stream)**: Dùng `windowToggle` hoặc `filter` với một biến flag để tạm dừng xử lý stream.
35. **[Prioritize Streams](https://angular.love/?s=priority+stream)**: Xử lý stream quan trọng trước, stream ít quan trọng sau.
36. **[Web Socket Multiplexing](https://angular.love/?s=websocket)**: Chia một kết nối Socket thành nhiều stream nhỏ (`multiplex`).
37. **[Video Buffering Logic](https://angular.love/?s=buffering)**: Dùng `buffer` để tải trước các chunk video.

## 🧩 Nhóm V: Các bài tập thực hành trong Repo này

38. **[Auto Reload Data](./1_auto_reload_data)** *(Ref: [angular.love](https://angular.love/the-simple-way-to-reload-data-using-rxjs))*: Tự động tải lại dữ liệu sau X giây, có nút Refresh thủ công.
39. **[Type-ahead Search](./2_type_ahead_search)** *(Ref: [angular.love](https://angular.love/?s=typeahead))*: Tìm kiếm thông minh với Debounce và SwitchMap.
40. **[Global State](./3_global_state)** *(Ref: [angular.love](https://angular.love/?s=state+management))*: Quản lý User login/logout với BehaviorSubject.
41. **[Drag & Drop](./4_drag_drop)** *(Ref: [angular.love](https://angular.love/?s=drag+drop))*: Kéo thả phần tử bằng RxJS thuần.
42. **[Exponential Retry](./5_exponential_retry)** *(Ref: [angular.love](https://angular.love/?s=retry))* : Thử lại thông minh khi API lỗi.
43. **[Cache Request](./6_cache_request)** *(Ref: [angular.love](https://angular.love/?s=caching))*: Lưu kết quả API để tránh gọi nhiều lần.
44. **[Stopwatch](./7_stopwatch)** *(Ref: [angular.love](https://angular.love/?s=stopwatch))*: Đồng hồ bấm giờ Reactive.
45. **[Click Outside](./8_click_outside)** *(Ref: [angular.love](https://angular.love/?s=click+outside))*: Dropdown menu tự đóng khi click ra ngoài.
46. **[Form Auto-save](./9_form_auto_save)** *(Ref: [angular.love](https://angular.love/?s=auto+save))*: Tự động lưu form nháp.
47. **[Infinite Scroll](./10_infinite_scroll)** *(Ref: [angular.love](https://angular.love/?s=infinite+scroll))*: Tải thêm dữ liệu khi cuộn trang.
48. **[File Upload Progress](./11_upload_progress)** *(Ref: [angular.love](https://angular.love/?s=upload+progress))*: Hiển thị % upload.
49. **[Chat Polling](./12_chat_polling)** *(Ref: [angular.love](https://angular.love/?s=polling))*: Ứng dụng chat đơn giản với Polling.
50. **[Undo/Redo Logic](./13_undo_redo)** *(Ref: [angular.love](https://angular.love/?s=undo+redo))*: Hoàn tác hành động với RxJS.

---
*Danh sách các bài tập (Nhóm V) là các thư mục sẽ được triển khai trong repository này.*
