import jwt from 'jsonwebtoken'
import { ENV_VARS } from './envVariables.js'

export function generateToken(id) {
    return jwt.sign({ id }, ENV_VARS.JWT_SECRET, { expiresIn: '7d' })
}