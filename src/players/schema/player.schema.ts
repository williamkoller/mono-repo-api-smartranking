import * as mongoose from 'mongoose'

export const PlayerSchema = new mongoose.Schema(
    {
        name: {
            type: String,
        },
        email: {
            type: String,
            unique: true,
        },
        phoneNumber: {
            type: String,
            unique: true,
        },
        ranking: {
            type: String,
        },
        rankingPosition: {
            type: Number,
        },
        urlPhotoPlayer: {
            type: String,
        },
    },
    {
        timestamps: true,
        collection: 'players',
    },
)
