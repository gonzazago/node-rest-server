let handlerResponse = (ok,code, msg, res) => {
    res.status(code).json({
        ok,
        msg
    });
}

module.exports = {
    handlerResponse
}