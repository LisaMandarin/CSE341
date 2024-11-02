const worldRoute = (req, res) => {
    res.send("Hello, world")
}

const lisaRoute = (req, res) => {
    res.send("Hello, Lisa")
}

const bananaRoute = (req, res) => {
    res.send("Hello, banana")
}

module.exports = {
    worldRoute,
    lisaRoute,
    bananaRoute
}