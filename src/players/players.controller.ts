import { Body, Controller, Delete, Get, Post, Query, UsePipes, ValidationPipe } from '@nestjs/common'
import { CreatePlayerDTO } from './dto/create-player.dto'
import { PlayersService } from './players.service'
import { Player } from './types/player.type'

@Controller('api/v1/players')
export class PlayersController {
    constructor(private readonly playersService: PlayersService) {}

    @Post()
    @UsePipes(ValidationPipe)
    async createUpdatePlayer(@Body() createPlayerDTO: CreatePlayerDTO): Promise<Player> {
        return await this.playersService.createUpdatePlayer(createPlayerDTO)
    }

    @Get()
    async consultPlayer(@Query('email') email: string): Promise<Player[] | Player> {
        if (email) {
            return this.playersService.consultByEmail(email)
        }
        return this.playersService.consultAllPlayer()
    }

    @Delete()
    async deletePlayer(@Query('email') email: string): Promise<void> {
        await this.playersService.deletePlayer(email)
    }
}
