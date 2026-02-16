# Chương 3: Deep Dives (Advanced & Mechanics)

## Giá trị cốt lõi
Sau khi biết cách dùng Operators, bạn cần hiểu sâu về cơ chế hoạt động của RxJS để tránh những lỗi tiềm ẩn (Memory Leak, Race Condition) và tối ưu hiệu năng.

## Nội dung chính

1.  **[hot_vs_cold](./hot_vs_cold)**: Tại sao có Observable chia sẻ dữ liệu được, có cái lại chạy lại từ đầu mỗi khi subscribe? (Unicast vs Multicast).
2.  **[schedulers](./schedulers)**: Điều khiển thời điểm code của bạn chạy (Sync, Microtask, Macrotask, AnimationFrame).
3.  **[testing](./testing)**: Cách viết Unit Test cho code bất đồng bộ bằng Marble Diagrams.
4.  **[memory_management](./memory_management)**: Chiến lược Unsubscribe hiệu quả để tránh Memory Leak.
5.  **[playground_project](./playground_project)**: Một dự án nhỏ để chạy thử code.
