const { User, Thought } = require('../models');

const userController = {

    // GET Users
    getUsers(req, res) {
        User.find()
            .select('-__v')
            .then((data) => { res.json(data) })
            .catch((err) => {
                console.log(err);
                res.status(500).json(err);
            });
    },

    // GET User by ID
    getSingleUser(req, res) {
        User.findOne({ _id: req.params.userId })
            .select('-__v')
            .populate('friends')
            .populate('thoughts')
            .then((data) => {
                if (!data) { return res.status(404) }
                res.json(data);
            })
            .catch((err) => {
                console.log(err);
                res.status(500).json(err);
            });
    },

    // CREATE User
    createUser(req, res) {
        User.create(req.body)
            .then((data) => { res.json(data) })
            .catch((err) => {
                console.log(err);
                res.status(500).json(err);
            });
    },


    // UPDATE User
    updateUser(req, res) {
        User.findOneAndUpdate(
            { _id: req.params.userId },
            {
                $set: req.body,
            },
            {
                runValidators: true,
                new: true,
            }
        )
            .then((data) => {
                if (!data) { return res.status(404) }
                res.json(data);
            })
            .catch((err) => {
                console.log(err);
                res.status(500).json(err);
            });
    },


    // DELETE User
    deleteUser(req, res) {
        User.findOneAndDelete({ _id: req.params.userId })
            .then((data) => {
                if (!data) { return res.status(404) }
                return;
            })
            .then(() => { res.json({ message: 'User Deleted' })
            })
            .catch((err) => {
                console.log(err);
                res.status(500).json(err);
            });
    },


    // ADD Friend
    addFriend(req, res) {
        User.findOneAndUpdate({ _id: req.params.userId }, { $addToSet: { friends: req.params.friendId } }, { new: true })
            .then((data) => {
                if (!data) {
                    return res.status(404).json({ message: 'No user with this id!' });
                }
                res.json(data);
            })
            .catch((err) => {
                console.log(err);
                res.status(500).json(err);
            });
    },
    // remove friend from friend list
    removeFriend(req, res) {
        User.findOneAndUpdate({ _id: req.params.userId }, { $pull: { friends: req.params.friendId } }, { new: true })
            .then((data) => {
                if (!data) {
                    return res.status(404).json({ message: 'No user with this id!' });
                }
                res.json(data);
            })
            .catch((err) => {
                console.log(err);
                res.status(500).json(err);
            });
    },
};

module.exports = userController;
