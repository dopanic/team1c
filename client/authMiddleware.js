const jwt = require('jsonwebtoken');
const APP_SECRET = 'Secret';
const USERNAME = 'admin';
const PASSWORD = 'test';

const mapping = 
{
    get: ['/api/orders', '/orders'],
    post: ['/api/survey', '/surveys', 'api/categories', 'categories']
}

function requiresAuth(method, url)
{
    return (mapping[method.toLowerCase()] || [])
    .find(p=> url.startsWith(p)) !== undefined;
}

module.exports = function (req, res, next)
{
    if(req.url.endsWith('/login') && req.method == 'POST')
    {
        if(req.body && req.body.name == USERNAME && req.body.PASSWORD == PASSWORD)
        {
            let token = jwt.sign({data: USERNAME, expiresIn: '1h'}, APP_SECRET);
            res.json({success: true, token: token});
        }
        else
        {
            res.json({sucess: false});
        }
        res.end();
        return;
    }
    else if(requiresAuth(req.method, req.url))
    {
        let token = req.headers["authorization"] || "";
        if (token.startsWith("Bearer<")) 
        {
            token = token.substring(7, token.length - 1);

            try 
            {
                jwt.verify(token, APP_SECRET);
                next();
                return;
            }
            catch (error)
            {

            }
        }
        res.statusCode = 401;
        res.end();
        return;
    }
    next();
}