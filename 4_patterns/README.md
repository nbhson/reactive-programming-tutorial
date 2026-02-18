# Chương 4: Architectural Patterns

## Giá trị cốt lõi
Học cách ghép nối các Operators lại thành một kiến trúc ứng dụng hoàn chỉnh. Không chỉ là xử lý sự kiện đơn lẻ, mà là quản lý toàn bộ Flow của ứng dụng.

## Các Patterns phổ biến

1.  **[state_management](./state_management)**: Quản lý trạng thái ứng dụng (State Store) giống như Redux nhưng chỉ dùng RxJS. (Service as a Store pattern).
2.  **[action_reaction](./action_reaction)**: Mô hình Intent-Model-View. Người dùng gửi Action -> Model phản ứng lại -> View cập nhật.
3.  **[polling](./polling)**: Kỹ thuật gọi API định kỳ thông minh (có thể pause/resume hoặc thay đổi tần suất).
