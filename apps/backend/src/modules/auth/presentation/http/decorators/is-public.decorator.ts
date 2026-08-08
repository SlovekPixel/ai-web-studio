import { SetMetadata } from '@nestjs/common';

import { IS_PUBLIC_KEY } from '~/modules/auth/presentation/http/decorators/auth.constants';

export const IsPublic = (): ClassDecorator & MethodDecorator =>
  SetMetadata(IS_PUBLIC_KEY, true);
