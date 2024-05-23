import { NextFunction, Response } from "express";
import {
  createRating,
  findRatingById,
  updateRating,
  deleteRating,
  getRatingsByUser,
  deleteRatingById,
  getAllRatingsForUser,
} from "../services/ratingService";
import { generateResponse } from "../utils/Response";
import { Req } from "../interface/request";
import { ratingSchema } from "../utils/validation";

export const rateUser = async (req: Req, res: Response, next: NextFunction) => {
  const { toUserId, score } = req.body;
  const fromUserId = req.user;

  try {
    const { error } = ratingSchema.validate(req.body);
    if (error) {
      return generateResponse(res, 400, "Validation error", error.message);
    }

    if (fromUserId === toUserId) {
      return generateResponse(res, 400, "Cannot rate yourself");
    }

    const rating = await createRating(fromUserId, toUserId, score);
    return generateResponse(res, 201, "User rated successfully", {
      data: rating,
    });
  } catch (error) {
    console.error("Rating user failed:", error);
    next(error);
  }
};

// Update rating
export const updateRatingById = async (
  req: Req,
  res: Response,
  next: NextFunction
) => {
  const score = req.body;
  const userId = req.user;

  try {
    const { error } = ratingSchema.validate(req.body);
    if (error) {
      return generateResponse(res, 400, "Validation error", error.message);
    }

    const rating = await getRatingsByUser(userId);
    if (!rating) {
      return generateResponse(res, 404, "Rating not found");
    }

    const ratings = rating.find((rating) => rating.fromUserId === userId);
    if (!ratings) {
      return generateResponse(res, 403, "Access denied");
    }

    ratings.score = score;
    await updateRating(rating);
    return generateResponse(res, 200, "Rating updated successfully", {
      data: rating,
    });
  } catch (error) {
    console.error("Updating rating failed:", error);
    next(error);
  }
};

// // Delete rating
export const deleteUserRating = async (
  req: Req,
  res: Response,
  next: NextFunction
) => {
  const userId = req.user;

  try {
    // Fetch ratings by user ID
    const ratings = await getRatingsByUser(userId);
    if (!ratings) {
      return generateResponse(res, 404, "Rating not found");
    }

    // Find the specific rating from the array where fromUserId matches userId
    const ratingIndex = ratings.findIndex(
      (rating) => rating.fromUserId === userId
    );
    if (ratingIndex === -1) {
      return generateResponse(res, 403, "Access denied");
    }

    // Remove the rating from the array
    const [deletedRating] = ratings.splice(ratingIndex, 1);
    await deleteRatingById(deletedRating.id); // Assuming each rating has a unique ID

    // Send success response
    return generateResponse(res, 200, "Rating deleted successfully", {
      data: deletedRating,
    });
  } catch (error) {
    console.error("Deleting rating failed:", error);
    next(error); // Pass error to next middleware
  }
};

// // Get all ratings for a user
export const getAllRatings = async (
  req: Req,
  res: Response,
  next: NextFunction
) => {
  const { userId } = req.user;

  try {
    const ratings = await getAllRatingsForUser(userId);
    return generateResponse(res, 200, "Ratings fetched successfully", {
      data: ratings,
    });
  } catch (error) {
    console.error("Fetching ratings failed:", error);
    next(error);
  }
};
