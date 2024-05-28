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
import { ObjectId } from "mongodb";

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
  const { score } = req.body;
  const userId = req.user;

  try {
    const { error } = ratingSchema.validate(req.body);
    if (error) {
      return generateResponse(res, 400, "Validation error", error.message);
    }

    const ratings = await getRatingsByUser(userId);
    if (!ratings) {
      return generateResponse(res, 404, "Rating not found");
    }

    const rating = ratings.find((rating) => {
      const fromUserId = new ObjectId(rating.fromUserId);
      return fromUserId.equals(userId);
    });
    console.log(rating);
    if (!rating) {
      return generateResponse(
        res,
        403,
        "Access denied, user can only update rating given by themselves"
      );
    }

    rating.score = score;
    await updateRating(rating);
    return generateResponse(res, 200, "Rating updated successfully", {
      data: rating,
    });
  } catch (error) {
    console.error("Updating rating failed:", error);
    next(error);
  }
};

// Define the deleteRating function
export const deleteUserRating = async (
  req: Req,
  res: Response,
  next: NextFunction
) => {
  
  const { toUserId } = req.body; 
  const userId = req.user;
  try {
    const ratings = await getRatingsByUser(userId);
    if (!ratings) {
      return generateResponse(res, 404, "Ratings not found for user");
    }
    const ratingToDelete = ratings.find((rating) => {
      const toUserId = new ObjectId(rating.toUserId);
      return toUserId.equals(toUserId);
    });

    if (!ratingToDelete) {
      return generateResponse(res, 404, "Rating not found");
    }
    const rating = ratings.find((rating) => {
      const fromUserId = new ObjectId(rating.fromUserId);
      return fromUserId.equals(userId);
    });
    console.log(rating);
    if (!rating) {
      return generateResponse(
        res,
        403,
        "Access denied, user can only update rating given by themselves"
      );
    }

    

    await deleteRatingById(ratingToDelete._id);
    return generateResponse(res, 200, "Rating deleted successfully");
  } catch (error) {
    console.error("Deleting rating failed:", error);
    next(error);
  }
};


export const getAllRatings = async (
  req: Req,
  res: Response,
  next: NextFunction
) => {
  const userId = req.user;

  try {
    const ratings = await getAllRatingsForUser(userId);

    if (!ratings || ratings.length === 0) {
      return generateResponse(res, 404, "No ratings found for this user");
    }

    return generateResponse(res, 200, "Ratings fetched successfully", {
      data: ratings,
    });
  } catch (error) {
    console.error("Fetching ratings failed:", error);
    next(error);
  }
};
