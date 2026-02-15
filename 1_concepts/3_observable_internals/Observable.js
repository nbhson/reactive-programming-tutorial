/**
 * REBUILDING RXJS OBSERVABLE FROM SCRATCH
 * 
 * Mục tiêu: Hiểu rõ bản chất của Observable.
 * Observable chẳng qua là một function nhận vào một Observer.
 */

// 1. Observer: Là một object có 3 hàm callback (next, error, complete)
// (Đây chỉ là interface, không cần code class)

// 2. Subscription: Object chứa logic để hủy đăng ký
class Subscription {
    constructor(unsubscribeFn) {
        this.unsubscribeFn = unsubscribeFn;
    }

    unsubscribe() {
        if (this.unsubscribeFn) {
            this.unsubscribeFn();
        }
    }
}

// 3. Observable: Class chính
class Observable {
    /**
     * @param {Function} subscribeFn Hàm logic sẽ chạy khi có người subscribe.
     * Hàm này nhận vào một Observer.
     */
    constructor(subscribeFn) {
        this._subscribeFn = subscribeFn;
    }

    /**
     * Hàm kích hoạt Observable.
     * @param {Object} observer Object có dạng { next, error, complete }
     * @returns {Subscription}
     */
    subscribe(observer) {
        // Đảm bảo observer có đủ 3 hàm (an toàn)
        const safeObserver = {
            next: (v) => observer.next ? observer.next(v) : null,
            error: (e) => observer.error ? observer.error(e) : null,
            complete: () => observer.complete ? observer.complete() : null
        };

        // Kích hoạt logic (Lazy execution)
        // Việc này giống như gọi hàm: subscribeFn(safeObserver)
        const unsubscribeFn = this._subscribeFn(safeObserver);

        // Trả về Subscription để người dùng có thể hủy
        return new Subscription(unsubscribeFn);
    }

    /**
     * Operator: from
     * Biến một mảng thành Observable
     */
    static from(array) {
        return new Observable((observer) => {
            array.forEach(val => observer.next(val));
            observer.complete();

            // Hàm dọn dẹp (cleanup) - synchronous array thì không cần dọn dẹp gì
            return () => console.log('Observable from array unsubscribed (no-op)');
        });
    }

    /**
     * Operator: interval
     * Bắn số tăng dần sau mỗi khoảng thời gian
     */
    static interval(ms) {
        return new Observable((observer) => {
            let i = 0;
            const intervalId = setInterval(() => {
                observer.next(i++);
            }, ms);

            // Quan trọng: Trả về logic hủy
            return () => {
                clearInterval(intervalId);
                console.log('Interval cleared!');
            };
        });
    }
}

// --- DEMO USAGE ---

console.log("--- 1. Demo Observable.from([10, 20, 30]) ---");
const number$ = Observable.from([10, 20, 30]);
number$.subscribe({
    next: (val) => console.log('Got number:', val),
    complete: () => console.log('Done number stream')
});

console.log("\n--- 2. Demo Observable.interval(1000) with Unsubscribe ---");
const efficientTimer$ = Observable.interval(1000);

const subscription = efficientTimer$.subscribe({
    next: (val) => console.log('Timer tick:', val)
});

// Hủy sau 3.5 giây
setTimeout(() => {
    console.log("Unsubscribing timer...");
    subscription.unsubscribe();
}, 3500);

// Kết quả mong đợi:
// Timer tick: 0
// Timer tick: 1
// Timer tick: 2
// Unsubscribing timer...
// Interval cleared!
// (Không còn tick nào nữa)
