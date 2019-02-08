import { Router } from "express";
import validate from "express-validation";

import { createScheme, retrieveScheme } from "./certificate.param.validation";
import certificateCtrl from "./certificate.controller";

const router = Router();
router.route("/create").post(validate(createScheme), certificateCtrl.create);
router
  .route("/retrieveKey")
  .post(validate(retrieveScheme), certificateCtrl.retrieveKey);

export default router;
