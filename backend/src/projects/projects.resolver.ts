import { Query, Resolver } from '@nestjs/graphql';
import { ProjectType } from './graphql/project.type';
import { ProjectsService } from './projects.service';

@Resolver(() => ProjectType)
export class ProjectsResolver {
  constructor(private readonly projectsService: ProjectsService) {}

  @Query(() => [ProjectType], {
    name: 'getProjects',
    description: 'Список проектов для портфолио',
  })
  async getProjects(): Promise<ProjectType[]> {
    return this.projectsService.findAll();
  }
}
