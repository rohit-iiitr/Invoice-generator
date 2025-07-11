import jwt from "jsonwebtoken"
import { config } from "../config/config"

export const generateToken = (payload: object): string => {
  return jwt.sign(payload, config.jwt.secret, {
    expiresIn: "7d", // Token valid for 7 days
  })
}

export const verifyToken = (token: string): any => {
  return jwt.verify(token, config.jwt.secret)
}
