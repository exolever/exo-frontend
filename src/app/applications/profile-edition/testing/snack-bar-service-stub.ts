import { ProfileEditSnackBarService } from '../services/snack-bar.service';

class ProfileEditSnackBarServiceStub {
  success = (message?: string, action?: string) => {};
  error = () => {};
}

export const profileEditSnackBarServiceStubProvider = {
  provide: ProfileEditSnackBarService, useClass: ProfileEditSnackBarServiceStub
};
