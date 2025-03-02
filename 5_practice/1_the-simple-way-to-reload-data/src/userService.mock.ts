import { Observable, of } from "rxjs";
import { User } from "./interface";

export class UserMockWebService {
    users: Array<User> = [
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