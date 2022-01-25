const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const User = require('../../model/User');
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const config = require('config')

// @route GET api/auth
// @desc Test route
// @access Public

router.get('/', auth,  async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (error) {
        return res.status(500).send('server error');
    }
})


// @route POST api/login
// @desc login route
// @access public

router.post(
    '/login',
    [
        check('email', 'Please include a valid email address').isEmail(),
        check('password', 'Password is required').exists()
    ],
    async (req, res) => {
        const errors = validationResult(req.body);
        if(!errors.isEmpty()){
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;
        try {

            const user = await User.findOne({ email });

            if(!user){
                return res.status(400).json({errors: [{msg: 'Invalid Credentials' }]})
            }

            const isMatch = await bcrypt.compare(password, user.password);

            if(!isMatch){
                res.status(400).json({ errors: [{msg: 'Invalid Credentials' }] });
            }

            const payload = {
                id: user.id
            }

            jwt.sign(
                payload,
                config.get('jwtSecret'),
                {expiresIn: 100000},
                (err, token) =>{
                    if(err){
                        throw err;
                    }
                    res.json({ token });
                }
            );
        } catch (error) {
            console.log(error);
            res.status(500).send('Server error');
        }
    }
)


module.exports = router;
