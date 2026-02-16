const { interval } = require('rxjs');

// MEMORY LEAK SIMULATION
// Kịch bản: Component được khởi tạo, subscribe vào interval vô hạn.
// Sau đó Component bị hủy, nhưng quên unsubscribe.

function simulateComponent() {
    console.log('[Component] Init');

    // Subscribe vô hạn
    const sub = interval(1000).subscribe(val => {
        console.log(`[Leak] Timer ticking: ${val}`);
        console.log(`[Leak] Memory usage is increasing...`);
    });

    // Giả lập Component bị hủy sau 3 giây
    // NHƯNG QUÊN GỌI sub.unsubscribe() !!!!!
}

simulateComponent();

console.log('[System] Component destroyed?');

// Kết quả thực tế:
// Dù hàm simulateComponent đã chạy xong, Timer vẫn chạy mãi mãi.
// Đây chính là Memory Leak.
