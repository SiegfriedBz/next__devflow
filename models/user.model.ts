import { Document, model, models, Schema } from "mongoose"

export interface IUserDocument extends Document {
  clerkId: string
  name: string
  userName: string
  email: string
  picture: string
  password?: string
  bio?: string
  portfolio?: string
  location?: string
  reputation: number
  joinedDate: Date
  savedQuestions: Schema.Types.ObjectId[] // Question
}

const userSchema = new Schema<IUserDocument>({
  clerkId: { type: String, required: true },
  name: { type: String, required: true },
  userName: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  picture: { type: String, required: true },
  password: String,
  bio: String,
  portfolio: String,
  location: String,
  reputation: { type: Number, default: 0 },
  joinedDate: { type: Date, default: Date.now },
  savedQuestions: [{ type: Schema.Types.ObjectId, ref: "Question" }],
})

const User = models.User || model<IUserDocument>("User", userSchema)

export default User
