var router = require('express').Router();

router.get('/data', function (req, res, next) {
    console.log(req);
});

module.exports = router;