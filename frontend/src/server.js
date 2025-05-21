const express = require('express');
const { engine } = require('express-handlebars');
const path = require('path');
const rutas = require('./routes/app.routes');

const app = express();

app.use(express.static(path.join(__dirname, '../public')));

app.engine('hbs', engine({ 
  extname: '.hbs',
  defaultLayout: 'main'
}));
app.set('view engine', 'hbs');
app.set('views', './src/views');

app.use('/', rutas);

app.listen(4000, () => console.log("Frontend en http://localhost:4000"));