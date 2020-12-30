import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { CategoriesService } from 'src/categories/categories.service'
import { PlayersService } from 'src/players/players.service'
import { AssignMatchChallengeDto } from './dto/assign-match-challenge.dto'
import { CreateChallengeDto } from './dto/create-challenge.dto'
import { UpdateChallengeDto } from './dto/update-challenge.dto'
import { ChallengeStatus } from './enum/challenge-status.enum'
import { Challenge } from './types/challenge.type'
import { Match } from './types/match.type'

@Injectable()
export class ChallengesService {
  private readonly logger = new Logger(ChallengesService.name)
  constructor(
    @InjectModel('Challenge') private readonly challengeModel: Model<Challenge>,
    @InjectModel('Match') private readonly matchModel: Model<Match>,
    private readonly playersService: PlayersService,
    private readonly categoriesService: CategoriesService,
  ) {}
  async createChallenge(createChallengeDto: CreateChallengeDto): Promise<Challenge> {
    const players = await this.playersService.searchForAllPlayer()
    createChallengeDto.players.map((playerDto) => {
      const filterPlayer = players.filter((player) => player._id == playerDto._id)
      if (filterPlayer.length == 0) {
        throw new BadRequestException('This id is not a player.')
      }
    })

    const applicantIsMatchPlayer = createChallengeDto.players.filter(
      (player) => player._id == createChallengeDto.applicant,
    )

    if (applicantIsMatchPlayer.length == 0) {
      throw new BadRequestException('The applicant must be a match player.')
    }

    const playerCategory = await this.categoriesService.searchPlayerCategory(createChallengeDto.applicant)

    if (!playerCategory) {
      throw new BadRequestException('The requester must be registered in a category.')
    }

    const createChallenge = new this.challengeModel(createChallengeDto)
    createChallenge.category = playerCategory.category
    createChallenge.dateHorizon = new Date()

    createChallenge.status = ChallengeStatus.PENDING
    return await createChallenge.save()
  }

  async findAll(): Promise<Array<Challenge>> {
    return await this.challengeModel.find().populate('applicant').populate('players').populate('match').exec()
  }

  async findChallengeByPlayer(_id: any): Promise<Array<Challenge>> {
    const players = await this.playersService.searchForAllPlayer()
    const playerFilters = players.filter((player) => player._id == _id)
    if (playerFilters.length == 0) {
      throw new BadRequestException('This id not is player.')
    }
    return await this.challengeModel
      .where('players')
      .in(_id)
      .populate('applicant')
      .populate('players')
      .populate('match')
      .exec()
  }

  async updateChallenge(_id: string, updateChallengeDto: UpdateChallengeDto): Promise<Challenge> {
    const challengeFound = await this.challengeModel.findById(_id).exec()
    if (!challengeFound) {
      throw new BadRequestException('Challenge not found.')
    }
    if (updateChallengeDto.status) {
      challengeFound.dateHourAnswer = new Date()
    }
    challengeFound.status = updateChallengeDto.status
    challengeFound.challengeDateTime = updateChallengeDto.challengeDateTime

    return await this.challengeModel.findOneAndUpdate({ _id }, { $set: challengeFound }).exec()
  }

  async assignMatchChallenge(_id: string, assignMatchChallengeDto: AssignMatchChallengeDto): Promise<Challenge> {
    const challengeFound = await this.challengeModel.findById(_id).exec()
    if (!challengeFound) {
      throw new BadRequestException('Challenge not found.')
    }
    const playerFilter = challengeFound.players.filter((player) => player._id == assignMatchChallengeDto.def)
    this.logger.log(`challengeFound: ${challengeFound}`)
    this.logger.log(`playerFilter: ${playerFilter}`)
    if (playerFilter.length == 0) {
      throw new BadRequestException('The winning player is not part of the game.')
    }
    const challengeCreated = new this.matchModel(assignMatchChallengeDto)

    challengeCreated.category = challengeFound.category

    challengeCreated.players = challengeFound.players

    const result = await challengeCreated.save()

    challengeFound.status = ChallengeStatus.ACCOMPLISHED

    challengeFound.match = result._id

    try {
      return await this.challengeModel.findOneAndUpdate({ _id }, { $set: challengeFound }).exec()
    } catch (error) {
      await this.matchModel.deleteOne({ _id: result._id }).exec()
      throw new InternalServerErrorException(error.message)
    }
  }

  async deleteChallenge(_id: string): Promise<Challenge> {
    const challengeFound = await this.challengeModel.findById(_id).exec()
    if (!challengeFound) {
      throw new BadRequestException('Challenge not found.')
    }
    challengeFound.status = ChallengeStatus.CANCELED
    return await this.challengeModel.findOneAndUpdate({ _id }, { $set: challengeFound }).exec()
  }
}
