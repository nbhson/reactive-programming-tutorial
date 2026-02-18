# State Management Pattern (Service as a Store)

## Giá trị cốt lõi
Biến một Service thành một nguồn chân lý duy nhất (Single Source of Truth) cho dữ liệu, sử dụng `BehaviorSubject`.

## Cách hoạt động
1.  **Private Subject**: Giữ giá trị hiện tại, chỉ Service mới có quyền thay đổi (`next()`).
2.  **Public Observable**: Các Component chỉ được quyền đọc (`asObservable()`), không được ghi đè.

```typescript
class Store {
  private _state = new BehaviorSubject({ user: null });
  public state$ = this._state.asObservable(); // Read-only

  updateUser(user) {
    this._state.next({ user }); // Write
  }
}
```
