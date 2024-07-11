const express = require('express');
const app = express();
const path=require('path');
const data = require('./customerData');

app.set('view engine','ejs');
app.set('views', path.join(__dirname, 'views'));
const HTTP_PORT=process.env.PORT ||8080;
app.use(express.static(path.join(__dirname, 'public')));

//route to load the default page 
app.get('/', (req, res) => {
  res.render('index', { title: 'Home' });
});


// Route to display users
app.get('/users', (req, res) => {
  res.render('users', { title: 'Users', users: data.users });
});

// Route to display products
app.get('/products', (req, res) => {
  res.render('products', { title: 'Products', products: data.products });
});

app.get('/productFilter', (req, res) => {
  const filteredProducts = data.products.filter(product => product.PID > 102);
  res.render('filterProducts', { title: 'Filtered Products', products: filteredProducts });
});



app.listen(HTTP_PORT,()=>"console.log(Server Listening at Port)");
