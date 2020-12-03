import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
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
        const { email } = createPlayerDto
        const playerFound = await this.playerModel.findOne({ email }).exec()
        if (playerFound) {
            throw new BadRequestException(`The player with this e-mail: ${email} already exists!`)
        }
        const playerCreated = new this.playerModel(createPlayerDto)
        return await playerCreated.save()
    }

    /**
     * @param {Player} playerFound
     * @param {CreatePlayerDTO} createPlayerDto
     * @return {*}  {Promise<Player>}
     * @memberof PlayersService
     */
    async updatePlayer(_id: string, createPlayerDto: CreatePlayerDTO): Promise<Player> {
        const playerFound = await this.playerModel.findOne({ _id }).exec()
        if (!playerFound) {
            throw new NotFoundException(`The player with this id: ${_id} not found!`)
        }
        return await this.playerModel.findOneAndUpdate({ _id }, { $set: createPlayerDto }).exec()
    }

    /**
     * @return {*}  {Promise<Player[] | CreatePlayerDto[]>}
     * @memberof PlayersService
     */
    async consultAllPlayer(): Promise<Player[] | CreatePlayerDTO[]> {
        const players = await this.playerModel.find({}, { __v: false }).exec()
        return players.map((p) => ({
            id: p.id,
            name: p.name,
            email: p.email,
            numberPhone: p.phoneNumber,
        }))
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
            id: playerFound.id,
            name: playerFound.name,
            email: playerFound.email,
            phoneNumber: playerFound.phoneNumber,
        }

        return playerObject
    }

    /**
     * @param {string} _id
     * @return {*}  {Promise<any>}
     * @memberof PlayersService
     */
    async deletePlayer(_id: string): Promise<void> {
        await this.playerModel.deleteOne({ _id }).exec()
    }
}
