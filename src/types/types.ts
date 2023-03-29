export interface IUser {
  username: string
  image: {
    png: string
    webp: string
  }
}

export interface IComment {
  id: string | number
  content: string
  createdAt: string
  score: number
  user: IUser
  replyingTo?: string
  replies: Array<IComment>
  upVoted?: boolean
  downVoted?: boolean
}
