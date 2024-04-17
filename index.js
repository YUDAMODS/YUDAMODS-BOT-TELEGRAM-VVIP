const { Telegraf } = require('telegraf');
const { TELEGRAM_BOT_TOKEN } = require('./settings');
const axios = require('axios');
const cheerio = require('cheerio');
const figlet = require('figlet');
const chalk = require('chalk');
const fs = require('fs');
const { watchFile, unwatchFile } = fs;
const { fileURLToPath } = require('url');

const bot = new Telegraf(TELEGRAM_BOT_TOKEN);

let userList = [];

const thumbPath = 'https://telegra.ph/file/ba12c1ba24d23404c1e00.jpg';

bot.start((ctx) => bot.sendPhoto(ctx.chat.id, thumbPath, { caption: 'Welcome to the WhatsApp submission bot! Use /menu to view all menu.' }));

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
┗━━━━━[ YUDAMODS  ]━━━━
       
          ⌕ █║▌║▌║ - ║▌║▌║█ ⌕`;
      bot.sendPhoto(ctx.chat.id, thumbPath, { caption: menuText });
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
┗━━━━━[ YUDAMODS  ]━━━━
       
          ⌕ █║▌║▌║ - ║▌║▌║█ ⌕`;
      bot.sendPhoto(ctx.chat.id, thumbPath, { caption: allmenuText });
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
    
    bot.sendPhoto(ctx.chat.id, thumbPath, { caption: `Anda yakin dengan pilihan Anda? Whatsapp Anda dapat diblokir jika baru saja menautkan dengan bot. Silahkan ketik /lanjutkan untuk melanjutkan.`, keyboard });
    break;

    case '/pushkontak':
    const pushkontakArgs = message.split(' ').slice(1).join(' ');
    const pushkontakParams = pushkontakArgs.split('|');

    if (pushkontakParams.length !== 3) {
        bot.sendPhoto(ctx.chat.id, thumbPath, { caption: "Format yang Anda masukkan salah. Silakan gunakan format: /pushkontak idgroup|jeda|teks" });
        return;
    }

    const idGroup = pushkontakParams[0];
    const jeda = parseInt(pushkontakParams[1]);
    const teks = pushkontakParams[2];

    if (!idGroup || !jeda || !teks) {
        bot.sendPhoto(ctx.chat.id, thumbPath, { caption: "Format yang Anda masukkan salah. Silakan gunakan format: /pushkontak idgroup|jeda|teks" });
        return;
    }

    bot.sendPhoto(ctx.chat.id, thumbPath, { caption: "Proses pengiriman kontak sedang berlangsung..." });

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

        bot.sendPhoto(ctx.chat.id, thumbPath, { caption: "Pengiriman kontak selesai!" });
    } catch (error) {
        bot.sendPhoto(ctx.chat.id, thumbPath, { caption: `Terjadi kesalahan: ${error.message}` });
    }
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
        bot.sendPhoto(ctx.chat.id, thumbPath, { caption: lanjutkanText });
        break;

    case '/cekidgc':
        const chatId = ctx.message.chat.id;
        bot.sendPhoto(ctx.chat.id, thumbPath, { caption: `Cek ID Group:\nChat ID: ${chatId}` });
        break;

    default:
        break;
  }
});

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
