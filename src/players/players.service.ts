import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { CreatePlayerDTO, UpdatePlayerDTO } from './dto'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Player } from './types/player.type'
import { ReturnTypeResponse } from './types/return.type.response'

@Injectable()
export class PlayersService {
  constructor(@InjectModel('Player') private readonly playerModel: Model<Player>) {}

  /**
   * @param {CreatePlayerDTO} createPlayerDto
   * @return {*}  {Promise<Player>}
   * @memberof PlayersService
   */
  async createPlayer(createPlayerDto: CreatePlayerDTO): Promise<Player> {
    const { email } = createPlayerDto
    const playerFound = await this.playerModel.findOne({ email }).exec()
    if (playerFound) {
      throw new BadRequestException(`Player already registered with this email.`)
    }
    const playerCreated = new this.playerModel(createPlayerDto)
    return await playerCreated.save()
  }

  /**
   * @param {string} _id
   * @param {UpdatePlayerDTO} updatePlayerDto
   * @return {*}  {Promise<Player>}
   * @memberof PlayersService
   */
  async updatePlayer(_id: string, updatePlayerDto: UpdatePlayerDTO): Promise<Player> {
    const playerFound = await this.playerModel.findOne({ _id }).exec()
    if (!playerFound) {
      throw new NotFoundException(`Player not found.`)
    }
    return await this.playerModel.findOneAndUpdate({ _id }, { $set: updatePlayerDto }).exec()
  }

  /**
   * @return {*}  {(Promise<Player[] | CreatePlayerDTO[]>)}
   * @memberof PlayersService
   */
  async searchForAllPlayer(): Promise<Player[]> {
    return await this.playerModel.find({}, { __v: false }).exec()
  }

  /**
   * @param {string} _id
   * @return {*}  {}
   * @memberof PlayersService
   */
  async searchByPlayerId(_id: string): Promise<CreatePlayerDTO> {
    const playerFound = await this.playerModel.findOne({ _id }, { __v: false }).exec()

    if (!playerFound) {
      throw new NotFoundException(`Player not found.`)
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
   * @return {*}  {Promise<ReturnTypeResponse>}
   * @memberof PlayersService
   */
  async deletePlayerById(_id: string): Promise<ReturnTypeResponse> {
    const playerFound = await this.playerModel.findOne({ _id }, { __v: false }).exec()

    if (!playerFound) {
      throw new NotFoundException(`Player not found.`)
    }
    await this.playerModel.deleteOne({ _id }).exec()
    return {
      message: 'This player was deleted with successfully',
    }
  }
}
