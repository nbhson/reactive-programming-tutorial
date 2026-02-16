const { Observable } = require('rxjs');

// COLD OBSERVABLE
// Producer được tạo ra BÊN TRONG hàm subscribe.
// Mỗi lần subscribe = Một lần chạy lại từ đầu (như xem phim trên Netflix).

const cold$ = new Observable((observer) => {
    const randomID = Math.random();
    console.log(`[Producer] Doing hard work to generate ID: ${randomID}`);
    observer.next(randomID);
});

console.log('--- 1st Subscriber ---');
cold$.subscribe(val => console.log(`Subscriber A received: ${val}`));

console.log('\n--- 2nd Subscriber ---');
cold$.subscribe(val => console.log(`Subscriber B received: ${val}`));

// KẾT QUẢ MONG ĐỢI:
// [Producer] ... ID: 0.123
// Subscriber A: 0.123
// [Producer] ... ID: 0.789 (Chạy lại! ID khác!)
// Subscriber B: 0.789
