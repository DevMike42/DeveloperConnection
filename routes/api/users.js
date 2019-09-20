const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');

// Brings in User Model
const User = require('../../models/User');

// @route   POST api/users
// @desc    Register User
// @access  Public
router.post(
    '/',
    [
        check('name', 'Name is required')
            .not()
            .isEmpty(),
        check('email', 'Please include a valid email address')
            .isEmail(),
        check('password', 'Please enter a password contianing more than 6 characters')
            .isLength({ min: 6 })
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, email, password } = req.body; // Desctructures req.body so we don't have to keep typing it

        try {
            let user = await User.findOne({ email });

            // See if User exists
            if (user) {
                return res.status(400).json({ errors: [{ msg: 'User already exists' }] });
            }

            // Get User's Gravatar
            const avatar = gravatar.url(email, {
                s: '200', // size
                r: 'pg', // rating 
                d: 'mm' // default image
            })

            // Creates User
            user = new User({
                name,
                email,
                avatar,
                password
            });

            // Encrypt (Hash) password using bcrypt
            const salt = await bcrypt.genSalt(10); // Creates salt to do the hashing with (10 rounds)

            user.password = await bcrypt.hash(password, salt); // Combines the password and salt

            // Save User in DB
            await user.save();

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
