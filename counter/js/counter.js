'use strict';
const buttons = document.querySelector('.wrap-btns'),
      result = document.getElementById('counter');

result.innerHTML = localStorage.result ? localStorage.result : 0;
buttons.addEventListener('click', counter);

function counter(event) {
  if (event.target.id === 'increment') {
    localStorage.result++;
  } else if (event.target.id === 'decrement' && result.innerHTML > 0) {
    localStorage.result--;
  } else {
    localStorage.result = 0;
  };
  
  result.innerHTML = localStorage.result;
};