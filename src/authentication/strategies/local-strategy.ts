import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Dependencies } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { ErrorService } from 'src/config/error/error.service';

@Injectable()
@Dependencies(AuthService)
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    private authService: AuthService,
    private errorService: ErrorService,
  ) {
    super();
  }

  // parameters to the validate function should be username, password.
  // If not that has to be specified in the options object { usernameField: 'email' } passing with the super() call
  async validate(username, password) {
    const user = await this.authService.validateUser(username, password);
    if (!user) {
      throw this.errorService.newError(this.errorService.getErrConfig().E0012);
    }
    return user;
  }
}
