const express = require("express");
const server = express();
server.use(express.json());

const tokens = require("jsonwebtoken");

let users = [];

server.post("/user/register", async (params, answer) => {
  try {
    const {name, pass} = req.params;
    if(!name || !pass)
      return answer.status(400).json({status:"error", message:"Введите данные пользователя!"});

    if (users.find(user => user.name === name))
      return res.status(400).json({message:'Пользователь с таким именем уже существует'});

    const token = tokens.sign({name}, "somekey");
    const user = { name: name , token: token, pts: 0};
    users.push(user);

    answer.json({status: "ok", token: token});
  } catch(err){
    console.log(err);
    res.status(500).json({
      status: "error",
    });
  }

});
