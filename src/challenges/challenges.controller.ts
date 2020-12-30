import { Body, Controller, Get, Post, Query, UsePipes, ValidationPipe } from '@nestjs/common'
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

  @Get()
  async findAll(@Query('playerId') _id: string): Promise<Array<Challenge>> {
    return _id ? await this.challegensService.findChallengeByPlayer(_id) : await this.challegensService.findAll()
  }
}
