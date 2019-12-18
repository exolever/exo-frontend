import { LogoutService } from './logout.service';


class LogoutServiceStub {
  logout = () => {};
}

export const LogoutServiceStubProvider = {
  provide: LogoutService, useClass: LogoutServiceStub
};
