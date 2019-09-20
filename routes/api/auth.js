const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const auth = require('../../middleware/auth');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');

const User = require('../../models/User');

// @route   GET api/auth
// @desc    Test route (temp)
// @access  Public
router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/auth
// @desc    Authenticate user & get token
// @access  Public
router.post(
    '/',
    [
        check('email', 'Please include a valid email address').isEmail(),
        check('password', 'Password is required').exists()
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body; // Desctructures req.body so we don't have to keep typing it

        try {
            let user = await User.findOne({ email });

            // See if User exists
            if (!user) {
                return res
                    .status(400)
                    .json({ errors: [{ msg: 'Invalid Credentials' }] });
            }

            // the hashed password from the db using the .compare method in bcrypt
            const isMatch = await bcrypt.compare(password, user.password)

            if (!isMatch) {
                return res
                    .status(400)
                    .json({ errors: [{ msg: 'Invalid Credentials' }] });
            }

            // Compares the plain text user input password to


            // Return JSON Web Token

            // Stores the payload for the jwt grabbing the id from the User 
            const payload = {
                user: {
                    id: user.id
                }
            }

            // Sign JWT
            jwt.sign(
                payload, // Passes in the payload
                config.get('jwtSecret'), // Passes in the Secret
                { expiresIn: 360000 }, // Sets an expiration period (Need to change back to 3600 (1 hour))
                (err, token) => {
                    if (err) throw err;
                    res.json({ token }); // If no err, send token back to client
                });

        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }

    }
);

module.exports = router;
