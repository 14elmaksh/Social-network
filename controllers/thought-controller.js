const { Thought, User } = require('../models');

const thoughtController = {

    // GET  Thoughts
    getThoughts(req, res) {
        Thought.find()
            .sort({ createdAt: -1 })
            .then(data => res.json(data))
            .catch(err => {
                console.log(err);
                res.status(500).json(err);
            });
    },

    // GET Thoughts By ID
    getSingleThought(req, res) {
        Thought.findOne({ _id: req.params.thoughtId })
            .then((data) => {
                if (!data) { return res.status(404) }
                res.json(data);
            })
            .catch((err) => {
                console.log(err);
                res.status(500).json(err);
            });
    },

    // CREATE Thought
    createThought(req, res) {
        Thought.create(req.body)
            .then(data => {
                return User.findOneAndUpdate(
                    { _id: req.body.userId },
                    { $push: { thoughts: data._id } },
                    { new: true }
                );
            })
            .then((userData) => {
                if (!userData) { return res.status(404)}
                res.json({ message: 'Thought created' });
            })
            .catch((err) => {
                console.log(err);
                res.status(500).json(err);
            });
    },

    // UPDATE Thought
    updateThought(req, res) {
        Thought.findOneAndUpdate({ _id: req.params.thoughtId }, { $set: req.body }, { runValidators: true, new: true })
            .then(data => {
                if (!data) {
                    return res.status(404);
                }
                res.json(data)
            })
            .catch(err => {
                console.log(err);
                res.status(500).json(err);
            });
    },

    // DELETE Thought
    deleteThought(req, res) {
        Thought.findOneAndRemove({ _id: req.params.thoughtId })
            .then((data) => {
                if (!data) { return res.status(404) }

                return User.findOneAndUpdate(
                    { thoughts: req.params.thoughtId },
                    { $pull: { thoughts: req.params.thoughtId } },
                    { new: true }
                );
            })
            .then((userData) => {
                if (!userData) {
                    return res.status(404);
                }
            })
            .catch((err) => {
                console.log(err);
                res.status(500).json(err);
            });
    },

    // CREATE Reaction
    addReaction(req, res) {
        Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $addToSet: { reactions: req.body } },
            { runValidators: true, new: true }
        )
            .then(data => {
                if (!data) {
                    return res.status(404)
                }
                res.json(data);
            })
            .catch(err => {
                console.log(err);
                res.status(500).json(err);
            });
    },
    
    // DELETE Reaction
    removeReaction(req, res) {
        Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $pull: { reactions: { reactionId: req.params.reactionId } } },
            { runValidators: true, new: true }
        )
            .then((data) => {
                if (!data) {
                    return res.status(404).json({ message: 'No thought with this id!' });
                }
                res.json(data);
            })
            .catch(err => {
                console.log(err);
                res.status(500).json(err);
            })
    }
};

module.exports = thoughtController;
