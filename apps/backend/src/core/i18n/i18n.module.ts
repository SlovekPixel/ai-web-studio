import { Global, Module } from '@nestjs/common';

import { I18nService } from '~/core/i18n/application/i18n.service';
import { I18N_SERVICE } from '~/core/i18n/domain/ports/i18n.service.port';

@Global()
@Module({
  providers: [
    I18nService,
    {
      provide: I18N_SERVICE,
      useExisting: I18nService,
    },
  ],
  exports: [I18N_SERVICE, I18nService],
})
export class I18nModule {}
