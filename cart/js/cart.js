'use strict';
const colorsTag = document.getElementById('colorSwatch'),
      sizesTag = document.getElementById('sizeSwatch'),
      addToCartButton = document.getElementById('AddToCart'),
      addToCartForm = document.getElementById('AddToCartForm'),
      links = [
        'https://neto-api.herokuapp.com/cart/colors',
        'https://neto-api.herokuapp.com/cart/sizes'
      ];
      
addToCartButton.addEventListener('click', addToCart);
links.forEach((link) => {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', link);
  xhr.send();
  xhr.addEventListener('load', onLoad);
});

function onLoad(event) {
  try{
    const response = JSON.parse(event.target.responseText);
    if (event.target.responseURL.includes('colors')) {
      addColors(response);
    } else if (event.target.responseURL.includes('sizes')) {
      addSizes(response);
    } else {
      refreshCart(response);
    };  
  } catch (e) {
    console.log('Ошибка JSON');
  }; 
};

function addColors(data){
  data.forEach((color) => {
    const colorSnippet = `
      <div data-value="${color.type}" class="swatch-element color ${color.type} ${color.isAvailable ? "available" : "soldout"}">
        <div class="tooltip">${color.title}</div>
        <input quickbeam="color" id="swatch-1-${color.type}" type="radio" name="color" value="${color.type}" ${color.isAvailable ? "" : "disabled"}" ${localStorage.color === color.type ? "checked" : ""}>
        <label for="swatch-1-${color.type}" style="border-color: ${color.type};">
          <span style="background-color: ${color.code};"></span>
          <img class="crossed-out" src="https://neto-api.herokuapp.com/hj/3.3/cart/soldout.png?10994296540668815886">
        </label>
      </div>
    `;
    colorsTag.innerHTML += colorSnippet;
  });
  Array.from(colorsTag.getElementsByClassName('color')).forEach((color) => {
    color.addEventListener('click', (event) => {
      if (!event.currentTarget.classList.contains('available')) {
        event.preventDefault();
      } else {
        const currentInput = event.currentTarget.querySelector('input'),
              inputs = colorsTag.querySelectorAll('input');
        Array.from(inputs).forEach((input) => {
          input === currentInput ? input.setAttribute('checked', 'checked') : input.removeAttribute('checked')
        });
        localStorage.color = currentInput.value;
      };
    });
  });
};

function addSizes(data){
  data.forEach((size) => {
    const sizeSnippet = `<div data-value="${size.type}" class="swatch-element plain ${size.type} ${size.isAvailable ? "available" : "soldout"}">
                      <input id="swatch-0-${size.type}" type="radio" name="size" value="${size.type}" ${size.isAvailable ? "" : "disabled"}" ${localStorage.size === size.type ? "checked" : ""}>
                      <label for="swatch-0-${size.type}">
                        ${size.title}
                        <img class="crossed-out" src="https://neto-api.herokuapp.com/hj/3.3/cart/soldout.png?10994296540668815886">
                      </label>
                    </div>`;
    sizesTag.innerHTML += sizeSnippet;
  });
  Array.from(sizesTag.getElementsByClassName('plain')).forEach((size) => {
    size.addEventListener('click', (event) => {
      if (!event.currentTarget.classList.contains('available')) {
        event.preventDefault();
      } else {
        const currentInput = event.currentTarget.querySelector('input'),
              inputs = colorsTag.querySelectorAll('input');
        Array.from(inputs).forEach((input) => {
          input === currentInput ? input.setAttribute('checked', 'checked') : input.removeAttribute('checked')
        });
        localStorage.size = currentInput.value;
      };
    });
  });
};

function addToCart(event) {
  event.preventDefault();
  const formData = new FormData(addToCartForm),
        xhr = new XMLHttpRequest();
  formData.append('productId', addToCartForm.dataset.productId);
  xhr.open('POST', 'https://neto-api.herokuapp.com/cart');
  xhr.send(formData);
  xhr.addEventListener('load', onLoad);
};

function refreshCart(cartData) {
  const cartTag = document.getElementById('quick-cart'),
        cartSnippet = document.getElementById('quick-cart-pay');
  cartTag.innerHTML = '';
  let totalPrice = 0;
  cartData.forEach((data) => {
    const itemSnippet = `
    <div class="quick-cart-product quick-cart-product-static" id="quick-cart-product-${data.productId}" style="opacity: 1;">
      <div class="quick-cart-product-wrap">
        <img src="${data.pic}" title="${data.title}">
        <span class="s1" style="background-color: #000; opacity: .5">$${data.price}</span>
        <span class="s2"></span>
      </div> 
      <span class="count hide fadeUp" id="quick-cart-product-count-${data.productId}">${data.quantity}</span>
      <span class="quick-cart-product-remove remove" data-id="${data.productId}"></span>
    </div>
    `;
    cartTag.innerHTML += itemSnippet;
    totalPrice += data.price * data.quantity;
  });
  
  const itemsInCart = cartTag.getElementsByClassName('quick-cart-product')
  itemsInCart.length === 0 ? hideCartSnippet() : showCartSnippet();
  
  function showCartSnippet() {
    const removeButtons = cartTag.getElementsByClassName('remove'),
          cartSnippetExample = `
            <a id="quick-cart-pay" quickbeam="cart-pay" class="cart-ico open">
              <span>
                <strong class="quick-cart-text">Оформить заказ<br></strong>
                <span id="quick-cart-price">$${totalPrice}</span>
              </span>
            </a>`;
    
    cartTag.innerHTML += cartSnippetExample;
    Array.from(removeButtons).forEach((button) => {
      button.addEventListener('click', removeFromCart);
    });
  };
  
  function hideCartSnippet() {
    cartSnippet.classList.remove('open');
  };
};

function removeFromCart(event) {
  const itemToRemoveForm = new FormData ();
  itemToRemoveForm.append('productId', event.currentTarget.dataset.id);
  fetch('https://neto-api.herokuapp.com/cart/remove', {
    body : itemToRemoveForm,
    method: 'POST'
  })
    .then((res) => {
      if (200 <= res.status && res.status < 300) {
        return res;
      }
      throw new Error(response.statusText);
    })
    .then((res) => {return res.json();})
    .then((data) => {refreshCart(data)})
    .catch((error) => {console.log('Ошибка при удалении')});
};