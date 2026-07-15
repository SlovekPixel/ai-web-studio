import { DocumentBuilder } from '@nestjs/swagger';

export const SwaggerConfig = new DocumentBuilder()
  .setTitle('AI Web Studio API')
  .setDescription('API documentation')
  .setVersion('1.0.0')
  .build();
