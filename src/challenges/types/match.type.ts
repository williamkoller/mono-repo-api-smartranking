import { Document } from 'mongoose'
import { Player } from 'src/players/types/player.type'
import { Result } from './result.type'

export type Match = MatchDocument

export interface MatchDocument extends Document {
  category: string
  players: Array<Player>
  def: Player
  result: Array<Result>
}
