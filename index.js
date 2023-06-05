import express from "express";
import cors from "cors";

import routes from "./api/routes/routes.js";
const app = express();

app.use(express.json({ extended: false }));

app.use(cors()); // Utiliza el middleware cors


app.use("/api", routes);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
