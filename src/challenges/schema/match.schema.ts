import * as mongoose from 'mongoose'

export const MatchSchema = new mongoose.Schema(
  {
    categories: {
      type: String,
    },
    players: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Player',
      },
    ],
    def: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Player',
    },
    result: [
      {
        set: {
          type: String,
        },
      },
    ],
  },
  {
    timestamps: true,
    collection: 'matchs',
  },
)
