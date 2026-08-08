import { SetMetadata } from '@nestjs/common';

import { IS_ADMIN_KEY } from '~/modules/auth/presentation/http/decorators/auth.constants';

export const IsAdmin = (): ClassDecorator & MethodDecorator =>
  SetMetadata(IS_ADMIN_KEY, true);
