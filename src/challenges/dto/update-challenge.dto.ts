import { IsDateString, IsOptional, IsString } from 'class-validator'
import { ChallengeStatus } from '../enum/challenge-status.enum'

export class UpdateChallengeDto {
  @IsOptional()
  @IsDateString()
  challengeDateTime?: Date

  @IsString()
  @IsOptional()
  status?: ChallengeStatus
}
