import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { PlayersModule } from './players/players.module'

@Module({
    imports: [
        MongooseModule.forRoot('mongodb://mongo_db/api-smartranking', {
            useCreateIndex: true,
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
        }),
        PlayersModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
