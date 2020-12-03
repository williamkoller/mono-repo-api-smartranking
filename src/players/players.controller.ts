import { Body, Controller, Delete, Get, Param, Post, Put, UsePipes, ValidationPipe } from '@nestjs/common'
import { CreatePlayerDTO, UpdatePlayerDTO } from './dto'
import { PlayersValidationParamsPipe } from './pipes/players-validation-params.pipe'
import { PlayersService } from './players.service'
import { Player } from './types/player.type'
import { ReturnTypeResponse } from './types/return.type.response'

@Controller('api/v1/players')
export class PlayersController {
    constructor(private readonly playersService: PlayersService) {}

    @Post()
    @UsePipes(ValidationPipe)
    async createPlayer(@Body() createPlayerDto: CreatePlayerDTO): Promise<Player> {
        return await this.playersService.createPlayer(createPlayerDto)
    }

    @Put('/:_id')
    @UsePipes(ValidationPipe)
    async updatePlayer(
        @Body() updatePlayerDto: UpdatePlayerDTO,
        @Param('_id', PlayersValidationParamsPipe) _id: string,
    ): Promise<Player> {
        return this.playersService.updatePlayer(_id, updatePlayerDto)
    }

    @Get()
    async searchForAllPlayer(): Promise<Player[] | CreatePlayerDTO[]> {
        return this.playersService.searchForAllPlayer()
    }

    @Get('/:_id')
    async searchByPlayerId(@Param('_id', PlayersValidationParamsPipe) _id: string): Promise<CreatePlayerDTO> {
        return await this.playersService.searchByPlayerId(_id)
    }

    @Delete('/:_id')
    async deletePlayerById(@Param('_id', PlayersValidationParamsPipe) _id: string): Promise<ReturnTypeResponse> {
        return await this.playersService.deletePlayerById(_id)
    }
}
