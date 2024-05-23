
import { Request, Response, NextFunction } from 'express';
import { generateResponse } from '../utils/Response';


const validRoutes:String[]=[ 
    "/register", 
    "/login", 
    "/userdetails", 
    "/rateuser", 
    "/updaterating",
    "/deleterating",
    "/getratings", 
]



export const checkRoutes = (req: Request, res: Response, next: NextFunction) => {
  const requestedRoute = req.path;

  if (!validRoutes.includes(requestedRoute)) {
    return generateResponse(res,404,"Invalid routes or endpoint check your endpoint")
  }

  next();
};
