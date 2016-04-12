const ul = document.querySelector('ul');

export const log = (msg) => {
  const li = document.createElement('li');
  li.appendChild(document.createTextNode(msg));
  ul.insertBefore(li, ul.firstChild);
};
