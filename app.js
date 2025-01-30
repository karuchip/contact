const path = require("path")
const express = require("express");
const app = express();

app.use("/static", express.static(path.join(__dirname, "public")));
// POSTリクエストのリクエストボディを取り出すために必要な設定
app.use(express.json());

app.get("/", (req, res) => {
  res.sendFile(`${__dirname}/public/index.html`);
});

function buildMessage({ email, name }) {
  return {
    personalizations: [
      {
        to: [{ email, name, }],
      },
    ],
    from: {
      email: "hikaru.-27-@outlook.jp",
      name: "Hikaru Hatakeyama",
    },
    subject: "お問い合わせありがとうございます",
    content: [
      {
        type: "text/plain",
        value: [
          `${name}様`,
          "",
          "お問い合わせいただき、誠にありがとうございます。",
          "このメールは、システムによる自動返信であり、お問い合わせを受け付けたことをお知らせするものです。",
          "お問い合わせ内容につきましては、担当者が確認の上、改めてご連絡させていただきます。",
          "",
          "通常、1営業日以内には回答を差し上げておりますが、内容によっては少々お時間をいただく場合がございます。",
        ].join("\n"),
      },
    ],
  }
};

async function sendContact(contact) {
  await fetch(
    "https://njgp5or6t5.microcms.io/api/v1/contact",
    {
      method: "POST",
      headers: {
        "X-MICROCMS-API-KEY": process.env.MICROCMS_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(contact),
    }
  );
}

async function sendMail({ email, name }) {

  const message = buildMessage({ email, name });

  //send grid公式ドキュメントを参考（ポテパンのガイドはコメントアウト）
  const sgMail = require('@sendgrid/mail')
  sgMail.setApiKey(process.env.SENDGRID_API_KEY)
  sgMail
    .send(message)
    .then(()=> {
      console.log('Email sent')
    })
    .catch((error) => {
      console.log(error)
    })

  // const resp = await fetch("https://api.sendgrid.com/v3/mail/send", {
  //   method: "POST",
  //   headers: {
  //     "Content-Type": "application/json",
  //     Authorization: `Bearer ${process.env.SENDGRID_API_KEY}`,
  //   },
  //   body: JSON.stringify(message),
  // });
}

app.post("/api/contact", async (req, res) => {
  const contact = req.body

  await sendContact(contact)
  await sendMail({ email: contact.email, name: contact.name })
  res.json({})
});


app.listen(3000, () => console.log("listening on port 3000"));

