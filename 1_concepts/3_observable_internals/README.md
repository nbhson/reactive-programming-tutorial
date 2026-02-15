# Observable Internals

## Giá trị cốt lõi
Học cách tự xây dựng một `class Observable` từ đầu để hiểu rõ bản chất của nó: Nó chỉ là một hàm nhận vào một `observer`.

## Bạn sẽ học gì ở đây?
Trong thư mục này, chúng ta sẽ đi qua từng bước để xây dựng một Observable engine thu nhỏ:

1.  **[1_producer_consumer](./1_producer_consumer)**: Tạo ra cấu trúc Producer gửi dữ liệu cho Consumer.
2.  **[2_lazy_subscribe](./2_lazy_subscribe)**: Làm cho Observable trở nên "lười biếng" (Lazy) - chỉ chạy khi có người subscribe.
3.  **[3_lazy_unsubscribe](./3_lazy_unsubscribe)**: Thêm cơ chế hủy đăng ký (Unsubscribe) để tránh rò rỉ bộ nhớ.
4.  **[4_observer_pattern_v1](./4_observer_pattern_v1)** & **[5_observer_pattern_v2](./5_observer_pattern_v2)**: Hoàn thiện Observer safe (có next, error, complete).

## Bí mật của Observable
Observable thực chất chỉ là một function nhận vào một object có 3 callback (`next`, `error`, `complete`). Không có phép màu nào cả!
