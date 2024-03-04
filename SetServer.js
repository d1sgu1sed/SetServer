const express = require("express");
const server = express();
server.use(express.json());

const axios = require('axios');


const tokens = require("jsonwebtoken");

let users = [];
let cards = [];
let game_board = [];

let id = 0;
for (let color = 1; color < 4; color++) {
  for (let count = 1; count < 4; count++) {
    for (let shape = 1; shape < 4; shape++) {
      for (let fill = 1; fill < 4; fill++) {
        cards.push({ id, count, color, shape, fill });
        id++;
      }
    }
  }
}

shuffle(cards);

for (let i = 0; i < 12; i++)
  game_board.push(cards.shift());

function addToBoard() {
  for (let i = 0; i < Math.min(3, cards.length); i++)
    game_board.push(cards.shift());
}

function isSet(cards) {
  if (cards.length === 3) {
    const a = cards[0];
    const b = cards[1];
    const c = cards[2];

    const colorCh = (a.color === b.color && b.color === c.color) ||
      (a.color !== b.color && c.color !== b.color && a.color !== c.color);

    const shapeCh = (a.shape === b.shape && b.shape === c.shape) ||
      (a.shape !== b.shape && c.shape !== b.shape && a.shape !== c.shape);

    const countCh = (a.count === b.count && b.count === c.count) ||
      (a.count !== b.count && c.count !== b.count && a.count !== c.count);

    const fillCh = (a.fill === b.fill && b.fill === c.fill) ||
      (a.fill !== b.fill && c.fill !== b.fill && a.fill !== c.fill);

    if (colorCh && shapeCh && countCh && fillCh)
      return true;
    else
      return false;

  } else {
    return false;
  }
}

server.post("/user/register", async (params, answer) => {
  try {
    const { name, pass } = params.body;
    if (!name || !pass)
      return answer.status(400).json({ status: "error", message: "Введите данные пользователя!" });

    if (users.find(user => user.name === name))
      return answer.status(400).json({ status: "error", message: "Пользователь с таким именем уже существует" });

    const token = tokens.sign({ name }, "somekey");
    const user = { name: name, token: token, pts: 0 };
    users.push(user);

    answer.json({ status: "ok", token: token });
    // answer.json({user: user});
  } catch (err) {
    console.log(err);
    answer.status(500).json({
      status: "error",
      message: "Ошибка на сервере"
    });
  }

});

server.post("/user/register", async (params, answer) => {

});

server.get("/", async (params, answer) => {
  answer.send("<h1>Главная страница</h1>");
});

server.listen(5000, () => console.log("Запущен на порте 5000"));


// const userData = {
//   name: 'us',
//   pass: 'password123'
// };

// axios.post('http://localhost:5000/user/register', userData)
//   .then(response => {
//     console.log(response.data); // Выводим ответ от сервера
//   })
//   .catch(error => {
//     console.error('Ошибка:', error);
//   });

