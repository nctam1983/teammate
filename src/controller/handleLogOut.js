const handleLogOut = (req, res) => {

    const clearCookies = (req, res) => {
        let cookies = req.cookies
        if (cookies) {
            Object.keys(cookies).forEach(key => {
                res.clearCookie(key);
            })
        }
    }

    req.logOut((error) => {
        if (error) {
            console.log(error);
            return res.send(error);
        }
        clearCookies(req, res)
        return res.redirect('login');
    });
}

export default handleLogOut;

