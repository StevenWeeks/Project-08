let pagination = document.createElement('div');
let pageUl = document.createElement('ul')
const body = document.querySelector('body');
body.appendChild(pagination)
pagination.classList.add('pagination')
pagination.appendChild(pageUl)
const pageButtons = document.querySelector('.pagination')
const buttonsUl = pageButtons.querySelector('ul')
const books = document.querySelector('tbody')
const bookers = books.children
const bookerlength = bookers.length
let pages = Math.ceil(bookers.length/10)


function showThem (page, bookerlength) { // shows the first 10 books on page load
  let max = (page + 1) * 10;
  let min = max - 10;
  for (let i = 0; i < bookerlength; i++) {
    if (i >= min && i < max) { // the range to show
      bookers[i].style.display = '' // has the display show
    } else {
      bookers[i].style.display = 'none' // turns display off for books out of range

}
}
};
showThem(0,bookerlength)

function pageNumbers() {
  for (let i = 1; i <= pages; i++) {
    let pageList = document.createElement('li') // making lis
    let pageA = document.createElement('a') // making anchors
    pageA.classList.add('btn') // adding a class
    pageA.href = '#' // making the href take the page back to the top
    pageA.textContent = i;
    buttonsUl.appendChild(pageList)// appending the li to the ul made earlier
    pageList.appendChild(pageA) //  appending the a's to the li
    pagination.querySelector('a').classList.add ('active') // making the first a the class active when page loads
  }
};

pageNumbers()

function highLight () { //  everything tucked away in a function so it's not all global
  var aBtn = pagination.querySelectorAll('a')// pick up all the anchors in pagination
  var active = pagination.querySelector('a')// defining active as first a
  for (var i = 0; i < aBtn.length; i++) {
    aBtn[i].addEventListener('click', (function() {

      return function () { //  making the function repeatable
        if (active) {
          active.classList.remove('active') // remove previous anchor's class
          active = this // making clicked a the ref for next step
          active.classList.add('active') // making clicked a the new active
}
}
}(i))) // function needs to know integer to function
}
};
highLight() // run the function

function showRest () {
  let pager = pagination.querySelectorAll('a') // puts anchors into an 'array'
  for (let i = 0; i < pager.length; i++) { // for loop using array length
    pager[i].addEventListener('click', () => { // when an 'a' is clicked do
      showThem(i, bookerlength) // pasases in the array spot into the previous function
    })
  }
};
showRest()
