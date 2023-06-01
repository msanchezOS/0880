import express from "express";

import routes from "./api/routes/routes.js";
const app = express();

app.use(express.json({ extended: false }));

app.use("/api", routes);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server is running in port ${PORT}`));
