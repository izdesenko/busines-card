import { Query, Resolver } from '@nestjs/graphql';
import { TextContentType } from './graphql/text-content.type';
import type { TextContentService } from './text-content.service';

@Resolver(() => TextContentType)
export class TextContentResolver {
  constructor(private readonly textContentService: TextContentService) {}

  @Query(() => [TextContentType], {
    name: 'getTextContents',
    description: 'Список текстов для страниц (ключ → значение)',
  })
  async getTextContents(): Promise<TextContentType[]> {
    return this.textContentService.findAll();
  }
}
