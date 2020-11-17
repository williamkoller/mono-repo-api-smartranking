import { Body, Controller, Post } from '@nestjs/common'
import { CreatePlayerDTO } from './dto/create-player.dto'

@Controller('api/v1/players')
export class PlayersController {
  @Post()
  async createUpdatePlayer(@Body() createPlayerDTO: CreatePlayerDTO): Promise<CreatePlayerDTO> {
    const { email } = createPlayerDTO
    return {
      email,
    }
  }
}
