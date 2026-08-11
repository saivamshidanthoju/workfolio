import client from './client'
import type { Review, ReviewCreate } from '../types'

export async function getReviews(userId: string): Promise<Review[]> {
  const res = await client.get<Review[]>(`/reviews/${userId}`)
  return res.data
}

export async function createReview(data: ReviewCreate): Promise<Review> {
  const res = await client.post<Review>('/reviews', data)
  return res.data
}
