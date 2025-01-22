import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables

const auth = async (req, res, next) => {
    try {
        const authHeader = req.header('Auth');
        if (!authHeader) {
            return res.status(401).json({ message: "Unauthorized access, no token provided" }); // Return a message along with 401
        }

        const token = authHeader.split(' ')[1];

        const isCustomAuth = token.length < 500; // Check if it's our custom token (JWT) or from Google Auth

        let decodedData;

        if (token && isCustomAuth) {
            // Custom JWT token (ours), verify using the secret key from the .env file
            decodedData = jwt.verify(token, process.env.JWT_SECRET);
            req.userId = decodedData?.id;
        } else {
            // Google OAuth token (JWT from Google), decode without verifying
            decodedData = jwt.decode(token);
            req.userId = decodedData?.sub; // 'sub' is Google’s way of identifying users
        }

        next(); // Proceed to the next middleware/controller
    } catch (error) {
        console.log(error);
        res.status(403).json({ message: "Token verification failed" }); // Forbidden in case of token errors
    }
};

export default auth;
