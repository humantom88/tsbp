var router = require('express').Router();
var mocks = require('./mock');

router.get('/data', function (req, res, next) {
    var notes = mocks.data.map(function (note) {
            return assign({}, note, {
                text: undefined
            })
        })

    res.json(notes);
});

module.exports = router;