const { Observable, Subject } = require('rxjs');
const { share } = require('rxjs/operators');

// HOT OBSERVABLE (Multicast)
// Producer nằm BÊN NGOÀI hoặc được chia sẻ (share).
// Các subscriber nhận chung 1 giá trị (như xem Livestream).

// CÁCH 1: Dùng biến ngoại vi (Subject)
const randomID = Math.random(); // Sinh ra TRƯỚC khi subscribe
const hotSubject$ = new Observable((observer) => {
    observer.next(randomID);
});

console.log('--- Using External Variable (Poor Man Hot Observable) ---');
hotSubject$.subscribe(val => console.log(`Sub A: ${val}`));
hotSubject$.subscribe(val => console.log(`Sub B: ${val}`)); // Giống hệt A


// CÁCH 2: Dùng Subject chuẩn (Chuyên nghiệp)
console.log('\n--- Using Subject ---');
const subject$ = new Subject();

subject$.subscribe(val => console.log(`Sub C: ${val}`));
subject$.subscribe(val => console.log(`Sub D: ${val}`));

const sharedID = Math.random();
console.log(`[Producer] Emitting ${sharedID}`);
subject$.next(sharedID); // Cả 2 cùng nhận được lúc này


// CÁCH 3: Biến Cold thành Hot bằng share()
console.log('\n--- Using share() operator ---');
const cold$ = new Observable((observer) => {
    const r = Math.random();
    console.log(`[Producer] Generating ${r}`);
    observer.next(r);
}).pipe(share()); // <--- PHÉP MÀU Ở ĐÂY

cold$.subscribe(val => console.log(`Sub E: ${val}`));
cold$.subscribe(val => console.log(`Sub F: ${val}`));
// Lưu ý: share() cần setup kỹ hơn về refCount để hoạt động đúng ý trong ví dụ sync này,
// nhưng cơ bản nó biến 1 source thành multicast.
