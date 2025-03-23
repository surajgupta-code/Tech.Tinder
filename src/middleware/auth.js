 const auth = (req, res, next) => {
  console.log('auth middleware');
  let x = Math.random() * 10;
    if (x > 5) {
        next();
    } else {
        res.status(401).send('Not authorized');
    }
}

module.exports =  auth ;