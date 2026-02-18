const { timer, of, throwError, Subject, merge } = require('rxjs');
const { switchMap, tap, map, catchError, retry, takeUntil, repeat, filter, share } = require('rxjs/operators');

// --- 1. SETUP: MOCK API ---
let callCount = 0;
const mockApiCall = () => {
    return of(null).pipe(
        switchMap(() => {
            callCount++;
            const random = Math.random();
            // Giả lập API lỗi 30%
            if (random < 0.3) {
                return throwError(() => `API Error Attempt #${callCount}`);
            }
            return of(`Data #${callCount} - Price: ${(Math.random() * 100).toFixed(2)}$`).pipe(
                // Giả lập delay mạng ngẫu nhiên từ 100ms - 500ms
                // Để test khả năng handling race condition
                tap(() => new Promise(r => setTimeout(r, Math.random() * 400 + 100)))
            );
        })
    );
};

// --- 2. CONTROL SIGNALS (Start/Stop) ---
const startPolling$ = new Subject();
const stopPolling$ = new Subject();

// --- 3. SMART POLLING LOGIC ---
const polling$ = startPolling$.pipe(
    switchMap(() => {
        console.log('🟢 --- POLLING STARTED ---');
        
        // Dùng timer(0, 2000) để polling mỗi 2 giây
        return timer(0, 2000).pipe(
            tap(i => console.log(`\n[Tick #${i}] Calling API...`)),
            
            // Gọi API
            switchMap(() => mockApiCall().pipe(
                // Xử lý lỗi cục bộ để không làm chết timer
                catchError(err => {
                    console.error(`   🔴 ${err} -> Retrying...`);
                    // Trả về EMPTY để bỏ qua lỗi này và đợi tick tiếp theo của timer? 
                    // KHÔNG, timer sẽ chết nếu inner observer error.
                    // Cách tốt hơn: Handle error và return value safe.
                    return of('Error handled, waiting for next tick...');
                })
            )),

            // Dừng polling khi nhận tín hiệu stop
            takeUntil(stopPolling$)
        );
    })
);

// --- 4. SUBSCRIBE ---
const sub = polling$.subscribe({
    next: val => console.log(`   ✅ Received: ${val}`),
    complete: () => console.log('⚪ Polling Stopped/Completed'),
    error: err => console.log('⚫ Stream Died:', err)
});

// --- 5. SIMULATION ---
// Start ngay lập tức
startPolling$.next();

// Sau 7 giây thì Stop
setTimeout(() => {
    console.log('\n🔴 --- USER CLICKS STOP ---');
    stopPolling$.next();
}, 7000);

// Sau 9 giây thì Start lại (Resume)
setTimeout(() => {
    console.log('\n🟢 --- USER CLICKS START AGAIN ---');
    startPolling$.next();
}, 9000);

// Sau 15 giây thì dừng hẳn chương trình
setTimeout(() => {
    console.log('\n🏁 --- APP EXIT ---');
    sub.unsubscribe(); // Cleanup
}, 15000);
