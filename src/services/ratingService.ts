import Rating from "../models/ratingModel";

export const createRating = async (fromUserId: string, toUserId: string, score: number) => {
  const rating = new Rating({ fromUserId, toUserId, score });
  await rating.save();
  return rating;
};

export const findRatingById = async (ratingId: string) => {
  return await Rating.findById(ratingId);
};

export const updateRating = async (rating: any) => {
  await rating.save();
  return rating;
};

export const deleteRating = async (ratingId: string) => {
  await Rating.findByIdAndDelete(ratingId);
};

export const getAllRatingsForUser = async (userId: string) => {
  return await Rating.find({ toUserId: userId });
};
