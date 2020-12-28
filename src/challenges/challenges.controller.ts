import { Body, Controller, Post, UsePipes, ValidationPipe } from '@nestjs/common'
import { ChallengesService } from './challenges.service'
import { CreateChallengeDto } from './dto/create-challenge.dto'
import { Challenge } from './types/challenge.type'

@Controller('api/v1/challenges')
export class ChallengesController {
  constructor(private readonly challegensService: ChallengesService) {}
  @Post()
  @UsePipes(ValidationPipe)
  async createChallenge(@Body() createChallengeDto: CreateChallengeDto): Promise<Challenge> {
    return await this.challegensService.createChallenge(createChallengeDto)
  }
}
