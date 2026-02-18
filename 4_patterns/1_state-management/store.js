const { BehaviorSubject } = require('rxjs');
const { distinctUntilChanged, map } = require('rxjs/operators');

// STATE MANAGEMENT PATTERN (Service as a Store)
// Mục tiêu: Tạo ra nguồn chân lý duy nhất (Single Source of Truth).
// Chỉ Store mới được quyền sửa dữ liệu set().
// Các nơi khác chỉ được quyền đọc select().

class UserStore {
    constructor() {
        // 1. Private State (Chứa giá trị hiện tại)
        // Dùng BehaviorSubject để luôn có giá trị khởi tạo.
        this._state = new BehaviorSubject({
            name: 'Guest',
            isAuthenticated: false,
            score: 0
        });

        // 2. Public State (Chỉ đọc)
        // Ẩn đi phương thức next() để bên ngoài không can thiệp bừa bãi.
        this.state$ = this._state.asObservable();
    }

    // --- ACTIONS (Write) ---

    login(username) {
        // Lấy state cũ
        const currentState = this._state.getValue();
        // Cập nhật state mới (Immutability - giống Redux)
        this._state.next({
            ...currentState,
            name: username,
            isAuthenticated: true
        });
        console.log(`[Store] Action: Login (${username})`);
    }

    addScore(points) {
        const currentState = this._state.getValue();
        this._state.next({
            ...currentState,
            score: currentState.score + points
        });
        console.log(`[Store] Action: Add Score (${points})`);
    }

    logout() {
        this._state.next({
            name: 'Guest',
            isAuthenticated: false,
            score: 0
        });
        console.log(`[Store] Action: Logout`);
    }

    // --- SELECTORS (Read) ---

    // Chỉ lấy một phần dữ liệu và chỉ báo khi dữ liệu đó thay đổi
    selectName() {
        return this.state$.pipe(
            map(state => state.name),
            distinctUntilChanged()
        );
    }

    selectScore() {
        return this.state$.pipe(
            map(state => state.score),
            distinctUntilChanged()
        );
    }
}

// --- DEMO APP ---

const store = new UserStore();

// Component A: Hiển thị tên (Header)
console.log('--- Component A Subscribe ---');
store.selectName().subscribe(name => {
    console.log(`[Header] Current User: ${name}`);
});

// Component B: Hiển thị điểm (Scoreboard)
console.log('--- Component B Subscribe ---');
store.selectScore().subscribe(score => {
    console.log(`[Scoreboard] Current Score: ${score}`);
});

// User tương tác
console.log('\n--- User Interactions ---');
store.login('SonNguyen'); // Header cập nhật
store.addScore(10);       // Scoreboard cập nhật
store.addScore(20);       // Scoreboard cập nhật (Total 30)
store.login('SonNguyen'); // KHÔNG CÓ GÌ XẢY RA (Vì distinctUntilChanged chặn lại do tên không đổi)
store.logout();           // Cả 2 cập nhật về mặc định
