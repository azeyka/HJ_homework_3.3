'use strict';
const btns = document.querySelectorAll('.button');
Array.from(btns).forEach((btn) => {
  btn.addEventListener('click', sendRequest);
});

function sendRequest(event) {
  event.preventDefault();
  const xhr = new XMLHttpRequest();
  xhr.addEventListener('load', onLoad);  
  
  let form, msgPart;
  if (event.target.value === 'Войти') {
    xhr.open('POST', 'https://neto-api.herokuapp.com/signin');
    form = document.querySelector('.sign-in-htm');
    msgPart = ' успешно авторизован';
  } else {
    xhr.open('POST', 'https://neto-api.herokuapp.com/signup');
    form = document.querySelector('.sign-up-htm');
    msgPart = ' успешно зарегистрирован';
  };
  
  const msgTag = form.querySelector('.error-message'),
        data = {};

  for (const [key, value] of new FormData(form)) {
    data[key] = value;
  };
  
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.send(JSON.stringify(data));
  
  function onLoad() {
    let response;
    try {
      response = JSON.parse(xhr.response);
    } catch (e) {
      response = {
        error: true,
        message: 'Ошибка данных, попробуйте снова'
      };
    };
    
    msgTag.innerHTML = response.error ? response.message : 'Пользователь ' + response.name + msgPart;
  };
};