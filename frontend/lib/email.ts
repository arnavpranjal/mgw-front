import { Backend_URL } from "./Constants";

export const sendEmail = (
  email: string,
  name: string,
  password: string,
  domain: string
) => {
  fetch(Backend_URL + "/emailer/onboard", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: email,
      name: name,
      password: password,
      domain: domain,
    }),
  })
    .then((res) => res.json())
    .then((data) => console.log(data));
};


export const sendRest = (
    email: string,
    name: string,
    password: string,
    domain: string
  ) => {
    fetch(Backend_URL + "/emailer/reset", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        name: name,
        password: password,
        domain: domain,
      }),
    })
      .then((res) => res.json())
      .then((data) => console.log(data));
  };
  
