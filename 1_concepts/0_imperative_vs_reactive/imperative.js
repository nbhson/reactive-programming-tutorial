// 1. IMPERATIVE (Mệnh lệnh)
// Tư duy: "Máy tính ơi, hãy lấy giá trị hiện tại của a, cộng với 5, rồi gán vào b."
// Đây là hành động "Dymanic Assignment" một lần duy nhất.

let a = 10;
let b = a + 5;

console.log(`[Imperative] Initial: a = ${a}, b = ${b}`); // b = 15

// Thay đổi a
a = 20;
console.log(`[Imperative] After changing a: a = ${a}, b = ${b}`); // b vẫn là 15!
console.log("--> 'b' does NOT react to 'a'. We have to manually update 'b'.");

// Muốn b cập nhật? Phải viết lại lệnh gán.
b = a + 5;
console.log(`[Imperative] After manual update: b = ${b}`); // b = 25
