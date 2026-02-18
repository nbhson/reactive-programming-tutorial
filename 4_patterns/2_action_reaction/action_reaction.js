const { Subject, merge, of } = require('rxjs');
const { scan, startWith, map, tap } = require('rxjs/operators');

// --- 1. INTENT (Actions) ---
// Đây là nơi định nghĩa những gì người dùng CÓ THỂ làm
const userActions = {
    increment$: new Subject(),
    decrement$: new Subject(),
    reset$: new Subject()
};

// Đóng gói các input stream lại thành một luồng Action duy nhất
// Mỗi khi user kích hoạt 1 subject, luồng này sẽ bắn ra 1 object action (có type và payload)
const action$ = merge(
    userActions.increment$.pipe(map(() => ({ type: 'INCREMENT' }))),
    userActions.decrement$.pipe(map(() => ({ type: 'DECREMENT' }))),
    userActions.reset$.pipe(map(() => ({ type: 'RESET' })))
);

// --- 2. MODEL (State Management) ---
// Đây là nơi xử lý logic.
// 'scan' giống như Array.reduce nhưng cho dòng thời gian. Nó nhớ state cũ và tính state mới.
const initialState = { count: 0, lastAction: 'NONE' };

const state$ = action$.pipe(
    startWith(initialState), // Khởi tạo state đầu tiên
    scan((currentState, action) => {
        switch (action.type) {
            case 'INCREMENT':
                return { count: currentState.count + 1, lastAction: 'INCREMENT' };
            case 'DECREMENT':
                return { count: currentState.count - 1, lastAction: 'DECREMENT' };
            case 'RESET':
                return { count: 0, lastAction: 'RESET' };
            default:
                return currentState;
        }
    }, initialState)
);

// --- 3. VIEW (Render) ---
// View chỉ việc lắng nghe State thay đổi và hiển thị
state$.subscribe(state => {
    console.log(`\n--- UI UPDATE ---`);
    console.log(`Action: ${state.lastAction}`);
    console.log(`Count : ${state.count}`);
    console.log(`-----------------`);
});

// --- SIMULATION (Giả lập người dùng tương tác) ---
console.log('User clicks INCREASE...');
userActions.increment$.next();

console.log('User clicks INCREASE...');
userActions.increment$.next();

console.log('User clicks DECREASE...');
userActions.decrement$.next();

console.log('User clicks RESET...');
userActions.reset$.next();
