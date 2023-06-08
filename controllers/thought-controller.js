const { Thought, User } = require("../models");

// Get all thoughts
const thoughtController = {
  //takes the two paramaters request and repsonse
  getAllThought(req, res) {
    //.find is used to find all in the database
    Thought.find({})
      //.populate populates the reactions field of each thought with the reaction data in database
      .populate({
        path: "reactions",
        select: "-__v",
      })
      //.select excludes the __v field from retrived thoughts
      .select("-__v")
      //.sort sorts in decending order based on id
      .sort({ _id: -1 })
      //.then uses the retrieved thoughts as a parameter and sends them as a JSON
      .then((dbThoughtData) => res.json(dbThoughtData))
      //.catch is used as our error handler which is also console logged
      .catch((err) => {
        console.log(err);
        res.sendStatus(400);
      });
  },

  //Get a single thought by using ID
  getThoughtById({ params }, res) {
    Thought.findOne({ _id: params.id })
      .populate({
        path: "reactions",
        select: "-__v",
      })
      .select("-__v")
      .then((dbThoughtData) => {
        if (!dbThoughtData) {
          return res
            .status(404)
            .json({ message: "There was no thought found for this id" });
        }
        res.json(dbThoughtData);
      })
      .catch((err) => {
        console.log(err);
        res.sendStatus(400);
      });
  },

  //creates a new thought
  createThought({ params, body }, res) {
    Thought.create(body)
      .then(({ _id }) => {
        //.findOneAndUpdate is thr query to find the user with that id
        return User.findOneAndUpdate(
          { _id: body.userId },
          //push adds the id of the created thought to the thoughts array of the user
          { $push: { thoughts: _id } },
          //indicates that the updated data should be returned
          { new: true }
        );
      })
      .then((dbUserData) => {
        if (!dbUserData) {
          return res.status(404).json({
            message: "Thought has been created, but no user id was found",
          });
        }
        res.json({ message: "Thought created successfully!" });
      })
      .catch((err) => {
        console.log(err);
        res.json(err);
      });
  },

  //updates a current thought
  updateThought({ params, body }, res) {
    Thought.findOneAndUpdate({ _id: params.id }, body, {
      new: true,
      //specifies that the update operation should run validators from the model which are also set in the schema
      runValidators: true,
    })
      .then((dbThoughtData) => {
        if (!dbThoughtData) {
          return res
            .status(404)
            .json({ message: "No thought found with this id" });
        }
        res.json(dbThoughtData);
      })
      .catch((err) => {
        console.log(err);
        res.json(err);
      });
  },

  //deletes a thought
  deleteThought({ params }, res) {
    Thought.findOneAndDelete({ _id: params.id })
      .then((dbThoughtData) => {
        //checks if db data is falsy then returns 404 response
        if (!dbThoughtData) {
          return res
            .status(404)
            .json({ message: "There has been no thought found with this id" });
        }
        return User.findOneAndUpdate(
          { thoughts: params.id },
          //uses pull to remove the params id from the thoughts array of the user
          { $pull: { thoughts: params.id } },
          { new: true }
        );
      })
      .then((dbUserData) => {
        if (!dbUserData) {
          return res.status(
            (404).json({
              message: "Thought has been created, but no user id was found",
            })
          );
        }
        res.json({ message: "Thought deleted successfully" });
      })
      .catch((err) => res.json(err));
  },

  //adds a reaction
  addReaction({ params, body }, res) {
    Thought.findOneAndUpdate(
      { _id: params.thoughtId },
      //uses MongoDB update operator that adds an element to a field of arrays if it doesn't already exist.
      //this adds the body to the reactions array
      { $addToSet: { reactions: body } },
      { new: true, runValidators: true }
    )
      .then((dbThoughtData) => {
        if (!dbThoughtData) {
          res.status(404).json({ message: "No thought with this id" });
          return;
        }
        res.json(dbThoughtData);
      })
      .catch((err) => res.json(err));
  },
  //removes a reaction
  removeReaction({ params }, res) {
    Thought.findOneAndUpdate(
      { _id: params.thoughtId },
      { $pull: { reactions: { reactionId: params.reactionId } } },
      { new: true }
    )
      .then((dbThoughtData) => res.json(dbThoughtData))
      .catch((err) => res.josn(err));
  },
};

module.exports = thoughtController;
