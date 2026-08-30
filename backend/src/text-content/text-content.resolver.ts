import { Inject } from '@nestjs/common';
import { Query, Resolver } from '@nestjs/graphql';
import { TextContentType } from './graphql/text-content.type';
import {
  ITextContentService,
  TEXT_CONTENT_SERVICE,
} from './interfaces/text-content-service.interface';

@Resolver(() => TextContentType)
export class TextContentResolver {
  constructor(
    @Inject(TEXT_CONTENT_SERVICE) private readonly textContentService: ITextContentService,
  ) {}

  @Query(() => [TextContentType], {
    name: 'getTextContents',
    description: 'Список текстов для страниц (ключ → значение)',
  })
  async getTextContents(): Promise<TextContentType[]> {
    return this.textContentService.findAll();
  }
}
