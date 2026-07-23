import jwt from "jsonwebtoken"

const isAuth = async (req, res, next) => {
    try {
        let { token } = req.cookies

        if (!token) {
            return res.status(401).json({ message: "Authentication token missing. Please log in again." })
        }
        const verifyToken = jwt.verify(token, process.env.JWT_SECRET)

        if (!verifyToken) {
            return res.status(401).json({ message: "Invalid or expired token. Please log in again." })
        }
        req.userId = verifyToken.userId

        next()

    } catch (error) {
        return res.status(401).json({ message: `Authentication failed: ${error.message}` })
    }
}

export default isAuth