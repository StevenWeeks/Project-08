var express = require('express');
var router = express.Router();
const Book = require("../models").book

//  Get home page.
router.get('/', function(req, res) {
  res.redirect('books')
});

// show all books
router.get('/books', function (req, res, next) {
  Book.findAll({order: [["title", "ASC"]]})
    .then(function (books) {
      res.render('index', { title: "Books", books })
    })
      })

router.get('/search', function (req, res, next) {
  Book.findAll({order: [["title", "ASC"]]})
    .then(function (books) {
      res.render('search', { title: "Books", books })
    })
})



// easy peasy search (jk, it sucked doing this)
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
        }
      ]
    }
  }).then(function (books) {
    if (books.length > 0) {
    res.render('search', { title: "Books", books})
} else {
  const err = new Error('No Results');
  res.render("./search-error")
}
  })
})

// show new book page
router.get('/books/new', function (req, res, next) {
  res.render('new-book', { book: Book.build(), title: "New Book" })
})

// make new book
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

// check already made entry in book
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
// edit the book

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

// delete the book
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
