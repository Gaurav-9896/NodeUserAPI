import Rating from "../models/ratingModel";

export const createRating = async (
  fromUserId: string,
  toUserId: string,
  score: number
) => {
  const rating = new Rating({ fromUserId, toUserId, score });
  await rating.save();
  return rating;
};

export const findRatingById = async (ratingId: string) => {
  return await Rating.findById(ratingId);
};
export const getRatingsByUser = async (userId: string) => {
  return await Rating.find({ fromUserId: userId });
};

export const updateRating = async (rating: any) => {
  await rating.save();
  return rating;
};

export const deleteRating = async (userId: string) => {
  await Rating.findByIdAndDelete({ fromUserId: userId });
};

export const deleteRatingById = async (ratingId: string) => {
  try {
    const rating = await Rating.findByIdAndDelete(ratingId);
    if (!rating) {
      throw new Error('Rating not found');
    }
    return rating;
  } catch (error) {
    console.error("Deleting rating failed:", error);
    throw error;
  }
};

export const getAllRatingsForUser = async (userId: string) => {
  return await Rating.find({ toUserId: userId });
};
