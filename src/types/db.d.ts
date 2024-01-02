import type { Post, Subideavibe, User, Vote, Comment } from '@prisma/client'

export type ExtendedPost = Post & {
  subideavide: Subideavibe
  votes: Vote[]
  author: User
  comments: Comment[]
}