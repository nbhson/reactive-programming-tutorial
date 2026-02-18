# Cách đơn giản để reload dữ liệu sử dụng RxJS

## Cách đơn giản để reload dữ liệu sử dụng RxJS

Hầu hết thời gian, chúng ta phải tải dữ liệu từ server. Để thực hiện hành động này, client thường gửi các request cùng với dữ liệu được định nghĩa trước. Dữ liệu như vậy thường lấy từ route, browser storage, hoặc từ các thuộc tính trong trường hợp nó là một component. Để tải chi tiết người dùng chúng ta cần có userId, để tải chi tiết thẻ chúng ta cần có cardId, v.v. Nhưng điều gì sẽ xảy ra nếu bạn đã tải dữ liệu rồi và bạn chỉ cần reload lại mà không cần truyền lại cùng một dữ liệu định nghĩa trước đó hết lần này đến lần khác. Nghe có vẻ là một nhiệm vụ tầm thường, phải không?

Điều đó còn tùy thuộc vào: 
- Nếu chúng ta muốn giữ tính reactive (phản ứng).
- Nếu chúng ta không muốn tạo các biến mới mà trách nhiệm của chúng là giữ dữ liệu định nghĩa trước.
- Nếu chúng ta muốn làm việc với code có thể tái sử dụng (reusable code).
- Nếu code cần phải đơn giản.

> Tôi nhận thấy rằng mọi dự án mà tôi từng làm việc đều có hai hoặc nhiều giải pháp khác biệt. Nhiệm vụ của chúng ta sẽ là phát triển pattern reload dữ liệu sử dụng thư viện RxJS và làm nó thật tốt.

## Code ban đầu chưa có tính năng reload

```ts
import { Observable, of, ReplaySubject } from 'rxjs';
import { switchMap } from 'rxjs/operators';

function Identity<T>(value: T): T {
  return value;
}

interface User {
  id: number;
  name: string;
}

class UserMockWebService {
  readonly users: User[] = [
    { id: 1, name: 'John' },
    { id: 2, name: 'Liza' },
    { id: 3, name: 'Suzy' }
  ];

  getUserById(id: number): Observable<User> {
    const user = this.users.find((user: User) => {
      return user.id === id;
    });

    return of(user) as Observable<User>;
  }
}
```

- `Identity` – sẽ chịu trách nhiệm trả về giá trị mà nó nhận được.
- `User` – model mà chúng ta sẽ thao tác với nó.
- `UserMockWebService` – mock service mà chúng ta sẽ sử dụng như một web service.

```ts
class UserService {
  private idRplSubj = new ReplaySubject<number>(1);

  userObs$: Observable<User> = this.idRplSubj
    .pipe(
      switchMap((userId: number) => {
        return this.userWebService.getUserById(userId);
      })
    );

    constructor(private userWebService: UserMockWebService) {}

    setId(id: number): void {
      this.idRplSubj.next(id);
    }
}
```

Demo:

```ts
// Demo
const userWebService = new UserMockWebService();
const userService = new UserService(userWebService);

userService.userObs$.subscribe(console.log);

userService.setId(2);
userService.setId(3);
```

- `UserService` – chịu trách nhiệm cung cấp dữ liệu được thu thập từ server bất cứ khi nào userId thay đổi.
- Ở cuối đoạn code, bạn có thể thấy phần demo, nó sẽ in ra kết quả sau:

```json
{ id: 2, name: "Liza" }
{ id: 3, name: "Suzi" }
```

## Reload dữ liệu ban đầu – bản nháp

Bây giờ chúng ta đã sẵn sàng để triển khai chức năng reload dữ liệu. Hãy cùng gặp gỡ operator `scan`.

```ts
class UserService {
  private reloadSubj = new Subject<void>();
  private idRplSubj = new ReplaySubject<number>(1);

  userObs$: Observable<User> =
    merge(
      this.idRplSubj,
      this.reloadSubj
    )
    .pipe(
      scan((oldValue, currentValue) => {
        if(!oldValue && !currentValue)
          throw new Error(`Reload can't run before initial load`);

        return currentValue || oldValue;
      }),
      switchMap((userId: number) => {
        return this.userWebService.getUserById(userId);
      })
    );

    constructor(private userWebService: UserMockWebService) {}

    setId(id: number): void {
      this.idRplSubj.next(id);
    }

    reload(): void {
      this.reloadSubj.next();
    }
}
```

Hãy cùng xem nó hoạt động:

```ts
const userWebService = new UserMockWebService();
const userService = new UserService(userWebService);

userService.userObs$.subscribe(console.log);

userService.setId(2);
userService.setId(3);
userService.reload();
userService.setId(1);
```

```json
{ id: 2, name: "Liza" }
{ id: 3, name: "Suzi" }
{ id: 3, name: "Suzi" }
{ id: 1, name: "John" }
```

## Thêm custom reload operator

Chúng ta cần tách operator `scan` ra để tránh lặp code:

```ts
function reload(selector: Function = Identity) {
  return scan((oldValue, currentValue) => {
    if(!oldValue && !currentValue)
      throw new Error(`Reload can't run before initial load`);

    return selector(currentValue || oldValue);
  });
}
```

Bây giờ, thay vì `scan`, chúng ta có thể sử dụng operator `reload` chỉ tốn một dòng:

```ts
class UserService {
  private reloadSubj = new Subject<void>();
  private idRplSubj = new ReplaySubject<number>(1);

  userObs$: Observable<User> =
    merge(
      this.idRplSubj,
      this.reloadSubj
    )
    .pipe(
      reload(),
      switchMap((userId: number) => {
        return this.userWebService.getUserById(userId);
      })
    );

    constructor(private userWebService: UserMockWebService) {}

    setId(id: number): void {
      this.idRplSubj.next(id);
    }

    reload(): void {
      this.reloadSubj.next();
    }
}
```

## Thêm hàm factory combineReload

Để tránh các boilerplate code (code mẫu lặp lại) từ ví dụ trước, chúng ta sẽ sử dụng factory function gọi là `combineReload()`. Hàm này sẽ gói gọn mọi thứ cho chúng ta. Đây là cách nó trông như thế nào:

```ts
function combineReload<T>(
  value$: Observable<T>,
  reload$: Observable<void>,
  selector: Function = Identity
): Observable<T> {
  return merge(value$, reload$).pipe(
    reload(selector),
    map((value: any) => value as T)
  );
}
```

Bây giờ chúng ta có thể xóa operator `reload()` và chỉ sử dụng factory function `combineReload()` của chúng ta.

```ts
class UserService {
  private reloadSubj = new Subject<void>();
  private idRplSubj = new ReplaySubject<number>(1);

  userObs$: Observable<User> =
    combineReload(
      this.idRplSubj,
      this.reloadSubj
    )
    .pipe(
      switchMap((userId: number) => {
        return this.userWebService.getUserById(userId);
      })
    );

  constructor(private userWebService: UserMockWebService) {}

  setId(id: number): void {
    this.idRplSubj.next(id);
  }

  reload(): void {
    this.reloadSubj.next();
  }
}
```

## Tham khảo

<[angular.love](https://angular.love/the-simple-way-to-reload-data-using-rxjs)>