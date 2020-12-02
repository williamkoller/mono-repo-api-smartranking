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
    async createPlayer(createPlayerDto: CreatePlayerDTO): Promise<Player> {
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
    async consultById(_id: string): Promise<CreatePlayerDTO> {
        const playerFound = await this.playerModel.findOne({ _id }, { __v: false }).exec()

        if (!playerFound) {
            throw new NotFoundException(`Player with _id: ${_id} not found `)
        }

        const playerObject = {
            id: playerFound._id,
            name: playerFound.name,
            email: playerFound.email,
            phoneNumber: playerFound.phoneNumber,
        }

        return playerObject
    }

    /**
     * @param {Player} playerFound
     * @param {CreatePlayerDTO} createPlayerDto
     * @return {*}  {Promise<Player>}
     * @memberof PlayersService
     */
    async updatePlayer(_id: string, createPlayerDto: CreatePlayerDTO): Promise<Player> {
        return await this.playerModel.findOneAndUpdate({ _id }, { $set: createPlayerDto }).exec()
    }

    /**
     * @param {string} email
     * @return {*}  {Promise<any>}
     * @memberof PlayersService
     */
    async deletePlayer(email: string): Promise<void> {
        await this.playerModel.deleteOne({ email }).exec()
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
