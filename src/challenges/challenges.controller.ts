import { Body, Controller, Post, UsePipes } from '@nestjs/common'
import { ChallengesService } from './challenges.service'
import { CreateChallengeDto } from './dto/create-challenge.dto'

@Controller('api/v1/challenges')
export class ChallengesController {
  constructor(private readonly challegensService: ChallengesService) {}
  @Post()
  @UsePipes()
  async createChallenge(@Body() createChallengeDto: CreateChallengeDto) {
    return this.challegensService.createChallenge(createChallengeDto)
  }
}
