import { merge, Observable } from "rxjs";
import { map, scan } from "rxjs/operators";

function Identity<T>(value: T): T {
    return value;
}

export function reload(selector: Function = Identity) {
    return scan((oldValue, currentValue) => {
      if(!oldValue && !currentValue)
        throw new Error(`Reload can't run before initial load`);
  
      return selector(currentValue || oldValue);
    });
  }

export function combineReload<T>(
    value$: Observable<T>,
    reload$: Observable<void>,
    selector: Function = Identity
  ): Observable<T> {
    return merge(value$, reload$).pipe(
      reload(selector),
      map((value: any) => value as T)
    );
  }
