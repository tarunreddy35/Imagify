import jwt from 'jsonwebtoken';

const userAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization || req.headers.token;
        const token = authHeader?.split(' ')[1] || authHeader;

        console.log("Token received:", token);

        if (!token) {
            return res.status(401).json({ success: false, message: 'Token missing. Not Authorized.' });
        }

        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);
        if (!tokenDecode.id) {
            return res.status(403).json({ success: false, message: 'Invalid Token' });
        }

        req.userId = tokenDecode.id;

        next();
    } catch (error) {
        console.error("Auth Middleware Error:", error.message);
        res.status(401).json({ success: false, message: 'Not Authorized. Login Again' });
    }
};

export default userAuth;
