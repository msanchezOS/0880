import express from "express";
import cors from "cors";

import routes from "./api/routes/routes.js";
const app = express();

app.use(express.json({ extended: false }));

// Configurar CORS
const corsOptions = {
  origin: "https://arsbancocentral.org.do",
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};
app.use(cors(corsOptions));

app.use("/api", routes);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
