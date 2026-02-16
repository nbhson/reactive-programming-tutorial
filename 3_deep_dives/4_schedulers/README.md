# Schedulers

## Giá trị cốt lõi
Kiểm soát **khi nào** (Context) một sự kiện được thực thi.

## Các loại Scheduler
1.  **null (Synchronous)**: Mặc định. Chạy ngay lập tức và đồng bộ. (Giống `for` loop).
2.  **asapScheduler (Microtask)**: Chạy sau khi code đồng bộ hiện tại xong, nhưng trước khi render UI. (Giống `Promise.resolve()`).
3.  **asyncScheduler (Macrotask)**: Chạy ở event loop tiếp theo. (Giống `setTimeout(fn, 0)`).
4.  **queueScheduler**: Dùng cho đệ quy sâu để tránh Stack Overflow.
5.  **animationFrameScheduler**: Chạy trước khi trình duyệt vẽ lại (repaint). Dùng cho Animation mượt mà.

## Khi nào cần dùng?
Hầu hết thời gian bạn không cần quan tâm. RxJS tự chọn cái tốt nhất cho bạn. Bạn chỉ cần can thiệp khi muốn test hoặc optimize animation.
