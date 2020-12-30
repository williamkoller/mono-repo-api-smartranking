import { IsNotEmpty } from 'class-validator'
import { Player } from 'src/players/types/player.type'
import { Result } from '../types/result.type'

export class AssignMatchChallengeDto {
  @IsNotEmpty()
  def: Player

  @IsNotEmpty()
  result: Array<Result>
}
