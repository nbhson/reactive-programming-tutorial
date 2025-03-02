import { merge, Observable, of, ReplaySubject, Subject } from 'rxjs';
import { map, scan, switchMap } from 'rxjs/operators';
import { User } from './interface';
import { UserMockWebService } from './userService.mock';
import { combineReload } from './until';

export class UserService {
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