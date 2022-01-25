const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const config = require('config')



//  Get User schema

const User = require('../../model/User');
const { Mongoose } = require('mongoose');

// @route POST api/users
// @desc Test route'
// @access Public

router.post('/register', [
    check('name', 'Name is required')
        .not()
        .isEmpty(),
    check('email', 'Please enter a valid email address').isEmail(),
    check(
        'password',
        'Please provide a password with 6 or more characters'
    ).isLength({ min: 6 })
],
    async (req, res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({errors: errors.array()});
        }

        const { name, email, password } = req.body;
        try {
            let user = await User.findOne({ name });

            if(user){
                return res.status(400).json({ errors: [{'msg': 'User already exists'}] })
            }

            const avatar = gravatar.url(email, {
                s: '200',
                r: 'pg',
                d: 'mm'
            })

            user = new User({
                name,
                email,
                avatar,
                password
            })

            const salt  = await bcrypt.genSalt(10);

            user.password = await bcrypt.hash(password, salt);

            await user.save();
            
            const payload = {
                id: user.id
            }

            jwt.sign(
                payload,
                config.get('jwtSecret'),
                {expiresIn: 100000},
                (err, token)=>{
                    if(err){
                        throw err;
                    }
                    res.json({ token })
                }
            )

        } catch (error) {
            console.log(error.message);
            res.status(500).send('server error')
        }
    })

module.exports = router;
