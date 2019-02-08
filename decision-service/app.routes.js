import { Router } from "express";

import decisionRoutes from "./endpoints/decision/decision.route";

export default Router()
  /** GET /health-check - Check service health */
  .get("/health-check", (req, res) =>
    res.send("LBLOD Blockchain decision service up and running!")
  )
  .use("/decision", decisionRoutes);
