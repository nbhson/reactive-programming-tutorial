// 2. REACTIVE (Phản ứng)
// Tư duy: "Máy tính ơi, b LUÔN LUÔN bằng a cộng với 5."
// Đây là hành động "Declaration" (Khai báo mối quan hệ).

// Mini-RxJS implementation (để code chạy được mà không cần cài thư viện)
class Observable {
    constructor(subscribe) {
        this.subscribe = subscribe;
    }

    // Hàm biến đổi dữ liệu (Operator)
    map(transformFn) {
        return new Observable(observer => {
            return this.subscribe({
                next: (val) => observer.next(transformFn(val)),
                error: (err) => observer.error(err),
                complete: () => observer.complete()
            });
        });
    }
}

class Subject extends Observable {
    constructor() {
        super(observer => {
            this.observers.push(observer);
            return { unsubscribe: () => this.observers = this.observers.filter(o => o !== observer) };
        });
        this.observers = [];
    }

    next(value) {
        this.observers.forEach(observer => observer.next(value));
    }
}

// --- MAIN CODE ---

// 1. Khai báo nguồn dữ liệu (a$)
const a$ = new Subject();

// 2. Khai báo mối quan hệ (b$ luôn = a$ + 5)
const b$ = a$.map(x => x + 5);

// 3. Đăng ký lắng nghe (Subscribe)
console.log("[Reactive] Subscribing to b$...");
b$.subscribe({
    next: (val) => console.log(`[Reactive] b received: ${val}`)
});

// 4. Thay đổi giá trị a
console.log("[Reactive] a set to 10");
a$.next(10); // b log: 15

console.log("[Reactive] a set to 20");
a$.next(20); // b log: 25 (Tự động cập nhật!)
