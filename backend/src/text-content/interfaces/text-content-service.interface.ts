import type { TextContent } from '@prisma/client';

export interface ITextContentService {
  findAll(): Promise<TextContent[]>;
  findByKey(key: string): Promise<TextContent | null>;
}

export const TEXT_CONTENT_SERVICE = Symbol('ITextContentService');
