const router = require("express").Router();
const apiRoutes = require("./api");

//uses the middleware set out in the api routes folder
router.use("/api", apiRoutes);
//uses a request and result to sdend a 404 if an error occurs.
router.use((req, res) => {
  res.status(404).send("<h1>404 error!</h1>");
});

//globally exports router
module.exports = router;
