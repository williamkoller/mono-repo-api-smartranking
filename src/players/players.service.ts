import { Injectable, Logger, NotFoundException } from '@nestjs/common'
import { CreatePlayerDTO } from './dto/create-player.dto'
import { Player } from './types/player.type'
import { v4 as uuidv4 } from 'uuid'

@Injectable()
export class PlayersService {
    private readonly logger = new Logger(PlayersService.name)
    private players: Player[] = []
    async createUpdatePlayer(createPlayerDto: CreatePlayerDTO): Promise<void> {
        const { email } = createPlayerDto
        const playerFound = this.players.find((player) => player.email === email)

        if (playerFound) {
            this.updatePlayer(playerFound, createPlayerDto)
        }
        await this.create(createPlayerDto)
    }

    async consultAllPlayer(): Promise<Player[]> {
        return this.players
    }

    async consultByEmail(email: string): Promise<Player> {
        const playerFound = this.players.find((player) => player.email === email)

        if (!playerFound) {
            throw new NotFoundException(`Player with email: ${email} not found `)
        }

        return playerFound
    }

    private updatePlayer(playerFound: Player, createPlayerDto: CreatePlayerDTO): void {
        const { name } = createPlayerDto

        playerFound.name = name
    }

    async deletePlayer(email: string): Promise<void> {
        const playerFound = this.players.find((player) => player.email === email)
        this.players = this.players.filter((player) => player.email !== playerFound.email)
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
