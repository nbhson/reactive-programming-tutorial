import { UserService } from "./userService";
import { UserMockWebService } from "./userService.mock";


const observer = {
    next: (data: any) => console.log(data),
    error: (error: any) => console.error(error),
    complete: () => console.log('Completed!')
}

const userWebService = new UserMockWebService();
const userService = new UserService(userWebService);

userService.userObs$.subscribe(observer);

userService.setId(2);
userService.setId(3);
userService.reload();
userService.setId(1);

// { id: 2, name: "Liza" }
// { id: 3, name: "Suzi" }
// { id: 3, name: "Suzi" }
// { id: 1, name: "John" }