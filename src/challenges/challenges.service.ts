import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { CategoriesService } from 'src/categories/categories.service'
import { PlayersService } from 'src/players/players.service'
import { CreateChallengeDto } from './dto/create-challenge.dto'
import { ChallengeStatus } from './enum/challenge-status.enum'
import { Challenge } from './types/challenge.type'

@Injectable()
export class ChallengesService {
  constructor(
    @InjectModel('Challenge') private readonly challengeModel: Model<Challenge>,
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
    return await this.challengeModel.find().populate('applicant').populate('players').populate('matchs').exec()
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
      .populate('matchs')
      .exec()
  }
}
