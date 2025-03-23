//https://github.com/surajgupta-code/Tech.Tinder.git

const express = require('express');
const app = express();
const auth = require('./middleware/auth');
app.get('/hello',auth);

app.use ("/",(req, res) => {
    res.send('Hello World 2!');
})



app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
