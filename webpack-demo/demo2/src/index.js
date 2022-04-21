// import $ from 'jquery';
import './style.less';
function component() {
  const element = document.createElement('div');

  element.innerHTML = 'Hello 11 webpack'
  element.classList.add('hello');

  return element;
}
// console.log($, 'jquery')
document.body.appendChild(component());
