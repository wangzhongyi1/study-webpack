const express = require('express');

const app = new express();

app.get('/user', function(req, res, next) {
    res.json({
        name: 'wzy'
    })
    next();
})

app.listen(5000, function() {
    console.log('serve is running at 5000 port')
})