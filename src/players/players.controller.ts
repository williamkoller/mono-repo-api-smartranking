import { Body, Controller, Get, Post } from '@nestjs/common'
import { CreatePlayerDTO } from './dto/create-player.dto'
import { PlayersService } from './players.service'
import { Player } from './types/player.type'

@Controller('api/v1/players')
export class PlayersController {
    constructor(private readonly playersService: PlayersService) {}

    @Post()
    async createUpdatePlayer(@Body() createPlayerDTO: CreatePlayerDTO): Promise<void> {
        await this.playersService.createUpdatePlayer(createPlayerDTO)
    }

    @Get()
    async consultPlater(): Promise<Player[]> {
        return this.playersService.consultAllPlayer()
    }
}
