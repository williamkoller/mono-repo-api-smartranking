import { Injectable, NotFoundException } from '@nestjs/common'
import { CreatePlayerDTO } from './dto/create-player.dto'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Player } from './types/player.type'

@Injectable()
export class PlayersService {
    constructor(@InjectModel('Player') private readonly playerModel: Model<Player>) {}

    /**
     * @param {CreatePlayerDTO} createPlayerDto
     * @return {*}  {Promise<void>}
     * @memberof PlayersService
     */
    async createUpdatePlayer(createPlayerDto: CreatePlayerDTO): Promise<Player> {
        const { email } = createPlayerDto

        const playerFound = await this.playerModel.findOne({ email }, { __v: false }).exec()

        if (playerFound) {
            return this.updatePlayer(createPlayerDto)
        }
        return await this.create(createPlayerDto)
    }

    /**
     * @return {*}  {Promise<Player[]>}
     * @memberof PlayersService
     */
    async consultAllPlayer(): Promise<Player[]> {
        return await this.playerModel
            .find({}, { __v: false })
            .sort({ name: +1 })
            .exec()
    }

    /**
     * @param {string} email
     * @return {*}  {Promise<Player>}
     * @memberof PlayersService
     */
    async consultByEmail(email: string): Promise<Player> {
        const playerFound = await this.playerModel.findOne({ email }, { __v: false }).exec()

        if (!playerFound) {
            throw new NotFoundException(`Player with email: ${email} not found `)
        }

        return playerFound
    }

    /**
     * @private
     * @param {Player} playerFound
     * @param {CreatePlayerDTO} createPlayerDto
     * @return {*}  {Promise<Player>}
     * @memberof PlayersService
     */
    private async updatePlayer(createPlayerDto: CreatePlayerDTO): Promise<Player> {
        return await this.playerModel
            .findOneAndUpdate({ email: createPlayerDto.email }, { $set: createPlayerDto })
            .exec()
    }

    /**
     * @param {string} email
     * @return {*}  {Promise<any>}
     * @memberof PlayersService
     */
    async deletePlayer(email: string): Promise<void> {
        await this.playerModel.remove({ email }).exec()
    }

    /**
     * @private
     * @param {CreatePlayerDTO} createPlayerDto
     * @return {*}  {Promise<Player>}
     * @memberof PlayersService
     */
    private async create(createPlayerDto: CreatePlayerDTO): Promise<Player> {
        const playerCreated = new this.playerModel(createPlayerDto)
        return await playerCreated.save()
    }
}
