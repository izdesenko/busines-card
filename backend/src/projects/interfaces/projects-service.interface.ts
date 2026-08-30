import type { Project } from '@prisma/client';
import type { ProjectType } from '../graphql/project.type';

export interface IProjectsService {
  findAll(): Promise<ProjectType[]>;
  findOne(id: number): Promise<Project | null>;
}

export const PROJECTS_SERVICE = Symbol('IProjectsService');
