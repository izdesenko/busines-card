import { Module } from '@nestjs/common';
import { PROJECTS_SERVICE } from './interfaces/projects-service.interface';
import { ProjectsResolver } from './projects.resolver';
import { ProjectsService } from './projects.service';

@Module({
  providers: [{ provide: PROJECTS_SERVICE, useClass: ProjectsService }, ProjectsResolver],
  exports: [PROJECTS_SERVICE],
})
export class ProjectsModule {}
