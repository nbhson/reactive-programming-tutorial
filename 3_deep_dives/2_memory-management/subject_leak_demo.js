const { Subject } = require('rxjs');

// 1. Service (Sống lâu, Global)
const chatService = new Subject();

// 2. Component (Sống ngắn)
function initComponent(id) {
    console.log(`[Component ${id}] Mount`);

    // Subscribe vào Service
    const sub = chatService.subscribe(msg => {
        console.log(`[Component ${id}] Nhận tin nhắn: ${msg}`);
    });

    // QUAN TRỌNG: Nếu quên dòng này -> Memory Leak
    sub.unsubscribe();
}

// --- MÔ PHỎNG ---

console.log('--- Start App ---');

// User vào trang Chat
initComponent('A');

// User chuyển trang khác (Component A bị hủy về mặt UI, nhưng code subscribe vẫn chạy ngầm)
console.log('\n--- User chuyển trang (Destroy Component A) ---');
// Ở đây chúng ta KHÔNG gọi unsubscribe() để mô phỏng lỗi.

// Service bắn tin mới
console.log('\n--- Service phát tin nhắn mới ---');
chatService.next('Hello World!');

// KẾT QUẢ:
// [Component A] Nhận tin nhắn: Hello World!
// -> Component A đã chết rồi mà vẫn "đội mồ sống dậy" xử lý tin nhắn -> LEAK!
