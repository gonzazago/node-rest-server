let handlerError = (code, err, res) => {
    res.status(code).json({
        ok: false,
        err
    });
}

module.exports = {
    handlerError
}