import express from 'express'
import { ENV_VARS } from './envVars.js'

const app = express();

app.listen(ENV_VARS.PORT, () => console.log(`Server running on port ${ENV_VARS.PORT}`))
