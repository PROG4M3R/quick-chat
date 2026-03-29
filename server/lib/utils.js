import jwt from "jsonwebtoken";


// function to generate jwt token

export const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET)
    
}

