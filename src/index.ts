import express, { Request, Response } from "express";
import connectDB from "./config/dbConfig";
import userRoutes from "./routes/userRoutes";
import config from "./config/config";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import SwaggerDocument from "../swagger.json";

const CSS_URL =
  "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.1.0/swagger-ui.min.css";

const app = express();
app.use(cors());
app.use(express.json());
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(SwaggerDocument, { customCssUrl: CSS_URL })
);

connectDB();

app.get("/", (req: Request, res: Response) => {
  res.send("APi for user REgistration");
});
app.use("/api", userRoutes);

const PORT = config.PORT;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
