const express = require('express');
const bodyParser = require('body-parser');
const Sequelize = require('sequelize');

// Initialize Express app
const app = express();

// Set up Sequelize 
const sequelize = new Sequelize('SenecaDB', 'SenecaDB_owner', 'wGmW2cegUB5r', {
  host: 'ep-old-cell-a5t7jqvy.us-east-2.aws.neon.tech',
  dialect: 'postgres',
  port: 5432,
  dialectOptions: {
    ssl: { rejectUnauthorized: false },
  },
});

// Testing the connection
sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch((err) => {
    console.log('Unable to connect to the database:', err);
  });

// Define the Book model
const Book = sequelize.define('Book', {
  title: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  author: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  year: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
});

// Sync the model with the database 
sequelize.sync({ force: false })
  .then(async () => {
    console.log('Book table has been created.');

    }
  )
  .catch((error) => {
    console.error('Error creating table:', error);
  });

// Configure the application to use EJS
app.set('view engine', 'ejs');

// Configure body-parser to parse form data
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files
app.use(express.static('public'));

// Route to list all books and display name and student number
app.get('/', async (req, res) => {
  try {
    const books = await Book.findAll();
    const name = 'Prabhjot Singh'; 
    const studentNumber = '163500226'; 

    res.render('index', { name, studentNumber, books });
  } catch (error) {
    res.status(500).send('Error retrieving books: ' + error.message);
  }
});

// Route to display a form for creating a new book
app.get('/books/new', (req, res) => {
  res.render('new');
});

// Route to handle the submission of the form and create a new book
app.post('/books', async (req, res) => {
  const { title, author, year } = req.body;
  try {
    await Book.create({ title, author, year });
    res.redirect('/');
  } catch (error) {
    res.status(500).send('Error creating book: ' + error.message);
  }
});

// Route to display a form for editing a book by id
app.get('/books/edit/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const book = await Book.findByPk(id); // Use findByPk to find by primary key (id)
      if (book) {
        res.render('edit', { book });
      } else {
        res.status(404).send('Book not found');
      }
    } catch (error) {
      res.status(500).send('Error retrieving book: ' + error.message);
    }
  });
  
  // Route to update a book by id
  app.post('/books/edit/:id', async (req, res) => {
    const { id } = req.params;
    const { title, author, year } = req.body;
    try {
      const book = await Book.findByPk(id); // Use findByPk to find by primary key (id)
      if (book) {
        await book.update({ title, author, year: parseInt(year, 10) }); // Ensure year is an integer
        res.redirect('/');
      } else {
        res.status(404).send('Book not found');
      }
    } catch (error) {
      res.status(500).send('Error updating book: ' + error.message);
    }
  });

// Route to delete a book
app.post('/books/delete/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const book = await Book.findByPk(id);
    if (book) {
      await book.destroy();
      res.redirect('/');
    } else {
      res.status(404).send('Book not found');
    }
  } catch (error) {
    res.status(500).send('Error deleting book: ' + error.message);
  }
});

// Starting  the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
