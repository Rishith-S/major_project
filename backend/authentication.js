const express = require('express')
const User = require('../backend/models/user')
const bcrypt = require('bcrypt')
const app = express.Router()
const jwt = require("jsonwebtoken")

app.post('/login',async (req,res)=>{
    const { username, password } = req.body
    if(!username || !password) return res.status(400).json({message:"All Fields are required"})
    const user = await User.findOne({username})
    if(!user){
        res.status(401).json({message:"User not found"})
        return
    }
    const match = await bcrypt.compare(password,user.password);
    if(!match) return res.status(401).json({ message: "Invalid credentials" });

    const accesstoken = jwt.sign(
      {
        username
      },
      process.env.ACCESS_TOKEN_SECRET, ({ expiresIn: '1d' })
    )
    const refreshtoken = jwt.sign(
      {
        username
      },
      process.env.REFRESH_TOKEN_SECRET, ({ expiresIn: '3d' })
    )
    user.refreshToken = refreshtoken
    await user.save()
    res.cookie('jwt', refreshtoken, { httpOnly: true, sameSite: 'None', secure: true, maxAge: 24 * 60 * 60 * 1000 });
    res.send({accesstoken});
})

app.post('/signup',async (req,res)=>{
    const {name,username,password} = req.body
    if(!name || !username || !password)return res.status(401).json({message:"Enter full details"})
    try {
        const bcryptedPassword = await bcrypt.hash(password,10)
        await User.create({
            name,
            username,
            password:bcryptedPassword
        })
        return res.status(200).send({message:"user created"})
    } catch (error) {
        console.log(error)
        return res.status(500).json({message:"internal server error"})
    }
})

app.get('/refresh',async (req,res)=>{
    const token = req.cookies?.jwt;
    if (!token) return res.sendStatus(401);
    let decodedToken = jwt.decode(token);
    let username = decodedToken.username
    const user = await User.findOne({username})
    if(!user)return res.sendStatus(403);
    jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
        if (err || user.username !== decoded.username) return res.sendStatus(403);
        const accessToken = jwt.sign(
          {
            "username": user.username
          },
          process.env.ACCESS_TOKEN_SECRET,
          {
            expiresIn: '1d'
          }
        );
        res.send({ id:user._id,username: user.username, accessToken});
    })
});

app.get('/logout',async (req,res)=>{
  const token = req.cookies?.jwt;
  if (!token) return res.sendStatus(204);
  const decodedToken = jwt.decode(token);
  let user = await User.findOne({refreshToken:decodedToken.refreshToken})
  if(!user){
      res.clearCookie('jwt',{httpOnly:true,sameSite:'None',secure:true,maxAge: 3* 24 * 60 * 60 * 1000});
      return res.sendStatus(204);
  }
  user.refreshToken='';
  await user.save();
  res.clearCookie('jwt',{httpOnly:true,sameSite:'None',secure:true,maxAge:3* 24 * 60 * 60 * 1000});
  return res.sendStatus(204);
})


module.exports = app