import { Body, Controller, Delete, Get, Param, Post, Put, Query, UsePipes, ValidationPipe } from '@nestjs/common'
import { ChallengesService } from './challenges.service'
import { AssignMatchChallengeDto } from './dto/assign-match-challenge.dto'
import { CreateChallengeDto } from './dto/create-challenge.dto'
import { UpdateChallengeDto } from './dto/update-challenge.dto'
import { ChallengeStatusValidationPipe } from './pipes/challenge-status-validation.pipe'
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

  @Put('/:challenge')
  async updateChallenge(
    @Body(ChallengeStatusValidationPipe) updateChallengeDto: UpdateChallengeDto,
    @Param('challenge') _id: string,
  ): Promise<Challenge> {
    return await this.challegensService.updateChallenge(_id, updateChallengeDto)
  }

  @Post('/:challenge/match')
  async assignMatchChallenge(
    @Body(ValidationPipe) assignMatchChallengeDto: AssignMatchChallengeDto,
    @Param('challenge') _id: string,
  ): Promise<Challenge> {
    return await this.challegensService.assignMatchChallenge(_id, assignMatchChallengeDto)
  }

  @Delete('/:challenge')
  async deleteChallenge(@Param('challenge') _id: string): Promise<Challenge> {
    return await this.challegensService.deleteChallenge(_id)
  }
}
