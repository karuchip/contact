const path = require('path')
const express = require("express");
const app = express();

// http://127.0.0.1/static/* へのアクセスを /public/*へのアクセスに変換する
app.use('/static', express.static(path.join(__dirname, 'public')))

// http://127.0.0.1/ へのアクセスはindex.htmlを返す
app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/public/index.html`);
});

app.get("/api/contact", (req, res) => {
  // TODO: お問い合わせエンドポイントを実装する
});

app.listen(3000, () => console.log("listening on port 3000"));
