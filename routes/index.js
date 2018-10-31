var express = require('express');
var router = express.Router();
const Book = require("../models").book

//  when user loads in localhost:3000, redirect to /books
router.get('/', function(req, res) {
  res.redirect('books')
});

// show all books in the database
router.get('/books', function (req, res, next) {
  Book.findAll({order: [["title", "ASC"]]})
    .then(function (books) {
      res.render('index', { title: "Books", books })
    })
      })

// setup the search page
router.get('/search', function (req, res, next) {
  Book.findAll({order: [["title", "ASC"]]})
    .then(function (books) {
      res.render('search', { title: "Search Results", books })
    })
})



// easy peasy search (jk, it sucked doing this and making the search page work)
// takes the search input, uses 'or' statements, and likes to find titles/author/Genre
// of any capitalization, and partial text. If nothing is found, give user an error.
router.post('/search', (req, res, next) => {
  console.log(req.body)
  Book.findAll({
    order: [["title", "ASC"]],
    where: {
      $or: [
        {
          title: { like: '%' + (req.body.search) + '%'
          }
        },

        {
          author: { like: '%' + (req.body.search) + '%'
          }
        },
        {
          genre: { like: '%' + (req.body.search) + '%' }
        },
        {
          year: { like: '%' + (req.body.search) + '%' }
        }
      ]
    }
  }).then(function (books) {
    if (books.length > 0) {
    res.render('search', { title: "Search Results", books})
} else {
  const err = new Error('No Results');
  res.render("./search-error")
}
  })
})

// renders the new-book page.
router.get('/books/new', function (req, res, next) {
  res.render('new-book', { book: Book.build(), title: "New Book" })
})

// make new book, posts new entries to the database and shows on the /Books
// catch function makes it so you can add the new books, as it won't have the id
//
router.post('/books/new', function (req, res, next) {
  Book.create(req.body).then(function () {
    res.redirect("/")
  }).catch(function(err) {
    if (err.name === "SequelizeValidationError") {
      res.render('new-book', {
        book: Book.build(req.body),
        title: "New Book",
        error: err.errors
      });
    } else {
      throw err;
    }
  })
})

// change page to allow the user to edit an already entered book, error if invalid id.
router.get('/books/:id', function (req, res, next) {
  Book.findById(req.params.id)
    .then(function (book) {
      if (book) {
        res.render('update-book', { book: book, title: "Update Book", })
      } else {
        const err = new Error('Not Found');
        console.log(err);
        res.render("./error");
      }

})
})
// edit the book's details, and then post them back to the db which can be viewed
// on the index.

router.post('/books/:id', function (req, res, next) {
  Book.findById(req.params.id)
    .then(function (book) {
      if (book) {
        return book.update(req.body);
      } else {
        res.render("./error");
      }
    })
    .then(function (book) {
      res.redirect("/")
    }).catch(function(err) {
      if(err.name === "SequelizeValidationError") {
        let book = Book.build(req.body);
        book.id = req.params.id;
        res.render('update-book', {
          book: book,
          title: "Update Book",
          errors: err.errors
        });
      } else {
        throw err;
      }
    })
})

// delete the book, can't be undone, be careful.  view asks user if they're sure.
router.post('/books/:id/delete', function (req, res) {
  Book.findById(req.params.id).then(function (book) {
    if (book) {
      return book.destroy();
    } else {
      res.render("/books");
    }
  }).then(function () {
    res.redirect('/books');
  });
})


module.exports = router;
