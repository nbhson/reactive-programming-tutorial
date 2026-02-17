const { timer, interval } = require('rxjs');
const { switchMap, tap, map, take } = require('rxjs/operators');

console.log('--- START ---');

// OUTER OBSERVABLE (Cái ở ngoài)
// Phát ra giá trị sau mỗi 2000ms (2 giây)
const outer$ = timer(0, 2000).pipe(
    take(3), // Chỉ chạy 3 lần rồi dừng (0, 1, 2)
    tap(val => console.log(`\n🔴 [Outer] Emitted: ${val}`))
);

outer$.pipe(
    switchMap(outerVal => {
        console.log(`   🔸 [switchMap] Chuyển đổi sang Inner Observable với giá trị: ${outerVal}`);

        // INNER OBSERVABLE (Cái ở trong)
        // Phát ra giá trị sau mỗi 500ms (0.5 giây)
        return interval(500).pipe(
            take(3), // Inner chỉ chạy 3 lần (0, 1, 2)
            map(innerVal => `🟢 [Inner] Value: ${innerVal} (từ Outer ${outerVal})`),
            tap({
                // Khi switchMap hủy subscription cũ, dòng này sẽ chạy
                unsubscribe: () => console.log(`   ❌ [Inner] Bị Unsubscribe (Do Outer có giá trị mới)`)
            })
        );
    })
).subscribe({
    next: val => console.log(val),
    complete: () => console.log('\n--- DONE ---')
});
