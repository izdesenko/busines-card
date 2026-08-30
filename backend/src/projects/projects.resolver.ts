import { Inject } from '@nestjs/common';
import { Query, Resolver } from '@nestjs/graphql';
import { ProjectType } from './graphql/project.type';
import { IProjectsService, PROJECTS_SERVICE } from './interfaces/projects-service.interface';

@Resolver(() => ProjectType)
export class ProjectsResolver {
  constructor(
    @Inject(PROJECTS_SERVICE) private readonly projectsService: IProjectsService,
  ) {}

  @Query(() => [ProjectType], {
    name: 'getProjects',
    description: 'Список проектов для портфолио',
  })
  async getProjects(): Promise<ProjectType[]> {
    return this.projectsService.findAll();
  }
}
