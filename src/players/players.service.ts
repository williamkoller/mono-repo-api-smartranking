import { Injectable, Logger } from '@nestjs/common'
import { CreatePlayerDTO } from './dto/create-player.dto'
import { Player } from './types/player.type'
import { v4 as uuidv4 } from 'uuid'

@Injectable()
export class PlayersService {
    private readonly logger = new Logger(PlayersService.name)
    private players: Player[] = []
    async createUpdatePlayer(createPlayerDto: CreatePlayerDTO): Promise<void> {
        await this.create(createPlayerDto)
    }

    async consultAllPlayer(): Promise<Player[]> {
        return await this.players
    }

    private async create(createPlayerDto: CreatePlayerDTO): Promise<void> {
        const { name, email, phoneNumber } = createPlayerDto

        const player: Player = {
            _id: uuidv4(),
            name,
            email,
            phoneNumber,
            ranking: 'A',
            rankingPosition: 1,
            urlPhotoPlayer: 'https://www.google.com/image-player.jpg',
        }
        this.logger.log(`player: ${JSON.stringify(player)}`)

        this.players.push(player)
    }
}
