import { Body, Controller, Delete, Get, Param, Post, Put, Query, UsePipes, ValidationPipe } from '@nestjs/common'
import { CreatePlayerDTO } from './dto/create-player.dto'
import { PlayersValidationParamsPipe } from './pipes/players-validation-params.pipe'
import { PlayersService } from './players.service'
import { Player } from './types/player.type'

@Controller('api/v1/players')
export class PlayersController {
    constructor(private readonly playersService: PlayersService) {}

    @Post()
    @UsePipes(ValidationPipe)
    async createUpdatePlayer(@Body() createPlayerDTO: CreatePlayerDTO): Promise<Player> {
        return await this.playersService.createPlayer(createPlayerDTO)
    }

    @Put('/:_id')
    @UsePipes(ValidationPipe)
    async updatePlayer(@Body() createPlayerDto: CreatePlayerDTO, @Param('_id') _id: string): Promise<Player> {
        return this.playersService.updatePlayer(_id, createPlayerDto)
    }

    @Get()
    async consultPlayer(): Promise<Player[]> {
        return this.playersService.consultAllPlayer()
    }

    @Get('/:_id')
    async consultById(@Param('_id', PlayersValidationParamsPipe) _id: string): Promise<CreatePlayerDTO> {
        return await this.playersService.consultById(_id)
    }

    @Delete()
    async deletePlayer(@Query('email', PlayersValidationParamsPipe) email: string): Promise<void> {
        await this.playersService.deletePlayer(email)
    }
}
