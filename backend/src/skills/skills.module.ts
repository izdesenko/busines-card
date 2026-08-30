import { Module } from '@nestjs/common';
import { SKILLS_SERVICE } from './interfaces/skills-service.interface';
import { SkillsResolver } from './skills.resolver';
import { SkillsService } from './skills.service';

@Module({
  providers: [{ provide: SKILLS_SERVICE, useClass: SkillsService }, SkillsResolver],
  exports: [SKILLS_SERVICE],
})
export class SkillsModule {}
