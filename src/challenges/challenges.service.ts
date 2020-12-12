import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { CategoriesService } from 'src/categories/categories.service'
import { PlayersService } from 'src/players/players.service'
import { CreateChallengeDto } from './dto/create-challenge.dto'
import { ChallengeStatus } from './enum/challenge-status.enum'
import { Challenge } from './types/challenge.type'
import { Match } from './types/match.type'

@Injectable()
export class ChallengesService {
  constructor(
    @InjectModel('Challenge') private readonly challengeModel: Model<Challenge>,
    @InjectModel('Match') private readonly matchModel: Model<Match>,
    private readonly playersService: PlayersService,
    private readonly categoriesService: CategoriesService,
  ) {}
  async createChallenge(createChallengeDto: CreateChallengeDto): Promise<Challenge> {
    const players = await this.playersService.searchForAllPlayer()
    console.log(players)

    createChallengeDto.players.map((playerDto) => {
      const playerFilter = players.filter((player) => player._id == playerDto._id)
      console.log(playerFilter)

      if (playerFilter.length == 0) {
        throw new BadRequestException('The id not of a player.')
      }
    })

    const applicanteIsMatchPlayer = createChallengeDto.players.filter((player) => {
      player._id == createChallengeDto.applicant
    })

    if (applicanteIsMatchPlayer.length == 0) {
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
}
