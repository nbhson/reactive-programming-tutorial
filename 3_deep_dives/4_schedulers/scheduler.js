const { of, asyncScheduler } = require('rxjs');
const { observeOn, tap } = require('rxjs/operators');

console.log('--- 1. START SCRIPT ---');

// 1. Synchronous Observable (Mặc định)
of('Sync Value').pipe(
    tap(val => console.log(`[Sync Stream] Processing: ${val}`))
).subscribe();

console.log('--- 2. MIDDLE SCRIPT ---');

// 2. Asynchronous Observable (dùng asyncScheduler)
// Nó sẽ đẩy việc xử lý xuống cuối hàng đợi (sau khi script chính chạy xong)
of('Async Value').pipe(
    observeOn(asyncScheduler), // <--- CHUYỂN SANG ASYNC
    tap(val => console.log(`[Async Stream] Processing: ${val}`))
).subscribe();

console.log('--- 3. END SCRIPT ---');

// KẾT QUẢ MONG ĐỢI:
// --- 1. START SCRIPT ---
// [Sync Stream] Processing: Sync Value
// --- 2. MIDDLE SCRIPT ---
// --- 3. END SCRIPT ---
// [Async Stream] Processing: Async Value  <-- Xuất hiện cuối cùng!
