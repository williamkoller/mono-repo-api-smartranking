import { Module } from '@nestjs/common'
import { ChallengesService } from './challenges.service'
import { ChallengesController } from './challenges.controller'
import { MongooseModule } from '@nestjs/mongoose'
import { ChallengeSchema } from './schema/challenge.schema'
import { MatchSchema } from './schema/match.schema'
import { PlayersModule } from 'src/players/players.module'
import { CategoriesModule } from 'src/categories/categories.module'

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'Challenge',
        schema: ChallengeSchema,
      },
      {
        name: 'Match',
        schema: MatchSchema,
      },
    ]),
    PlayersModule,
    CategoriesModule,
  ],
  providers: [ChallengesService],
  controllers: [ChallengesController],
})
export class ChallengesModule {}
