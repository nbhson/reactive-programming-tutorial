# Chương 1: Tư duy Reactive (Foundations)

Chào mừng bạn đến với chương đầu tiên. Trước khi viết bất kỳ dòng code RxJS nào, chúng ta cần thay đổi **cách tư duy** (Mindset).

Reactive Programming không chỉ là một thư viện, đó là một mô hình lập trình tập trung vào việc xử lý các luồng dữ liệu bất đồng bộ.

## Nội dung chính

1.  **[0_imperative_vs_reactive](./0_imperative_vs_reactive)**: Sự khác biệt cốt lõi giữa lập trình mệnh lệnh (Imperative) và phản ứng (Reactive). Tại sao `b = a + 1` lại khác với `b$ = a$.map(x => x + 1)`.
2.  **[1_sync_vs_async](./1_sync_vs_async)**: Tại sao chúng ta cần một mô hình mới để xử lý bất đồng bộ? Callback -> Promise -> Stream.
3.  **[2_pull_vs_push](./2_pull_vs_push)**: Hiểu về cơ chế Push (Đẩy) và Pull (Kéo). Đây là nền tảng của Observer Pattern.
4.  **[3_observable_internals](./3_observable_internals)**: Tự xây dựng một Observable đơn giản từ đầu để hiểu "bên dưới nắp capo" nó hoạt động như thế nào.

## Mục tiêu
Sau chương này, bạn sẽ hiểu được **tại sao** chúng ta cần RxJS và **cơ chế hoạt động** của nó, thay vì chỉ biết cách sử dụng API.
