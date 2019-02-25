'use strict';
const buttons = document.querySelector('.wrap-btns'),
      result = document.getElementById('counter');

result.innerHTML = localStorage.result ? localStorage.result : 0;
buttons.addEventListener('click', counter);

function counter(event) {
  if (event.target.id === 'increment') {
    result.innerHTML = +result.innerHTML + 1;
  } else if (event.target.id === 'decrement' && result.innerHTML > 0) {
    result.innerHTML = +result.innerHTML - 1;
  } else {
    result.innerHTML = 0;
  };
  localStorage.result = +result.innerHTML;
};