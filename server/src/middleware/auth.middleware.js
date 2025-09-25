const jwt = require("jsonwebtoken")
const dotenv = require("dotenv")

dotenv.config()

const protect = asyncHandler(async (req, res, next) => {
    const token = req.cookies.token;
    if (!token) throw createError("Not authorized", 401);

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
});


export default protect