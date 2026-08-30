import { Module } from '@nestjs/common';
import { TEXT_CONTENT_SERVICE } from './interfaces/text-content-service.interface';
import { TextContentResolver } from './text-content.resolver';
import { TextContentService } from './text-content.service';

@Module({
  providers: [{ provide: TEXT_CONTENT_SERVICE, useClass: TextContentService }, TextContentResolver],
  exports: [TEXT_CONTENT_SERVICE],
})
export class TextContentModule {}
