# Hot vs Cold Observables

## Giá trị cốt lõi
Hiểu về **Producer location** (Nơi dữ liệu được sinh ra).

## 1. Cold Observable (Unicast)
-   **Producer được tạo bên trong Observable**.
-   Mỗi Subscriber có một luồng chạy riêng biệt.
-   Ví dụ: Xem phim trên Netflix (Bạn xem từ đầu đến cuối bất kể lúc nào bạn bắt đầu).
-   Code: `of`, `from`, `interval`, `ajax`.

```javascript
// Mỗi ông subscribe sẽ nhận được một dãy số riêng
const cold$ = new Observable(obs => {
    obs.next(Math.random()); 
});
cold$.subscribe(console.log); // 0.123
cold$.subscribe(console.log); // 0.456 (Khác nhau!)
```

## 2. Hot Observable (Multicast)
-   **Producer nằm bên ngoài Observable**.
-   Chia sẻ dữ liệu cho tất cả Subscriber.
-   Ví dụ: Xem Livestream (Bạn vào muộn thì xem đoạn giữa, không tua lại được).
-   Code: `fromEvent`, `Subject`.

```javascript
const random = Math.random();
// Producer sinh ra số ngẫu nhiên TRƯỚC khi tạo Observable
const hot$ = new Observable(obs => {
    obs.next(random);
});
hot$.subscribe(console.log); // 0.789
hot$.subscribe(console.log); // 0.789 (Giống nhau!)
```
