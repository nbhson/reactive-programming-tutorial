const { interval } = require('rxjs');
const { take, filter, tap, finalize } = require('rxjs/operators');

console.log('--- KHÁI NIỆM: COMPLETE NGAY LẬP TỨC ---');
console.log('Ví dụ: Bạn có vòi nước (Stream) chảy mãi mãi.');

// MÔ PHỎNG: Stream vòi nước chảy mỗi 1 giây
const source$ = interval(1000).pipe(
    tap(v => console.log(`🚰 Nước chảy: ${v}`)),
    finalize(() => console.log('🛑 KHÓA VÒI NƯỚC (Stream Complete/Unsubscribe)'))
);

// TRƯỜNG HỢP 1: Dùng filter (Lọc thôi, không khóa vòi)
// console.log('\n--- Case 1: Filter (Lọc số chẵn) ---');
// source$.pipe(
//     filter(x => x % 2 === 0)
// ).subscribe(val => console.log(`✅ Lấy được: ${val}`));
// -> Kết quả: Vòi nước chảy MÃI MÃI. Nó không bao giờ tự dừng.


// TRƯỜNG HỢP 2: Dùng take(1) (Lấy xong khóa vòi NGAY)
console.log('\n--- Case 2: Take(1) (Lấy 1 cái rồi Complete ngay) ---');
source$.pipe(
    take(1)
).subscribe({
    next: val => console.log(`✅ Lấy được: ${val}`),
    complete: () => console.log('🏁 Xong nhiệm vụ! (Complete Signal was fired)')
});

// KẾT QUẢ MONG ĐỢI:
// 1. Nước chảy: 0
// 2. Lấy được: 0
// 3. Xong nhiệm vụ!
// 4. KHÓA VÒI NƯỚC (Ngay lập tức, không chờ giây thứ 1, 2...)
