const { interval, Subject } = require('rxjs');
const { takeUntil } = require('rxjs/operators');

// MEMORY LEAK PREVENTION
// Kịch bản: Dùng takeUntil để tự động unsubscribe khi có tín hiệu hủy.

function simulateSafeComponent() {
    console.log('[Safe Component] Init');

    const destroy$ = new Subject(); // Tín hiệu hủy

    interval(1000).pipe(
        // "Tao chỉ lấy dữ liệu cho đến khi destroy$ phát tín hiệu"
        takeUntil(destroy$)
    ).subscribe({
        next: val => console.log(`[Safe] Timer ticking: ${val}`),
        complete: () => console.log('[Safe] Stream completed/closed automatically!')
    });

    // Giả lập Component bị hủy sau 3.5 giây
    setTimeout(() => {
        console.log('[System] Destroying component...');
        destroy$.next(); // Bắn tín hiệu hủy
        destroy$.complete();
    }, 3500);
}

simulateSafeComponent();

// Kết quả mong đợi:
// Timer chạy 0, 1, 2...
// Khi destroy$.next() được gọi -> Stream tư động complete -> Không còn log nào nữa.
