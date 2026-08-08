import { SetMetadata } from '@nestjs/common';

import { IS_USER_KEY } from '~/modules/auth/presentation/http/decorators/auth.constants';

export const IsUser = (): ClassDecorator & MethodDecorator =>
  SetMetadata(IS_USER_KEY, true);
