import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { PlayersModule } from './players/players.module'
import { CategoriesModule } from './categories/categories.module'
import { ChallengesModule } from './challenges/challenges.module'
import { MorganInterceptor, MorganModule } from 'nest-morgan'
import { APP_INTERCEPTOR } from '@nestjs/core'

@Module({
  imports: [
    MorganModule.forRoot(),
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
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: MorganInterceptor('dev'),
    },
  ],
})
export class AppModule {}
