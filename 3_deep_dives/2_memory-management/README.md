# Memory Management

## Giá trị cốt lõi
Tránh Memory Leak (rò rỉ bộ nhớ) - sát thủ thầm lặng của ứng dụng web.

## Khi nào cần Unsubscribe?
Khi bạn subscribe vào một stream **vô hạn** (như `interval`, `fromEvent`, `Subject`). Nếu component bị hủy mà subscription vẫn còn, nó sẽ tiếp tục chạy ngầm -> Tốn RAM và gây lỗi logic.

## Chiến lược Unsubscribe
1.  **Thủ công**: Lưu `subscription` vào biến rồi gọi `sub.unsubscribe()` trong `ngOnDestroy` (Angular) hoặc `useEffect cleanup` (React). -> Dễ quên!
2.  **`take(1)` / `first()`**: Tự động unsubscribe sau khi nhận 1 giá trị. (Dùng cho HTTP request).
3.  **`takeUntil(destroy$)`**: (Best Practice). Tự động unsubscribe khi một stream khác (destroy$) phát tín hiệu.
4.  **Async Pipe**: (Angular only). Để framework tự lo liệu.
