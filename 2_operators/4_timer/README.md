# Timer Operators (Rate Limiting) High-Level Summary

Nhóm này chuyên dùng để **KIỂM SOÁT TỐC ĐỘ** của dòng chảy. Giúp bạn xử lý các sự kiện bắn ra quá nhanh (như gõ phím, click liên tục, scroll chuột).

## Giá trị cốt lõi
Giảm tải cho server và ứng dụng bằng cách loại bỏ bớt các giá trị không cần thiết, chỉ giữ lại những gì quan trọng nhất theo thời gian.

---

## 1. debounceTime
**Cách hoạt động**: "Chờ yên tĩnh mới làm". Chỉ phát ra giá trị nếu sau một khoảng thời gian X ms **không có giá trị nào mới** được bắn ra. Nếu có giá trị mới, đồng hồ sẽ reset và đếm lại từ đầu.
-   **Tương tự**: Thang máy. Cửa chỉ đóng và thang máy chỉ chạy khi **không còn ai bước vào** trong vòng 5 giây. Nếu có người bước vào, 5 giây đếm lại.
-   **Ứng dụng**: Search Box (gõ xong ngừng 300ms mới gọi API), Auto-save (ngừng gõ mới save).
-   **Ví dụ Code**:
    ```javascript
    import { fromEvent } from 'rxjs';
    import { debounceTime, map } from 'rxjs/operators';

    const searchBox = document.getElementById('search');

    fromEvent(searchBox, 'input').pipe(
        map(e => e.target.value),
        debounceTime(500) // Chỉ log sau khi ngừng gõ 500ms
    ).subscribe(text => {
        console.log('Searching for:', text);
    });
    ```

---

## 2. throttleTime
**Cách hoạt động**: "Phát xong nghỉ". Phát ngay giá trị đầu tiên, sau đó **phớt lờ** tất cả các giá trị tiếp theo trong khoảng thời gian X ms. Sau X ms, lại sẵn sàng phát giá trị tiếp theo.
-   **Tương tự**: Súng máy có tản nhiệt. Bắn 1 viên xong phải đợi nòng nguội (ví dụ 1s) mới bắn được viên tiếp theo. Trong lúc chờ, bóp cò vô ích.
-   **Ứng dụng**: Nút Click (chống spam click), sự kiện Scroll (chỉ cập nhật UI mỗi 100ms).
-   **Ví dụ Code**:
    ```javascript
    import { fromEvent } from 'rxjs';
    import { throttleTime } from 'rxjs/operators';

    const btn = document.getElementById('btn');

    fromEvent(btn, 'click').pipe(
        throttleTime(2000) // Click xong, 2s sau mới click được tiếp
    ).subscribe(() => {
        console.log('Clicked!'); 
        // Click liên tục 10 lần trong 2s cũng chỉ log 1 lần.
    });
    ```
    *Lưu ý: `throttleTime` mặc định `{ leading: true, trailing: false }` (lấy đầu, bỏ cuối).*

---

## 3. auditTime
**Cách hoạt động**: "Lắng nghe rồi chốt". Khi có giá trị đến, nó bắt đầu đếm giờ X ms. Trong X ms đó, nó cứ để các giá trị mới ghi đè lên giá trị cũ. Hết X ms, nó phát ra **giá trị mới nhất** (cuối cùng) mà nó đang giữ.
-   **Tương tự**: `throttleTime` nhưng lấy giá trị **cuối** thay vì giá trị đầu.
-   **Ứng dụng**: Theo dõi giá chứng khoán/tỉ giá (cập nhật giá cuối cùng sau mỗi giây), sự kiện kết thúc resize window.
-   **Ví dụ Code**:
    ```javascript
    import { fromEvent } from 'rxjs';
    import { auditTime } from 'rxjs/operators';

    fromEvent(document, 'mousemove').pipe(
        auditTime(1000)
    ).subscribe(e => {
        console.log('Position after 1s:', e.clientX, e.clientY);
        // Sau mỗi 1s, lấy tọa độ chuột MỚI NHẤT tại thời điểm đó.
    });
    ```

---

## 4. sampleTime
**Cách hoạt động**: "Lấy mẫu định kỳ". Cứ đúng chu kỳ X ms, nó sẽ kiểm tra xem có giá trị nào mới nhất không. Nếu có thì phát ra, không thì thôi. Nó **không quan tâm** khi nào giá trị đến, nó chỉ quan tâm đến chu kỳ thời gian của chính nó.
-   **Tương tự**: Camera giám sát quay quét. Cứ đúng 5s nó chụp 1 tấm ảnh gửi về trung tâm, bất kể lúc đó có trộm hay không (nếu không có thay đổi gì so với lần trước thì có thể nó không gửi, nhưng cơ chế là theo nhịp đồng hồ).
-   **Ví dụ Code**:
    ```javascript
    import { interval } from 'rxjs';
    import { sampleTime } from 'rxjs/operators';

    interval(100).pipe( // Phát liên tục mỗi 100ms
        sampleTime(1000) // Cứ mỗi 1000ms "lấy mẫu" 1 lần
    ).subscribe(val => {
        console.log('Sampled:', val); 
        // 0.1s, 0.2s... nhưng output chỉ ra ở 1s, 2s...
    });
    ```

---

## 5. delay
**Cách hoạt động**: "Trễ cả dòng". Dời toàn bộ thời điểm phát ra của các giá trị đi X ms. Thứ tự và khoảng cách giữa các giá trị giữ nguyên, chỉ là xuất hiện trễ hơn.
-   **Ví dụ Code**:
    ```javascript
    import { of } from 'rxjs';
    import { delay } from 'rxjs/operators';

    console.log('Start');
    of('Hello').pipe(
        delay(3000) // Chờ 3s mới phát
    ).subscribe(val => console.log(val));
    ```

---

## Tóm tắt So sánh

| Operator | Cơ chế | Lấy giá trị nào? | Thích hợp cho |
| :--- | :--- | :--- | :--- |
| **debounceTime** | Chờ yên tĩnh | Cuối cùng (sau khi ngừng) | Search box (Input) |
| **throttleTime** | Phát rồi nghỉ | Đầu tiên (mặc định) | Button Click (Double click prevention) |
| **auditTime** | Đếm ngược rồi chốt | Cuối cùng (trong khoảng tgian) | Window Resize, Mouse Move |
| **sampleTime** | Lấy mẫu định kỳ | Gần nhất trong chu kỳ | Monitoring, Dashboard Update |
