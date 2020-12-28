import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { PlayersModule } from './players/players.module'
import { CategoriesModule } from './categories/categories.module'
import { ChallengesModule } from './challenges/challenges.module'

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://db_mongo:27017/api-smartranking', {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    }),
    PlayersModule,
    CategoriesModule,
    ChallengesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
