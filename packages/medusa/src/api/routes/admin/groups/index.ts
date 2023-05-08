import { Router } from "express"
import middlewares from "../../../middlewares"

const route = Router()

export default (app) => {
  app.use("/group", route)

  // route.post("/", middlewares.wrap(require("./create-group").default))

  return app
}
