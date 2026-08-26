import { Controller, Get, Param } from '@nestjs/common';
import { TextContentService } from './text-content.service';

@Controller('api/content')
export class TextContentController {
  constructor(private readonly textContentService: TextContentService) {}

  @Get()
  findAll() {
    return this.textContentService.findAll();
  }

  @Get(':key')
  findByKey(@Param('key') key: string) {
    return this.textContentService.findByKey(key);
  }
}
