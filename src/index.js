import { BOT, botEvent } from "./api/index.js";
import { dirname } from "node:path"
import { fileURLToPath } from "node:url"
import { readFileSync } from "node:fs";
import path from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const config = JSON.parse(readFileSync(path.join(__dirname, '../Neat.config.json')).toString())

export const botList = {}

for (let element of config.list) {
    const { username, password, roomid, userid } = element
    const bot = new BOT(username, password, roomid, userid)

    botList[userid] = bot
}

export const nameList = () => { return Object.keys(botList) }
export { BOT, botEvent } from './api/index.js'