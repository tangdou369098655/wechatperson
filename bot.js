/**
 * Wechaty - WeChat Bot SDK for Personal Account, Powered by TypeScript, Docker, and 💖
 *  - https://github.com/chatie/wechaty
 */
const {
  Wechaty,
  ScanStatus,
  log,
}               = require('wechaty')

function onScan (qrcode, status) {
  if (status === ScanStatus.Waiting || status === ScanStatus.Timeout) {
    require('qrcode-terminal').generate(qrcode)  // show qrcode on console

    const qrcodeImageUrl = [
      'https://api.qrserver.com/v1/create-qr-code/?data=',
      encodeURIComponent(qrcode),
    ].join('')

    log.info('StarterBot', 'onScan: %s(%s) - %s', ScanStatus[status], status, qrcodeImageUrl)

  } else {
    log.info('StarterBot', 'onScan: %s(%s)', ScanStatus[status], status)
  }
}

function onLogin (user) {
  log.info('StarterBot', '%s login', user)
}

function onLogout (user) {
  log.info('StarterBot', '%s logout', user)
}

async function onMessage (msg) {
  const contact = msg.from(); // 发消息人
  const content = msg.text().trim()
  const room = msg.room()
  const alias = await contact.alias()

  const isText = msg.type() === bot.Message.Type.Text

  if (msg.self()) {
    return;
  }

  if (room && isText) {
    // 如果是群消息 目前只处理文字消息
    const topic = await room.topic();
    console.log(`群名: ${topic} 发消息人: ${contact.name()} 内容: ${content}`);
  } else if (isText) {
    // 如果非群消息 目前只处理文字消息
    console.log(`发消息人: ${alias} 消息内容: ${content}`);
    // console.log(contact)
    console.log(contact.payload)
      if (contact.payload.name === '哇咔咔(看到我请让我滚去学习)') {
        let reply = content;
        // if (config.DEFAULTBOT == '0') {
        //   // 天行聊天机器人逻辑
        //   reply = await superagent.getReply(content);
        //   console.log('天行机器人回复：', reply);
        // } else if (config.DEFAULTBOT == '1') {
        //   // 图灵聊天机器人
        //   reply = await superagent.getTuLingReply(content);
        //   console.log('图灵机器人回复：', reply);
        // } else if (config.DEFAULTBOT == '2') {
        //   // 天行对接的图灵聊
        //   reply = await superagent.getTXTLReply(content);
        //   console.log('天行对接的图灵机器人回复：', reply);
        // }
        try {
          await contact.say(reply);
        } catch (e) {
          console.error(e);
        }
      }
  }
}

const bot = new Wechaty({ name: 'wechaty' })

bot.on('scan',    onScan)
bot.on('login',   onLogin)
bot.on('logout',  onLogout)
bot.on('message', onMessage)

bot.start()
  .then(() => log.info('StarterBot', 'Starter Bot Started.'))
  .catch(e => log.error('StarterBot', e))