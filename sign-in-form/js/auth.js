'use strict';
const btns = document.querySelectorAll('.button');
Array.from(btns).forEach((btn) => {
  btn.addEventListener('click', sendRequest);
});

function sendRequest(event) {
  event.preventDefault();
  let url, form;
  
  if (event.target.value === 'Войти') {
    form = document.querySelector('.sign-in-htm');
    url = 'https://neto-api.herokuapp.com/signin';
  } else {
    form = document.querySelector('.sign-up-htm');
    url = 'https://neto-api.herokuapp.com/signup';
  };
  
  const msgTag = form.querySelector('.error-message');
  
  fetch(url, {
    body: formToJSON(form),
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
  })
  .then((res) => {
    if (200 <= res.status && res.status < 300) {
      return res;
    };
    throw new Error(res.statusText);
  })
  .then((res) => { return res.json(); })
  .then((data) => {  
      if ('error' in data) {
        msgTag.innerHTML = data.message;
      } else {
        msgTag.innerHTML = event.target.value === 'Войти' ? `Пользователь ${data.name} успешно авторизован` 
                                                          : `Пользователь ${data.name} успешно зарегистрирован`;
      };
    })
  .catch((error) => { console.log(error) });
};

function formToJSON(form) {
  const data = {};
  for (const [key, value] of new FormData(form)) {
    data[key] = value;
  };
  return JSON.stringify(data);
}
