import { Document } from 'mongoose'
import { Player } from 'src/players/types/player.type'
import { ChallengeStatus } from '../enum/challenge-status.enum'
import { Match } from './match.type'

export type Challenge = ChallengeDocument

export interface ChallengeDocument extends Document {
  challengeDateTime: Date
  status: ChallengeStatus
  dateHorizon: Date
  dateHourAnswer: Date
  applicant: Player
  category: string
  players: Array<Player>
  match: Match
}
