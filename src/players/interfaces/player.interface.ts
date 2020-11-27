import { Document } from 'mongoose'

export interface Player extends Document {
    name: string
    email: string
    phoneNumber: string
    ranking: string
    rankingPosition: number
    urlPhotoPlayer: string
}
