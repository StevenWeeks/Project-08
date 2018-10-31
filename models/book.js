'use strict';
module.exports = (sequelize, DataTypes) => {
  const book = sequelize.define('book', {
    title: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: true
      }
    },
    author: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: true
      }
    },
    genre: DataTypes.STRING,
    year: DataTypes.INTEGER
  })
  book.hook('beforeCreate', (book, options) => {
    book.title = book.title.split(' ').map((s) => s.charAt(0).toUpperCase() + s.substring(1)).join(' '),
    book.author = book.author.split(' ').map((s) => s.charAt(0).toUpperCase() + s.substring(1)).join(' '),
    book.genre = book.genre.split(' ').map((s) => s.charAt(0).toUpperCase() + s.substring(1)).join(' ')
  });
  book.associate = function (models) {
    // associations can be defined here
  };
  return book;
};
