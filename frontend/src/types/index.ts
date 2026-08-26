export interface Skill {
  id: number;
  name: string;
  level: number;
}

export interface SkillGroup {
  category: string;
  skills: Skill[];
}

export interface Project {
  id: number;
  title: string;
  description: string;
  /** Технологии через запятую, например: "NestJS, Prisma, Docker" */
  technologies: string;
  githubLink?: string | null;
  liveLink?: string | null;
  order: number;
}

export interface TextContent {
  key: string;
  /** Может содержать HTML — рендерится через v-html в компонентах-панелях. */
  value: string;
}

export type ContactKind = 'telegram' | 'email' | 'github' | string;

export interface Contact {
  id: number;
  type: ContactKind;
  label: string;
  value: string;
  url?: string | null;
  order: number;
}

export interface ContactFormInput {
  name: string;
  email: string;
  phone?: string;
  message: string;
}

export interface ContactFormResult {
  delivered: boolean;
}

export interface TmuxTab {
  id: string;
  label: string;
}
