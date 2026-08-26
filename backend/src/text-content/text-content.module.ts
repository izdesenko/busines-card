import { Module } from '@nestjs/common';
import { TextContentController } from './text-content.controller';
import { TextContentService } from './text-content.service';

@Module({
  controllers: [TextContentController],
  providers: [TextContentService],
  exports: [TextContentService],
})
export class TextContentModule {}
