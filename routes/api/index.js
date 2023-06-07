const router = require("express").Router();
const thoughtRoutes = require("./thought-routes");
const userRoutes = require("./user-routes");

//middleware for routes
router.use("/thoughts", thoughtRoutes);
router.use("/users", userRoutes);

module.exports = router;
