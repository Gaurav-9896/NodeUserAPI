import { NextFunction, Response } from "express";
import { createRating, findRatingById, updateRating, deleteRating } from "../services/ratingService";
import { generateResponse } from "../utils/Response";
import { Req } from "../interface/request";
import {ratingSchema} from '../utils/validation'

export const rateUser = async (
  req: Req,
  res: Response,
  next: NextFunction
) => {
  const { toUserId, score } = req.body;
  const fromUserId = req.user;

  try {
    const {error}  = ratingSchema.validate(req.body);
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

// Get rating
export const getRating = async (
  req: Req,
  res: Response,
  next: NextFunction
) => {
  const { ratingId } = req.body;

  try {
    const rating = await findRatingById(ratingId);
    if (!rating) {
      return generateResponse(res, 404, "Rating not found");
    }

    return generateResponse(res, 200, "Rating fetched successfully", {
      data: rating,
    });
  } catch (error) {
    console.error("Fetching rating failed:", error);
    next(error);
  }
};

// Update rating
// export const updateRatingById = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   const { ratingId } = req.body ;
//   const { score } = req.body;
//   const userId = req.userId;

//   try {
//     const rating = await findRatingById(ratingId);
//     if (!rating) {
//       return generateResponse(res, 404, "Rating not found");
//     }

//     if (rating.fromUserId.toString() !== userId) {
//       return generateResponse(res, 403, "Access denied");
//     }

//     rating.score = score;
//     await updateRating(rating);
//     return generateResponse(res, 200, "Rating updated successfully", {
//       data: rating,
//     });
//   } catch (error) {
//     console.error("Updating rating failed:", error);
//     next(error);
//   }
// };

// // Delete rating
// export const deleteRatingById = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   const { ratingId } = req.params;
//   const userId = req.userId;

//   try {
//     const rating = await findRatingById(ratingId);
//     if (!rating) {
//       return generateResponse(res, 404, "Rating not found");
//     }

//     if (rating.fromUserId.toString() !== userId) {
//       return generateResponse(res, 403, "Access denied");
//     }

//     await deleteRating(ratingId);
//     return generateResponse(res, 200, "Rating deleted successfully");
//   } catch (error) {
//     console.error("Deleting rating failed:", error);
//     next(error);
//   }
// };

// // Get all ratings for a user
// export const getAllRatingsForUser = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   const { userId } = req.params;

//   try {
//     const ratings = await getAllRatingsForUser(userId);
//     return generateResponse(res, 200, "Ratings fetched successfully", {
//       data: ratings,
//     });
//   } catch (error) {
//     console.error("Fetching ratings failed:", error);
//     next(error);
//   }
// };
