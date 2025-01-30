
    const formEl = document.getElementById("contact-form");
    const buttonEl = document.getElementById("submit");
    const checkboxEl = document.getElementById("agree");

    async function sendContact(entries) {
      const response = await fetch(
        "https://njgp5or6t5.microcms.io/api/v1/contact", // ご自身のAPIエンドポイントを指定してください
        {
          method: "POST",
          headers: {
            "X-MICROCMS-API-KEY": process.env.MICROCMS_API_KEY,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(entries),
        }
      );

      const data = await response.json();
      console.log(data);
    }

    checkboxEl.addEventListener("change", (evt) => {
      checkboxEl.checked
        ? buttonEl.removeAttribute("disabled")
        : buttonEl.setAttribute("disabled", true);
    });

    formEl.addEventListener("submit", (evt) => {
      evt.preventDefault();

      const formData = new FormData(formEl);
      const {
        subject,
        name,
        company,
        email,
        content
      } = Object.fromEntries(formData.entries());

      sendContact({
        subject: [subject],
        name,
        company,
        email,
        content
      })
    });
