import { Router } from "express";

import certificateRoutes from "./endpoints/certificate/certificate.route";

export default Router()
  .get("/health-check", (req, res) =>
    res
      .status(200)
      .send({ msg: "LBLOD Blockchain authentication service up and running!" })
  )
  .use("/certificate", certificateRoutes);
