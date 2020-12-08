import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { PlayersController } from './players.controller'
import { PlayersService } from './players.service'
import { PlayerSchema } from './schema/player.schema'

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: 'Player',
                schema: PlayerSchema,
            },
        ]),
    ],
    controllers: [PlayersController],
    providers: [PlayersService],
    exports: [PlayersService],
})
export class PlayersModule {}
