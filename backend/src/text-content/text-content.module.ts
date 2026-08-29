import { Module } from '@nestjs/common';
import { TextContentResolver } from './text-content.resolver';
import { TextContentService } from './text-content.service';

@Module({
  providers: [TextContentService, TextContentResolver],
  exports: [TextContentService],
})
export class TextContentModule {}
