import { botList, nameList, BOT, botEvent, config } from './src/index.js'
import { WebSocketServer } from 'ws'
// 前端
const wss = new WebSocketServer({ port: 3000 });

wss.on('connection', (ws) => {
    console.log("LINK OK!");
    const botconfig = {
        msg: {
            config: {
                bot: config.list
            }
        }
    }
    ws.send(JSON.stringify(botconfig))

    ws.on('error', console.error);

    ws.on('message', (data) => {
        data = JSON.parse(data)
        console.log(data);
            if (data.hasOwnProperty('publicMsg')) {
                const { userId, msg, color } = data.publicMsg
                console.log('received: %s', JSON.stringify(data))
                botList[userId].sendPublic(msg, color)
            }
    });

    botEvent.on('botEvent', (userId, msg) => {
        // console.log(msg)
        if (msg) {
            const data = {
                userId: userId,
                msg: msg
            }
            // console.log(data);
            ws.send(JSON.stringify(data))
        }
    })

    // setInterval(() => {
    //     botList['5b3c71ca721b9'].UserProfile('落零レ')
    // }, 3000)

});

