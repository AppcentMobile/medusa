import { Router } from "express"
import middlewares from "../../../middlewares"

const route = Router()

export default (app) => {
  app.use("/role", route)

  route.post("/", middlewares.wrap(require("./create-role").default))
  route.get("/:id", middlewares.wrap(require("./get-role").default))

  return app
}
