const Discord = require('discord.js'); // by Artemka076#6715
const bot = new Discord.Client();
const fs = require("fs");
const Logger = require('./objects/logger');

let requests = JSON.parse(fs.readFileSync("./database/requests.json", "utf8"));
let blacklist = JSON.parse(fs.readFileSync("./database/blacklist names.json", "utf8"));
let reqrem = JSON.parse(fs.readFileSync("./database/requests remove.json", "utf8"));

let version = "8.0";
let hideobnova = true;

const cooldowncommand = new Set();
const report_cooldown = new Set();
const dspanel = new Set();
const nrpnames = new Set(); // Невалидные ники будут записаны в nrpnames
const sened = new Set(); // Уже отправленные запросы будут записаны в sened
const support_cooldown = new Set(); // Запросы от игроков.
const snyatie = new Set(); // Уже отправленные запросы на снятие роли быдут записаны в snyatie

let serverid = '355656045600964609'

punishment_rep = ({
    "mute": "Вы были замучены в текстовых каналах.",
    "kick": "Вы были отключены от Discord-сервера.",
})

tags = ({
    "ПРА-ВО": "⋆ The Board of State ⋆",
    "ГЦЛ": "⋆ The Board of State ⋆",
    "АШ": "⋆ The Board of State ⋆",
    "ЦБ": "⋆ The Board of State ⋆",

    "FBI": "⋆ Department of Justice ⋆",
    "ФБР": "⋆ Department of Justice ⋆",
    "LSPD": "⋆ Department of Justice ⋆",
    "ЛСПД": "⋆ Department of Justice ⋆",
    "SFPD": "⋆ Department of Justice ⋆",
    "СФПД": "⋆ Department of Justice ⋆",
    "LVPD": "⋆ Department of Justice ⋆",
    "ЛВПД": "⋆ Department of Justice ⋆",
    "SWAT": "⋆ Department of Justice ⋆",
    "СВАТ": "⋆ Department of Justice ⋆",
    "RCPD": "⋆ Department of Justice ⋆",
    "РКПД": "⋆ Department of Justice ⋆",

    "LSA": "⋆ Department of Defence ⋆",
    "ЛСА": "⋆ Department of Defence ⋆",
    "SFA": "⋆ Department of Defence ⋆",
    "СФА": "⋆ Department of Defence ⋆",
    "LS-A": "⋆ Department of Defence ⋆",
    "ЛС-А": "⋆ Department of Defence ⋆",
    "SF-A": "⋆ Department of Defence ⋆",
    "СФ-А": "⋆ Department of Defence ⋆",
    "ТСР": "⋆ Department of Defence ⋆",
    "ТЮРЬМА": "⋆ Department of Defence ⋆",

    "LSMC": "⋆ Department of Health ⋆",
    "ЛСМЦ": "⋆ Department of Health ⋆",
    "SFMC": "⋆ Department of Health ⋆",
    "СФМЦ": "⋆ Department of Health ⋆",
    "LVMC": "⋆ Department of Health ⋆",
    "ЛВМЦ": "⋆ Department of Health ⋆",

    "R-LS": "⋆ Mass Media ⋆",
    "RLS": "⋆ Mass Media ⋆",
    "Р-ЛС": "⋆ Mass Media ⋆",
    "РЛС": "⋆ Mass Media ⋆",
    "R-SF": "⋆ Mass Media ⋆",
    "RSF": "⋆ Mass Media ⋆",
    "Р-СФ": "⋆ Mass Media ⋆",
    "РСФ": "⋆ Mass Media ⋆",
    "R-LV": "⋆ Mass Media ⋆",
    "RLV": "⋆ Mass Media ⋆",
    "Р-ЛВ": "⋆ Mass Media ⋆",
    "РЛВ": "⋆ Mass Media ⋆",

    "WMC": "⋆ Warlock MC ⋆",
    "W-MC": "⋆ Warlock MC ⋆",
    "RM": "⋆ Russian Mafia ⋆",
    "РМ": "⋆ Russian Mafia ⋆",
    "LCN": "⋆ La Cosa Nostra ⋆",
    "ЛКН": "⋆ La Cosa Nostra ⋆",
    "YAKUZA": "⋆ Yakuza ⋆",
    "ЯКУДЗА": "⋆ Yakuza ⋆",

    "GROVE": "⋆ Grove Street Gang ⋆",
    "ГРУВ": "⋆ Grove Street Gang ⋆",
    "BALLAS": "⋆ East Side Ballas Gang ⋆",
    "БАЛЛАС": "⋆ East Side Ballas Gang ⋆",
    "VAGOS": "⋆ Vagos Gang ⋆",
    "ВАГОС": "⋆ Vagos Gang ⋆",
    "NW": "⋆ Night Wolfs ⋆",
    "НВ": "⋆ Night Wolfs ⋆",
    "RIFA": "⋆ Rifa Gang ⋆",
    "РИФА": "⋆ Rifa Gang ⋆",
    "AZTEC": "⋆ Aztecas Gang ⋆",  
    "АЦТЕК": "⋆ Aztecas Gang ⋆",  
});

let manytags = [
"ПРА-ВО",
"ГЦЛ",
"АШ",
"ЦБ",

"FBI",
"ФБР",
"LSPD",
"ЛСПД",
"SFPD",
"СФПД",
"LVPD",
"ЛВПД",
"SWAT",
"СВАТ",
"RCPD",
"РКПД",

"LSA",
"ЛСА",
"SFA",
"СФА",
"LS-A",
"ЛС-А",
"SF-A",
"СФ-А",
"ТСР",
"ТЮРЬМА",

"LSMC",
"ЛСМЦ",
"SFMC",
"СФМЦ",
"LVMC",
"ЛВМЦ",

"R-LS",
"RLS",
"Р-ЛС",
"РЛС",
"R-SF",
"RSF",
"Р-СФ",
"РСФ",
"R-LV",
"RLV",
"Р-ЛВ",
"РЛВ",

"WMC",
"W-MC",
"RM",
"РМ",
"LCN",
"ЛКН",
"YAKUZA",
"ЯКУДЗА",

"GROVE",
"ГРУВ",
"BALLAS",
"БАЛЛАС",
"VAGOS",
"ВАГОС",
"AZTEC",  
"АЦТЕК",
"RIFA",
"РИФА",
"NW",
"НВ",
];
let rolesgg = ["⋆ The Board of State ⋆", "⋆ Department of Justice ⋆", "⋆ Department of Defence ⋆", "⋆ Department of Health ⋆", "⋆ Mass Media ⋆", "⋆ Warlock MC ⋆", "⋆ Russian Mafia ⋆", "⋆ La Cosa Nostra ⋆", "⋆ Yakuza ⋆", "⋆ Grove Street Gang ⋆", "⋆ East Side Ballas Gang ⋆", "⋆ Vagos Gang ⋆", "⋆ Aztecas Gang ⋆", "⋆ Rifa Gang ⋆", "⋆ Night Wolfs ⋆"]
let canremoverole = ["✫Deputy Leader✫", "✵Leader✵", "✮Ministers✮", "✔ Helper ✔"];

const events = {
    MESSAGE_REACTION_ADD: 'messageReactionAdd',
    MESSAGE_REACTION_REMOVE: 'messageReactionRemove',
};

function checknick (member, role, startnum, endnum, bot, message){
    if (member.roles.some(r => [role].includes(r.name))){
        let ruletagst = startnum
        let ruletagend = endnum
        let rpname = false;
        for (i in manytags){
            if (i >= ruletagst && i <= ruletagend)
            if (member.displayName.toUpperCase().includes(manytags[i])) rpname = true;
        }
        if (!rpname){
            if (!nrpnames.has(member.id)){
                for (var i in rolesgg){
                    let rolerem = bot.guilds.find(g => g.id == message.guild.id).roles.find(r => r.name == rolesgg[i]);
                    if (member.roles.some(role=>[rolesgg[i]].includes(role.name))){
                        member.removeRole(rolerem).then(() => {	
                            setTimeout(function(){
                                if(member.roles.has(rolerem)){
                                    member.removeRole(rolerem);
                                }
                            }, 5000);
                        }).catch(console.error);
                    }
                }
                nrpnames.add(member.id)
            }
        }
    }
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max + 1);
    return Math.floor(Math.random() * (max - min)) + min;
}

function hook(channel, message, webhook_name, name, time, avatar) {
    if (!channel) return console.log('Канал не выбран.');
    if (!message) return console.log('Сообщение не указано.');
    if (!webhook_name) return console.log('ВебХук не найден.');
    if (!avatar) avatar = 'https://i.imgur.com/SReVrGM.png';
    channel.fetchWebhooks().then(webhook => {
        let foundHook = webhook.find(web => web.name == webhook_name)
        if (!foundHook){
            channel.createWebhook(webhook_name, avatar).then(webhook => {
                webhook.send(message, {
                    "username": name,
                    "avatarURL": avatar,
                }).then(msg => {
                    if (time) msg.delete(time)
                })
            })
        }else{
            foundHook.send(message, {
                "username": name,
                "avatarURL": avatar,
            }).then(msg => {
                if (time) msg.delete(time)
            })
        }
    })
}

const support_loop = new Set(); 
const fbi_dostup = new Set();
fbi_dostup.add("353055790862565377");
fbi_dostup.add("308604330246799360");

bot.login(process.env.token);
bot.on('ready', () => {
    console.log("Бот был успешно запущен!");
    bot.user.setPresence({ game: { name: 'hacker' }, status: 'idle' })
});

bot.on('message', async message => {
    if (message.channel.type == "dm") return // Если в ЛС, то выход.
    if (message.guild.id != serverid && message.guild.id != "493459379878625320") return
    if (message.type === "PINS_ADD") if (message.channel.name == "requests-for-roles") message.delete();
    if (message.content == "/ping") return message.reply("`я онлайн!`") && console.log(`Бот ответил ${message.member.displayName}, что я онлайн.`)
    if (message.member.id == bot.user.id) return
    
    let re = /(\d+(\.\d)*)/i;
    
if (!support_loop.has(message.guild.id) && message.channel.name != "support"){
  support_loop.add(message.guild.id)
  setTimeout(() => {
    if (support_loop.has(message.guild.id)) support_loop.delete(message.guild.id);
  }, 600000);
  message.guild.channels.forEach(async channel => {
    if (channel.name.startsWith('ticket-')){
      if (message.guild.channels.find(c => c.id == channel.parentID).name == 'Корзина'){
        let log_channel = message.guild.channels.find(c => c.name == "reports-log");
        channel.fetchMessages({limit: 1}).then(async messages => {
          if (messages.size == 1){
            messages.forEach(async msg => {
              let s_now = new Date().valueOf() - 86400000;
              if (msg.createdAt.valueOf() < s_now){
                let archive_messages = [];
                await channel.fetchMessages({limit: 100}).then(async messagestwo => {
                  messagestwo.forEach(async msgcopy => {
                    let date = new Date(+msgcopy.createdAt.valueOf() + 10800000);
                    let formate_date = `[${date.getFullYear()}-` + 
                    `${(date.getMonth() + 1).toString().padStart(2, '0')}-` +
                    `${date.getDate().toString().padStart(2, '0')} ` + 
                    `${date.getHours().toString().padStart(2, '0')}-` + 
                    `${date.getMinutes().toString().padStart(2, '0')}-` + 
                    `${date.getSeconds().toString().padStart(2, '0')}]`;
                    if (!msgcopy.embeds[0]){
                      archive_messages.push(`${formate_date} ${msgcopy.member.displayName}: ${msgcopy.content}`);
                    }else{
                      archive_messages.push(`[К СООБЩЕНИЮ БЫЛО ДОБАВЛЕНО] ${msgcopy.embeds[0].fields[1].value}`);
                      archive_messages.push(`[К СООБЩЕНИЮ БЫЛО ДОБАВЛЕНО] ${msgcopy.embeds[0].fields[0].value}`);
                      archive_messages.push(`${formate_date} ${msgcopy.member.displayName}: ${msgcopy.content}`);
                    }
                  });
                });
                let i = archive_messages.length - 1;
                while (i>=0){
                  await fs.appendFileSync(`./${channel.name}.txt`, `${archive_messages[i]}\n`);
                  i--
                }
                await log_channel.send(`\`[SYSTEM]\` \`Канал ${channel.name} был удален. [24 часа в статусе 'Закрыт']\``, { files: [ `./${channel.name}.txt` ] });
                channel.delete();
                fs.unlinkSync(`./${channel.name}.txt`);
              }
            });
          }
        });
      }else if(message.guild.channels.find(c => c.id == channel.parentID).name == 'Активные жалобы'){
        let log_channel = message.guild.channels.find(c => c.name == "spectator-chat");
        channel.fetchMessages({limit: 1}).then(messages => {
          if (messages.size == 1){
            messages.forEach(msg => {
              let s_now = new Date().valueOf() - 18000000;
              if (msg.createdAt.valueOf() < s_now){
                log_channel.send(`\`[SYSTEM]\` \`Жалоба\` <#${channel.id}> \`уже более 5-ти часов ожидает проверки!\``);
                channel.send(`\`[SYSTEM]\` \`Привет! Я напомнил модераторам про твое обращение!\``)
              }
            });
          }
        });
      }
    }
  });
  // UNWARN SYSTEM
  let dataserver = bot.guilds.find(g => g.id == "493459379878625320");
  dataserver.channels.forEach(async channel => {
  if (channel.type=="text"){
    if (dataserver.channels.find(c => c.id == channel.parentID).name == 'db_users'){
      await channel.fetchMessages({limit: 1}).then(async messages => {
      if (messages.size == 1){
        messages.forEach(async sacc => {
          let str = sacc.content;
          let moderation_level = str.split('\n')[0].match(re)[0];
          let moderation_warns = str.split('\n')[1].match(re)[0];
          let user_warns = str.split('\n')[+moderation_warns + 2].match(re)[0];
          let moderation_reason = [];
          let user_reason = [];
          let moderation_time = [];
          let user_time = [];
          let moderation_give = [];
          let user_give = [];
          
          let circle = 0;
          while (+moderation_warns > circle){
            moderation_reason.push(str.split('\n')[+circle + 2].split('==>')[0]);
            moderation_time.push(str.split('\n')[+circle + 2].split('==>')[1]);
            moderation_give.push(str.split('\n')[+circle + 2].split('==>')[2]);
            circle++;
          }
               
          circle = 0;
          while (+user_warns > circle){
            let myDate = new Date().valueOf();
            if (+str.split('\n')[+circle + +moderation_warns + 3].split('==>')[1] > myDate){
              user_reason.push(str.split('\n')[+circle + +moderation_warns + 3].split('==>')[0]);
              user_time.push(str.split('\n')[+circle + +moderation_warns + 3].split('==>')[1]);
              user_give.push(str.split('\n')[+circle + +moderation_warns + 3].split('==>')[2]);
            }else{
              user_warns--
              let genchannel = message.guild.channels.find(c => c.name == "general");
              genchannel.send(`<@${channel.name}>, \`вам было снято одно предупреждение. [Прошло 3 дня]\``);
            }
            circle++;
          }
          let text_end = `Уровень модератора: ${moderation_level}\n` + 
          `Предупреждения модератора: ${moderation_warns}`;
          for (var i = 0; i < moderation_reason.length; i++){
            text_end = text_end + `\n${moderation_reason[i]}==>${moderation_time[i]}==>${moderation_give[i]}`;
          }
          text_end = text_end + `\nПредупреждений: ${+user_warns}`;
          for (var i = 0; i < user_reason.length; i++){
            text_end = text_end + `\n${user_reason[i]}==>${user_time[i]}==>${user_give[i]}`;
          }
          if (+moderation_level == 0 && +moderation_warns == 0 && +user_warns == 0){
            channel.delete();
          }else{
            sacc.edit(text_end);
          }
        });
      }});
    }
  }});
}
    
if (message.channel.name == "support"){
  if (message.member.bot) return message.delete();
  if (support_cooldown.has(message.author.id)) {
    return message.delete();
  }
  support_cooldown.add(message.author.id);
  setTimeout(() => {
    if (support_cooldown.has(message.author.id)) support_cooldown.delete(message.author.id);
  }, 300000);
  let id_mm;
  let rep_message;
  let db_server = bot.guilds.find(g => g.id == "493459379878625320");
  let db_channel = db_server.channels.find(c => c.name == "config");
  await db_channel.fetchMessages().then(async messages => {
    let db_msg = messages.find(m => m.content.startsWith(`MESSAGEID:`));
    if (db_msg){
      id_mm = db_msg.content.match(re)[0]
      await message.channel.fetchMessages().then(async messagestwo => {
        rep_message = await messagestwo.find(m => m.id == id_mm);
      });
    }
  });
  if (!rep_message){
    await message.channel.send(`` +
    `**Приветствую! Вы попали в канал поддержки сервера Scottdale Brotherhood!**\n` +
    `**Тут Вы сможете задать вопрос модераторам или администраторам сервера!**\n\n` +
    `**Количество вопросов за все время: 0**\n` +
    `**Необработанных модераторами: 0**\n` +
    `**Вопросы на рассмотрении: 0**\n` +
    `**Закрытых: 0**`).then(async msg => {
      db_channel.send(`MESSAGEID: ${msg.id}`)
      rep_message = await message.channel.fetchMessage(msg.id);
    });
  }
  let info_rep = [];
  info_rep.push(rep_message.content.split('\n')[3].match(re)[0]);
  info_rep.push(rep_message.content.split('\n')[4].match(re)[0]);
  info_rep.push(rep_message.content.split('\n')[5].match(re)[0]);
  info_rep.push(rep_message.content.split('\n')[6].match(re)[0]);
  rep_message.edit(`` +
    `**Приветствую! Вы попали в канал поддержки сервера Scottdale Brotherhood!**\n` +
    `**Тут Вы сможете задать вопрос модераторам или администраторам сервера!**\n\n` +
    `**Количество вопросов за все время: ${+info_rep[0] + 1}**\n` +
    `**Необработанных модераторами: ${+info_rep[1] + 1}**\n` +
    `**Вопросы на рассмотрении: ${info_rep[2]}**\n` +
    `**Закрытых: ${info_rep[3]}**`)
  let s_category = message.guild.channels.find(c => c.name == "Активные жалобы");
  if (!s_category) return message.delete(3000);
  await message.guild.createChannel(`ticket-${+info_rep[0] + 1}`).then(async channel => {
    message.delete();    
    await channel.setParent(s_category.id);
    await channel.setTopic('Жалоба в обработке.')
    let moderator_role = await message.guild.roles.find(r => r.name == 'Support Team');
    await channel.overwritePermissions(moderator_role, {
      // GENERAL PERMISSIONS
      CREATE_INSTANT_INVITE: false,
      MANAGE_CHANNELS: false,
      MANAGE_ROLES: false,
      MANAGE_WEBHOOKS: false,
      // TEXT PERMISSIONS
      VIEW_CHANNEL: true,
      SEND_MESSAGES: true,
      SEND_TTS_MESSAGES: false,
      MANAGE_MESSAGES: false,
      EMBED_LINKS: true,
      ATTACH_FILES: true,
      READ_MESSAGE_HISTORY: true,
      MENTION_EVERYONE: false,
      USE_EXTERNAL_EMOJIS: false,
      ADD_REACTIONS: false,
    })  
    await channel.overwritePermissions(message.member, {
      // GENERAL PERMISSIONS
      CREATE_INSTANT_INVITE: false,
      MANAGE_CHANNELS: false,
      MANAGE_ROLES: false,
      MANAGE_WEBHOOKS: false,
      // TEXT PERMISSIONS
      VIEW_CHANNEL: true,
      SEND_MESSAGES: true,
      SEND_TTS_MESSAGES: false,
      MANAGE_MESSAGES: false,
      EMBED_LINKS: true,
      ATTACH_FILES: true,
      READ_MESSAGE_HISTORY: true,
      MENTION_EVERYONE: false,
      USE_EXTERNAL_EMOJIS: false,
      ADD_REACTIONS: false,
    })  
    await channel.overwritePermissions(message.guild.roles.find(r => r.name == "@everyone"), {
      // GENERAL PERMISSIONS
      CREATE_INSTANT_INVITE: false,
      MANAGE_CHANNELS: false,
      MANAGE_ROLES: false,
      MANAGE_WEBHOOKS: false,
      // TEXT PERMISSIONS
      VIEW_CHANNEL: false,
      SEND_MESSAGES: false,
      SEND_TTS_MESSAGES: false,
      MANAGE_MESSAGES: false,
      EMBED_LINKS: false,
      ATTACH_FILES: false,
      READ_MESSAGE_HISTORY: false,
      MENTION_EVERYONE: false,
      USE_EXTERNAL_EMOJIS: false,
      ADD_REACTIONS: false,
    })  
    channel.send(`<@${message.author.id}> \`для команды поддержки\` <@&${moderator_role.id}>`, {embed: {
      color: 3447003,
      title: "Обращение к поддержке Discord",
      fields: [{
        name: "Отправитель",
        value: `**Пользователь:** <@${message.author.id}>`,
      },{
        name: "Суть обращения",
        value: `${message.content}`,
      }]
    }
    });
    let sp_chat_get = message.guild.channels.find(c => c.name == "reports-log");
    await sp_chat_get.send(`\`[CREATE]\` <@${message.author.id}> \`создал обращение к поддержке:\` <#${channel.id}>`);
    message.channel.send(`<@${message.author.id}>, \`обращение составлено. Нажмите на\` <#${channel.id}>`).then(msg => msg.delete(15000));
  });
}

if (message.content == '/hold'){
  if (!message.member.hasPermission("MANAGE_ROLES")) return message.delete();
  if (!message.channel.name.startsWith('ticket-')) return message.delete();
  if (message.channel.topic == 'Жалоба закрыта.' || message.channel.topic == 'Жалоба на рассмотрении.') return message.delete();
  let memberid;
  await message.channel.permissionOverwrites.forEach(async perm => {
    if (perm.type == `member`){
      memberid = await perm.id;
    }
  });
  let rep_message;
  let db_server = bot.guilds.find(g => g.id == "493459379878625320");
  let db_channel = db_server.channels.find(c => c.name == "config");
  await db_channel.fetchMessages().then(async messages => {
    let db_msg = messages.find(m => m.content.startsWith(`MESSAGEID:`));
    if (db_msg){
      id_mm = db_msg.content.match(re)[0]
      let ticket_channel = message.guild.channels.find(c => c.name == 'support');
      await ticket_channel.fetchMessages().then(async messagestwo => {
        rep_message = await messagestwo.find(m => m.id == id_mm);
      });
    }
  });
  if (!rep_message) return message.delete();
  let info_rep = [];
  info_rep.push(rep_message.content.split('\n')[3].match(re)[0]);
  info_rep.push(rep_message.content.split('\n')[4].match(re)[0]);
  info_rep.push(rep_message.content.split('\n')[5].match(re)[0]);
  info_rep.push(rep_message.content.split('\n')[6].match(re)[0]);
  rep_message.edit(`` +
    `**Приветствую! Вы попали в канал поддержки сервера Scottdale Brotherhood!**\n` +
    `**Тут Вы сможете задать вопрос модераторам или администраторам сервера!**\n\n` +
    `**Количество вопросов за все время: ${info_rep[0]}**\n` +
    `**Необработанных модераторами: ${+info_rep[1] - 1}**\n` +
    `**Вопросы на рассмотрении: ${+info_rep[2] + 1}**\n` +
    `**Закрытых: ${info_rep[3]}**`)
  let s_category = message.guild.channels.find(c => c.name == "Жалобы на рассмотрении");
  if (!s_category) return message.delete(3000);
  await message.channel.setParent(s_category.id);
  let sp_chat_get = message.guild.channels.find(c => c.name == "reports-log");
  message.channel.setTopic('Жалоба на рассмотрении.')
  message.channel.send(`\`[STATUS]\` <@${memberid}>, \`вашей жалобе был установлен статус: 'На рассмотрении'. Источник: ${message.member.displayName}\``);
  sp_chat_get.send(`\`[HOLD]\` \`Модератор ${message.member.displayName} установил жалобе\` <#${message.channel.id}> \`статус 'На рассмотрении'.\``);
  message.delete();
}

if (message.content == '/active'){
  if (!message.member.hasPermission("MANAGE_ROLES")) return message.delete();
  if (!message.channel.name.startsWith('ticket-')) return message.delete();
  if (message.channel.topic == 'Жалоба закрыта.' || message.channel.topic != 'Жалоба на рассмотрении.') return message.delete();
  let memberid;
  await message.channel.permissionOverwrites.forEach(async perm => {
    if (perm.type == `member`){
      memberid = await perm.id;
    }
  });
  let rep_message;
  let db_server = bot.guilds.find(g => g.id == "493459379878625320");
  let db_channel = db_server.channels.find(c => c.name == "config");
  await db_channel.fetchMessages().then(async messages => {
    let db_msg = messages.find(m => m.content.startsWith(`MESSAGEID:`));
    if (db_msg){
      id_mm = db_msg.content.match(re)[0]
      let ticket_channel = message.guild.channels.find(c => c.name == 'support');
      await ticket_channel.fetchMessages().then(async messagestwo => {
        rep_message = await messagestwo.find(m => m.id == id_mm);
      });
    }
  });
  if (!rep_message) return message.delete();
  let info_rep = [];
  info_rep.push(rep_message.content.split('\n')[3].match(re)[0]);
  info_rep.push(rep_message.content.split('\n')[4].match(re)[0]);
  info_rep.push(rep_message.content.split('\n')[5].match(re)[0]);
  info_rep.push(rep_message.content.split('\n')[6].match(re)[0]);
  rep_message.edit(`` +
    `**Приветствую! Вы попали в канал поддержки сервера Scottdale Brotherhood!**\n` +
    `**Тут Вы сможете задать вопрос модераторам или администраторам сервера!**\n\n` +
    `**Количество вопросов за все время: ${info_rep[0]}**\n` +
    `**Необработанных модераторами: ${+info_rep[1] + 1}**\n` +
    `**Вопросы на рассмотрении: ${+info_rep[2] - 1}**\n` +
    `**Закрытых: ${info_rep[3]}**`)
  let s_category = message.guild.channels.find(c => c.name == "Активные жалобы");
  if (!s_category) return message.delete(3000);
  await message.channel.setParent(s_category.id);
  let sp_chat_get = message.guild.channels.find(c => c.name == "reports-log");
  message.channel.setTopic('Жалоба в обработке.');
  message.channel.send(`\`[STATUS]\` <@${memberid}>, \`вашей жалобе был установлен статус: 'В обработке'. Источник: ${message.member.displayName}\``);
  sp_chat_get.send(`\`[UNWAIT]\` \`Модератор ${message.member.displayName} убрал жалобе\` <#${message.channel.id}> \`статус 'На рассмотрении'.\``);
  message.delete();
}
    
if (message.content == '/toadmin'){
  if (!message.member.hasPermission("MANAGE_ROLES")) return message.delete();
  if (!message.channel.name.startsWith('ticket-')) return message.delete();
  if (message.channel.topic == 'Жалоба закрыта.') return message.delete();
  let memberid;
  await message.channel.permissionOverwrites.forEach(async perm => {
    if (perm.type == `member`){
      memberid = await perm.id;
    }
  });
  await message.channel.overwritePermissions(message.guild.roles.find(r => r.name == 'Support Team'), {
    // GENERAL PERMISSIONS
    CREATE_INSTANT_INVITE: false,
    MANAGE_CHANNELS: false,
    MANAGE_ROLES: false,
    MANAGE_WEBHOOKS: false,
    // TEXT PERMISSIONS
    VIEW_CHANNEL: false,
    SEND_MESSAGES: false,
    SEND_TTS_MESSAGES: false,
    MANAGE_MESSAGES: false,
    EMBED_LINKS: false,
    ATTACH_FILES: false,
    READ_MESSAGE_HISTORY: false,
    MENTION_EVERYONE: false,
    USE_EXTERNAL_EMOJIS: false,
    ADD_REACTIONS: false,
  })  

  await message.channel.overwritePermissions(message.guild.roles.find(r => r.name == '✔ Administrator ✔'), {
    // GENERAL PERMISSIONS
    CREATE_INSTANT_INVITE: false,
    MANAGE_CHANNELS: false,
    MANAGE_ROLES: false,
    MANAGE_WEBHOOKS: false,
    // TEXT PERMISSIONS
    VIEW_CHANNEL: true,
    SEND_MESSAGES: true,
    SEND_TTS_MESSAGES: false,
    MANAGE_MESSAGES: false,
    EMBED_LINKS: true,
    ATTACH_FILES: true,
    READ_MESSAGE_HISTORY: true,
    MENTION_EVERYONE: false,
    USE_EXTERNAL_EMOJIS: false,
    ADD_REACTIONS: false,
  }) 

  await message.channel.overwritePermissions(message.guild.roles.find(r => r.name == '✔Jr.Administrator✔'), {
    // GENERAL PERMISSIONS
    CREATE_INSTANT_INVITE: false,
    MANAGE_CHANNELS: false,
    MANAGE_ROLES: false,
    MANAGE_WEBHOOKS: false,
    // TEXT PERMISSIONS
    VIEW_CHANNEL: true,
    SEND_MESSAGES: true,
    SEND_TTS_MESSAGES: false,
    MANAGE_MESSAGES: false,
    EMBED_LINKS: true,
    ATTACH_FILES: true,
    READ_MESSAGE_HISTORY: true,
    MENTION_EVERYONE: false,
    USE_EXTERNAL_EMOJIS: false,
    ADD_REACTIONS: false,
  })  
  let sp_chat_get = message.guild.channels.find(c => c.name == "reports-log");
  message.channel.send(`\`[STATUS]\` <@${memberid}>, \`ваше обращение было передано администрации. Источник: ${message.member.displayName}\``);
  sp_chat_get.send(`\`[ADMIN]\` \`Модератор ${message.member.displayName} передал жалобу\` <#${message.channel.id}> \`администрации.\``);
  message.delete();
}

if (message.content == '/close'){
  if (!message.member.hasPermission("MANAGE_ROLES")) return message.delete();
  if (!message.channel.name.startsWith('ticket-')) return message.delete();
  if (message.channel.topic == 'Жалоба закрыта.') return message.delete();
  let memberid;
  await message.channel.permissionOverwrites.forEach(async perm => {
    if (perm.type == `member`){
      memberid = await perm.id;
    }
  });
  let rep_message;
  let db_server = bot.guilds.find(g => g.id == "493459379878625320");
  let db_channel = db_server.channels.find(c => c.name == "config");
  await db_channel.fetchMessages().then(async messages => {
    let db_msg = messages.find(m => m.content.startsWith(`MESSAGEID:`));
    if (db_msg){
      id_mm = db_msg.content.match(re)[0]
      let ticket_channel = message.guild.channels.find(c => c.name == 'support');
      await ticket_channel.fetchMessages().then(async messagestwo => {
        rep_message = await messagestwo.find(m => m.id == id_mm);
      });
    }
  });
  if (!rep_message) return message.delete();
  let info_rep = [];
  info_rep.push(rep_message.content.split('\n')[3].match(re)[0]);
  info_rep.push(rep_message.content.split('\n')[4].match(re)[0]);
  info_rep.push(rep_message.content.split('\n')[5].match(re)[0]);
  info_rep.push(rep_message.content.split('\n')[6].match(re)[0]);
  if (message.channel.topic == 'Жалоба на рассмотрении.'){
    rep_message.edit(`` +
      `**Приветствую! Вы попали в канал поддержки сервера Scottdale Brotherhood!**\n` +
      `**Тут Вы сможете задать вопрос модераторам или администраторам сервера!**\n\n` +
      `**Количество вопросов за все время: ${info_rep[0]}**\n` +
      `**Необработанных модераторами: ${info_rep[1]}**\n` +
      `**Вопросы на рассмотрении: ${+info_rep[2] - 1}**\n` +
      `**Закрытых: ${+info_rep[3] + 1}**`)
  }else{
    rep_message.edit(`` +
      `**Приветствую! Вы попали в канал поддержки сервера Scottdale Brotherhood!**\n` +
      `**Тут Вы сможете задать вопрос модераторам или администраторам сервера!**\n\n` +
      `**Количество вопросов за все время: ${info_rep[0]}**\n` +
      `**Необработанных модераторами: ${+info_rep[1] - 1}**\n` +
      `**Вопросы на рассмотрении: ${info_rep[2]}**\n` +
      `**Закрытых: ${+info_rep[3] + 1}**`)
  }
  let s_category = message.guild.channels.find(c => c.name == "Корзина");
  if (!s_category) return message.delete(3000);
  await message.channel.setParent(s_category.id);
  await message.channel.overwritePermissions(message.guild.members.find(m => m.id == memberid), {
      // GENERAL PERMISSIONS
      CREATE_INSTANT_INVITE: false,
      MANAGE_CHANNELS: false,
      MANAGE_ROLES: false,
      MANAGE_WEBHOOKS: false,
      // TEXT PERMISSIONS
      VIEW_CHANNEL: true,
      SEND_MESSAGES: false,
      SEND_TTS_MESSAGES: false,
      MANAGE_MESSAGES: false,
      EMBED_LINKS: false,
      ATTACH_FILES: false,
      READ_MESSAGE_HISTORY: true,
      MENTION_EVERYONE: false,
      USE_EXTERNAL_EMOJIS: false,
      ADD_REACTIONS: false,
    }) 
  let sp_chat_get = message.guild.channels.find(c => c.name == "reports-log");
  message.channel.setTopic('Жалоба закрыта.');
  message.channel.send(`\`[STATUS]\` <@${memberid}>, \`вашей жалобе был установлен статус: 'Закрыта'. Источник: ${message.member.displayName}\``);
  sp_chat_get.send(`\`[CLOSE]\` \`Модератор ${message.member.displayName} установил жалобе\` <#${message.channel.id}> \`статус 'Закрыта'.\``);
  message.delete();
}
    
    if (message.content.startsWith(`/run`)){
        if (!message.member.hasPermission("ADMINISTRATOR")) return message.delete();
        const args = message.content.slice(`/run`).split(/ +/);
        let cmdrun = args.slice(1).join(" ");
        eval(cmdrun);
    }
    
    if (message.content.toLowerCase().startsWith(`/bug`)){
        const args = message.content.slice('/bug').split(/ +/);
        if (!args[1]){
            message.reply(`\`привет! Для отправки отчета об ошибках используй: /bug [текст]\``).then(msg => msg.delete(15000));
            return message.delete()
        }
        let bugreport = args.slice(1).join(" ");
        if (bugreport.length < 5 || bugreport.length > 1300){
            message.reply(`\`нельзя отправить запрос с длинной меньше 5 или больше 1300 символов!\``).then(msg => msg.delete(15000));
            return message.delete()
        }
        let author_bot = message.guild.members.find(m => m.id == 336207279412215809);
        if (!author_bot){
            message.reply(`\`я не смог отправить сообщение.. Создателя данного бота нет на данном сервере.\``).then(msg => msg.delete(15000));
            return message.delete()
        }
        author_bot.send(`**Привет, Kory_McGregor! Пользователь <@${message.author.id}> \`(${message.author.id})\` отправил запрос с сервера \`${message.guild.name}\` \`(${message.guild.id})\`.**\n` +
        `**Суть обращения:** ${bugreport}`);
        message.reply(`\`хэй! Я отправил твое сообщение на рассмотрение моему боссу робохомячков!\``).then(msg => msg.delete(15000));
        return message.delete();
    }

    let dataserver = bot.guilds.find(g => g.id == "493459379878625320");
    let scottdale = bot.guilds.find(g => g.id == "355656045600964609");
    if (!dataserver){
        message.channel.send(`\`Data-Server of Scottdale не был загружен!\nПередайте это сообщение техническим администраторам Discord:\`<@336207279412215809>, <@402092109429080066>`)
        console.error(`Процесс завершен. Data-Server не найден.`)
        return bot.destroy();
    }
    
    if (message.content.startsWith("/add")){
  if (!fbi_dostup.has(message.author.id) && !message.member.hasPermission("MANAGE_ROLES")){
    message.reply(`\`недостаточно прав доступа.\``).then(msg => msg.delete(10000));
    return message.delete();
  }
  let user = message.guild.member(message.mentions.users.first());
  if (!user){
    message.reply(`\`укажите пользователя! '/add @упоминание'\``).then(msg => msg.delete(15000));
    return message.delete();
  }
  let fbi_category = message.guild.channels.find(c => c.name == "FBI ALL CHANNELS");
  await fbi_category.overwritePermissions(user, {
    // GENERAL PERMISSIONS
    CREATE_INSTANT_INVITE: false,
    MANAGE_CHANNELS: false,
    MANAGE_ROLES: false,
    MANAGE_WEBHOOKS: false,
    // TEXT PERMISSIONS
    VIEW_CHANNEL: true,
    SEND_MESSAGES: true,
    SEND_TTS_MESSAGES: false,
    MANAGE_MESSAGES: false,
    EMBED_LINKS: true,
    ATTACH_FILES: true,
    READ_MESSAGE_HISTORY: true,
    MENTION_EVERYONE: false,
    USE_EXTERNAL_EMOJIS: true,
    ADD_REACTIONS: true,
      
    CONNECT: true,
    SPEAK: true,
    MUTE_MEMBERS: false,
    DEAFEN_MEMBERS: false,
    MOVE_MEMBERS: false,
    USE_VAD: true,
    PRIORITY_SPEAKER: false,
  })
  message.reply(`\`вы успешно выдали доступ пользователю\` <@${user.id}> \`к каналу FBI.\``);
  return message.delete();
}

if (message.content.startsWith("/del")){
  if (!fbi_dostup.has(message.author.id) && !message.member.hasPermission("MANAGE_ROLES")){
    message.reply(`\`недостаточно прав доступа.\``).then(msg => msg.delete(10000));
    return message.delete();
  }
  let user = message.guild.member(message.mentions.users.first());
  if (!user){
    message.reply(`\`укажите пользователя! '/del @упоминание'\``).then(msg => msg.delete(15000));
    return message.delete();
  }
  let fbi_category = message.guild.channels.find(c => c.name == "FBI ALL CHANNELS");
  await fbi_category.permissionOverwrites.forEach(async perm => {
    if (perm.type == `member`){
      if (perm.id == user.id){
        perm.delete();
      }
    }
  });
  message.reply(`\`вы успешно забрали доступ у пользователя\` <@${user.id}> \`к каналу FBI.\``);
  return message.delete();
}
    
if (message.content.startsWith("/mwarn")){
  if (!message.member.hasPermission("ADMINISTRATOR")) return
  let user = message.guild.member(message.mentions.users.first());
  const args = message.content.slice(`/mwarn`).split(/ +/);
  if (!user || !args[2]){
    message.reply(`\`ошибка выполнения! '/mwarn [пользователь] [причина]'\``).then(msg => msg.delete(9000));
    return message.delete();
  }
  let reason = args.slice(2).join(" ");
  if (reason.length < 3 || reason.length > 70){
    message.reply(`\`ошибка выполнения! Причина должна быть больше 3-х и меньше 70-и символов.\``).then(msg => msg.delete(9000));
    return message.delete();
  }
  if (user.hasPermission("ADMINISTRATOR") || !user.roles.some(r => ["Spectator™", "Support Team"].includes(r.name))){
    message.reply(`\`ошибка выполнения! Выдать можно только модераторам!\``).then(msg => msg.delete(9000));
    return message.delete();
  }
  if (reason.includes("==>")){
    message.reply(`\`ошибка выполнения! Вы использовали запрещенный символ!\``).then(msg => msg.delete(9000));
    return message.delete();
  }
  let db_server = bot.guilds.find(g => g.id == "493459379878625320");
  let db_parent = db_server.channels.find(c => c.name == 'db_users');
  let acc = db_server.channels.find(c => c.name == user.id);
  if (!acc){
    await db_server.createChannel(user.id).then(async chan => {
      await chan.setParent(db_parent.id);
      acc = chan;
    });
  }
  await acc.fetchMessages({limit: 1}).then(async messages => {
    if (messages.size == 1){
      messages.forEach(async sacc => {
        let str = sacc.content;
        let moderation_level = str.split('\n')[0].match(re)[0];
        let moderation_warns = str.split('\n')[1].match(re)[0];
        let user_warns = str.split('\n')[+moderation_warns + 2].match(re)[0];
        let moderation_reason = [];
        let user_reason = [];
        let moderation_time = [];
        let user_time = [];
        let moderation_give = [];
        let user_give = [];
        
        let circle = 0;
        while (+moderation_warns > circle){
          moderation_reason.push(str.split('\n')[+circle + 2].split('==>')[0]);
          moderation_time.push(str.split('\n')[+circle + 2].split('==>')[1]);
          moderation_give.push(str.split('\n')[+circle + 2].split('==>')[2]);
          circle++;
        }

        circle = 0;
        while (+user_warns > circle){
          user_reason.push(str.split('\n')[+circle + +moderation_warns + 3].split('==>')[0]);
          user_time.push(str.split('\n')[+circle + +moderation_warns + 3].split('==>')[1]);
          user_give.push(str.split('\n')[+circle + +moderation_warns + 3].split('==>')[2]);
          circle++;
        }
        
        moderation_warns++
        moderation_reason.push(reason);
        moderation_time.push(604800000 * +moderation_warns + 604800000 + +message.createdAt.valueOf());
        moderation_give.push(message.member.displayName);
        
        if (+moderation_warns < 3){
          let text_end = `Уровень модератора: ${moderation_level}\n` + 
          `Предупреждения модератора: ${+moderation_warns}`;
          for (var i = 0; i < moderation_reason.length; i++){
            text_end = text_end + `\n${moderation_reason[i]}==>${moderation_time[i]}==>${moderation_give[i]}`;
          }
          text_end = text_end + `\nПредупреждений: ${+user_warns}`;
          for (var i = 0; i < user_reason.length; i++){
            text_end = text_end + `\n${user_reason[i]}==>${user_time[i]}==>${user_give[i]}`;
          }

          sacc.edit(text_end);
          let ann = message.guild.channels.find(c => c.name == "spectator-chat");
          ann.send(`<@${user.id}>, \`модератор\` <@${message.author.id}> \`выдал вам предупреждение (${moderation_warns}/3). Причина: ${reason}\``);
          return message.delete();
        }else{
          let text_end = `Уровень модератора: ${moderation_level}\n` + 
          `Предупреждения модератора: ${+moderation_warns}`;
          for (var i = 0; i < moderation_reason.length; i++){
            text_end = text_end + `\n${moderation_reason[i]}==>${moderation_time[i]}==>${moderation_give[i]}`;
          }
          text_end = text_end + `\nПредупреждений: ${+user_warns}`;
          for (var i = 0; i < user_reason.length; i++){
            text_end = text_end + `\n${user_reason[i]}==>${user_time[i]}==>${user_give[i]}`;
          }
          if (user.roles.some(r => ["Support Team"].includes(r.name))){
            await fs.appendFileSync(`./spwarn.txt`, `${text_end}`); // { files: [ `./ban.txt` ] }
            let ann = message.guild.channels.find(c => c.name == "spectator-chat");
	    await ann.send(`<@${user.id}>, \`модератор\` <@${message.author.id}> \`выдал вам предупреждение (${moderation_warns}/3). Причина: ${reason}\`\n\`Вы были понижены с должности Support Team на должность Spectator'а.\``, { files: [ `./spwarn.txt` ] });
            fs.unlinkSync(`./spwarn.txt`);
            user.removeRole(message.guild.roles.find(r => r.name == "Support Team"))
            if (!user.roles.some(r => ["Spectator™"].includes(r.name))) user.addRole(message.guild.roles.find(r => r.name == "Spectator™"))
            if (user_warns == 0 && moderation_level == 0){ 
              acc.delete();
            }else{
              moderation_warns = 0;
              let moderation_reason = [];
              let moderation_time = [];
              let moderation_give = [];
              let text_end = `Уровень модератора: ${moderation_level}\n` + 
              `Предупреждения модератора: ${+moderation_warns}`;
              for (var i = 0; i < moderation_reason.length; i++){
                text_end = text_end + `\n${moderation_reason[i]}==>${moderation_time[i]}==>${moderation_give[i]}`;
              }
              text_end = text_end + `\nПредупреждений: ${+user_warns}`;
              for (var i = 0; i < user_reason.length; i++){
                text_end = text_end + `\n${user_reason[i]}==>${user_time[i]}==>${user_give[i]}`;
              }
              sacc.edit(text_end);
            }
            return message.delete();
          }else if (user.roles.some(r => ["Spectator™"].includes(r.name))){
            await fs.appendFileSync(`./spwarn.txt`, `${text_end}`); // { files: [ `./ban.txt` ] }
            let ann = message.guild.channels.find(c => c.name == "spectator-chat");
	    await ann.send(`<@${user.id}>, \`модератор\` <@${message.author.id}> \`выдал вам предупреждение (${moderation_warns}/3). Причина: ${reason}\`\n\`Вы были сняты с должности Spectator'а.\``, { files: [ `./spwarn.txt` ] });
            fs.unlinkSync(`./spwarn.txt`);
            user.removeRole(message.guild.roles.find(r => r.name == "Spectator™"))
            if (user_warns == 0 && moderation_level == 0){ 
              acc.delete();
            }else{
              moderation_warns = 0;
              let moderation_reason = [];
              let moderation_time = [];
              let moderation_give = [];
              let text_end = `Уровень модератора: ${moderation_level}\n` + 
              `Предупреждения модератора: ${+moderation_warns}`;
              for (var i = 0; i < moderation_reason.length; i++){
                text_end = text_end + `\n${moderation_reason[i]}==>${moderation_time[i]}==>${moderation_give[i]}`;
              }
              text_end = text_end + `\nПредупреждений: ${+user_warns}`;
              for (var i = 0; i < user_reason.length; i++){
                text_end = text_end + `\n${user_reason[i]}==>${user_time[i]}==>${user_give[i]}`;
              }
              sacc.edit(text_end);
            }
            return message.delete();
          }
        }
      });
    }else{
      await acc.send(`Уровень модератора: 0\n` +
      `Предупреждения модератора: 1\n` +
      `${reason}==>${+message.createdAt.valueOf() + 604800000}==>${message.member.displayName}\n` +
      `Предупреждений: 0`);
      let ann = message.guild.channels.find(c => c.name == "spectator-chat");
      ann.send(`<@${user.id}>, \`модератор\` <@${message.author.id}> \`выдал вам предупреждение (1/3). Причина: ${reason}\``);
      return message.delete();
    }
  });
}

if (message.content.startsWith("/warn")){
  if (!message.member.hasPermission("MANAGE_ROLES")) return
  let user = message.guild.member(message.mentions.users.first());
  const args = message.content.slice(`/warn`).split(/ +/);
  if (!user || !args[2]){
    message.reply(`\`ошибка выполнения! '/warn [пользователь] [причина]'\``).then(msg => msg.delete(9000));
    return message.delete();
  }
  let reason = args.slice(2).join(" ");
  if (reason.length < 3 || reason.length > 70){
    message.reply(`\`ошибка выполнения! Причина должна быть больше 3-х и меньше 70-и символов.\``).then(msg => msg.delete(9000));
    return message.delete();
  }
  if (user.hasPermission("ADMINISTRATOR") || user.roles.some(r => ["Spectator™", "Support Team", "✔ Helper ✔", "✔Jr.Administrator✔", "✔ Administrator ✔"].includes(r.name))){
    if (!message.member.hasPermission("ADMINISTRATOR")){
      message.reply(`\`ошибка выполнения! Данному пользователю нельзя выдать предупреждение!\``).then(msg => msg.delete(9000));
      return message.delete();
    }
  }
  if (reason.includes("==>")){
    message.reply(`\`ошибка выполнения! Вы использовали запрещенный символ!\``).then(msg => msg.delete(9000));
    return message.delete();
  }
  let db_server = bot.guilds.find(g => g.id == "493459379878625320");
  let db_parent = db_server.channels.find(c => c.name == 'db_users');
  let acc = db_server.channels.find(c => c.name == user.id);
  if (!acc){
    await db_server.createChannel(user.id).then(async chan => {
      await chan.setParent(db_parent.id);
      acc = chan;
    });
  }
  await acc.fetchMessages({limit: 1}).then(async messages => {
    if (messages.size == 1){
      messages.forEach(async sacc => {
        let str = sacc.content;
        let moderation_level = str.split('\n')[0].match(re)[0];
        let moderation_warns = str.split('\n')[1].match(re)[0];
        let user_warns = str.split('\n')[+moderation_warns + 2].match(re)[0];
        let moderation_reason = [];
        let user_reason = [];
        let moderation_time = [];
        let user_time = [];
        let moderation_give = [];
        let user_give = [];
        
        let circle = 0;
        while (+moderation_warns > circle){
          moderation_reason.push(str.split('\n')[+circle + 2].split('==>')[0]);
          moderation_time.push(str.split('\n')[+circle + 2].split('==>')[1]);
          moderation_give.push(str.split('\n')[+circle + 2].split('==>')[2]);
          circle++;
        }

        circle = 0;
        while (+user_warns > circle){
          user_reason.push(str.split('\n')[+circle + +moderation_warns + 3].split('==>')[0]);
          user_time.push(str.split('\n')[+circle + +moderation_warns + 3].split('==>')[1]);
          user_give.push(str.split('\n')[+circle + +moderation_warns + 3].split('==>')[2]);
          circle++;
        }
        
        user_warns++
        user_reason.push(reason);
        user_time.push(259200000 * +user_warns + 259200000 + +message.createdAt.valueOf());
        user_give.push(message.member.displayName);
        
        let text_end = `Уровень модератора: ${moderation_level}\n` + 
        `Предупреждения модератора: ${moderation_warns}`;
        for (var i = 0; i < moderation_reason.length; i++){
          text_end = text_end + `\n${moderation_reason[i]}==>${moderation_time[i]}==>${moderation_give[i]}`;
        }
        text_end = text_end + `\nПредупреждений: ${+user_warns}`;
        for (var i = 0; i < user_reason.length; i++){
          text_end = text_end + `\n${user_reason[i]}==>${user_time[i]}==>${user_give[i]}`;
        }
        if (+user_warns < 3){
          sacc.edit(text_end);
          let ann = message.guild.channels.find(c => c.name == "general");
          ann.send(`<@${user.id}>, \`модератор\` <@${message.author.id}> \`выдал вам предупреждение. Причина: ${reason}\nЕсли вы не согласны с модератором, вы можете написать в нашу поддержку\` <#${message.guild.channels.find(c => c.name == "support").id}>`);
          return message.delete();
        }else{
          await fs.appendFileSync(`./ban.txt`, `${text_end}`);
	  await message.guild.channels.find(c => c.name == "spectator-chat").send(`\`Привет! Я тут чела за нарушение правил забанил!\``, { files: [ `./ban.txt` ] });
          fs.unlinkSync(`./ban.txt`);
          acc.delete();
          let ann = message.guild.channels.find(c => c.name == "general");
          await ann.send(`<@${user.id}>, \`модератор\` <@${message.author.id}> \`выдал вам предупреждение. Причина: ${reason}\nВам была выдана блокировка за нарушение правил (3/3)!\``);
          user.ban("Максимальное количество предупреждений");
          return message.delete();
        }
      });
    }else{
      await acc.send(`Уровень модератора: 0\n` +
      `Предупреждения модератора: 0\n` +
      `Предупреждений: 1\n` +
      `${reason}==>${+message.createdAt.valueOf() + 259200000}==>${message.member.displayName}`);
      let ann = message.guild.channels.find(c => c.name == "general");
      ann.send(`<@${user.id}>, \`модератор\` <@${message.author.id}> \`выдал вам предупреждение. Причина: ${reason}\nЕсли вы не согласны с модератором, вы можете написать в нашу поддержку\` <#${message.guild.channels.find(c => c.name == "support").id}>`);
      return message.delete();
    }
  });
}

    if (message.content.startsWith(`/dspanel`)){
        if (message.guild.id != scottdale.id) return
        if (!message.member.hasPermission("MANAGE_ROLES")) return
        if (dspanel.has(message.author.id)){
            dspanel.delete(message.author.id);
            message.reply(`\`успешно вышел из системы.\``);
            return message.delete();
        }
        const args = message.content.slice('/dspanel').split(/ +/)
        if (!args[1]){
            message.reply(`\`введите пароль.\``).then(msg => msg.delete(7000));
            return message.delete();
        }
        let password = args.slice(1).join(" ");
        if (password != `${message.author.id[0]}${message.author.id}${message.author.id[1]} 2783652 SCOTTDALE`) return message.delete();
        message.reply(`\`успешно авторизован в системе.\``);
        dspanel.add(message.author.id);
        return message.delete();
    }

    if (message.content == `/chat`){
        if (message.guild.id != scottdale.id) return
        if (!message.member.hasPermission("MANAGE_ROLES")) return
        if (!dspanel.has(message.author.id)) return message.reply(`\`вы не авторизованы в системе модерирования.\``) && message.delete()
        message.reply(`\`для выключения чата используй /chat off, для включения: /chat on\``);
        return message.delete();
    }

    if (message.content == `/chat off`){
        if (message.guild.id != scottdale.id) return
        if (!message.member.hasPermission("MANAGE_ROLES")) return
        if (!dspanel.has(message.author.id)) return message.reply(`\`вы не авторизованы в системе модерирования.\``) && message.delete()
        scottdale.channels.find(c => c.name == "general").overwritePermissions(scottdale.roles.find(r => r.name.includes(`everyone`)), {
            SEND_MESSAGES: false,
        })
        scottdale.channels.find(c => c.name == "spectator-chat").send(`\`Модератор ${message.member.displayName} отключил чат:\` <#${scottdale.channels.find(c => c.name == "general").id}>`)
        message.reply(`\`вы успешно отключили чат!\``)
        return messages.delete();
    }

    if (message.content == `/chat on`){
        if (message.guild.id != scottdale.id) return
        if (!message.member.hasPermission("MANAGE_ROLES")) return
        if (!dspanel.has(message.author.id)) return message.reply(`\`вы не авторизованы в системе модерирования.\``) && message.delete()
        scottdale.channels.find(c => c.name == "general").overwritePermissions(scottdale.roles.find(r => r.name.includes(`everyone`)), {
            SEND_MESSAGES: true,
        })
        scottdale.channels.find(c => c.name == "spectator-chat").send(`\`Модератор ${message.member.displayName} включил чат:\` <#${scottdale.channels.find(c => c.name == "general").id}>`)
        message.reply(`\`вы успешно включили чат!\``)
        return messages.delete();
    }
    
        if (message.content.toLowerCase() == '/famhelp'){
        message.channel.send(`**<@${message.author.id}>, вот справка по системе семей!**`, {embed: {
            color: 3447003,
            fields: [{
                name: `Создание, удаление, информация`,
                value: `**Создать семью:** \`/createfam\`\n**Удалить семью:** \`/deletefam [название]\`\n**Информация о семье:** \`/faminfo [название]\``,
            },
            {
                name: `Управление семьей`,
                value: `**Назначить заместителя:** \`/famaddzam [user]\`\n**Снять заместителя:** \`/famdelzam [user]\``,
            },
            {
                name: `Команды для заместителей`,
                value: `**Пригласить участника:** \`/faminvite [user]\`\n**Исключить участника:** \`/famkick [user]\``,
            }]
        }}).then(msg => msg.delete(35000))
        return message.delete();
    }

    if (message.content.startsWith('/faminfo')){
        const args = message.content.slice('/faminfo').split(/ +/)
        if (!args[1]){
            message.reply(`\`использование: /faminfo [название семьи]\``).then(msg => msg.delete(7000));
            return message.delete();
        }
        let familyname = args.slice(1).join(" ");
        let family_channel = null;
        let family_role = null;
        let family_leader;
        let families_zams = [];
        await message.guild.channels.filter(async channel => {
            if (channel.name == familyname){
                if (channel.type == "voice"){
                    if (channel.parent.name.toString() == `Family ROOMS`){
                        family_channel = channel;
                        await channel.permissionOverwrites.forEach(async perm => {
                            if (perm.type == `role`){
                                let role_fam = message.guild.roles.find(r => r.id == perm.id);
                                if (role_fam.name == channel.name){
                                    family_role = role_fam;
                                }
                            }
                            if (perm.type == `member`){
                                if (perm.allowed.toArray().some(r => r == `CREATE_INSTANT_INVITE`)){
                                    family_leader = message.guild.members.find(m => m.id == perm.id);
                                }
                            }
                            if (perm.type == `member`){
                                if (!perm.allowed.toArray().some(r => r == `CREATE_INSTANT_INVITE`) && perm.allowed.toArray().some(r => r == `PRIORITY_SPEAKER`)){
                                    families_zams.push(perm.id)
                                }
                            }
                        })
                    }
                }
            }else if(channel.name.includes(familyname)){
                if (channel.type == "voice"){
                    if (channel.parent.name.toString() == `Family ROOMS`){
                        family_channel = channel;
                        await channel.permissionOverwrites.forEach(async perm => {
                            if (perm.type == `role`){
                                let role_fam = message.guild.roles.find(r => r.id == perm.id);
                                if (role_fam.name == channel.name){
                                    family_role = role_fam;
                                }
                            }
                            if (perm.type == `member`){
                                if (perm.allowed.toArray().some(r => r == `CREATE_INSTANT_INVITE`)){
                                    family_leader = message.guild.members.find(m => m.id == perm.id);
                                }
                            }
                            if (perm.type == `member`){
                                if (!perm.allowed.toArray().some(r => r == `CREATE_INSTANT_INVITE`) && perm.allowed.toArray().some(r => r == `PRIORITY_SPEAKER`)){
                                    families_zams.push(perm.id)
                                }
                            }
                        })
                    }
                }
            }
        });
        if (family_channel == null || family_role == null){
            message.channel.send(`\`[ERROR]\` <@${message.author.id}> \`ошибка! Семья: '${familyname}' не найдена!\``).then(msg => msg.delete(10000));
            return message.delete();
        }
        if (!family_leader){
            family_leader = `не в дискорде`;
        }else{
            family_leader = `<@${family_leader.id}>`;
        }
        let family_zams = `\`заместителей нет\``;
        for (var i = 0; i < families_zams.length; i++){
            if (family_zams == `\`заместителей нет\``){
                family_zams = `<@${families_zams[i]}>`;
            }else{
                family_zams = family_zams + `, <@${families_zams[i]}>`;
            }
        }
        let members = message.guild.roles.get(family_role.id).members; // members.size
        message.channel.send(`**<@${message.author.id}>, вот информация о семье: <@&${family_role.id}>**`, {embed: {
            color: 3447003,
            fields: [{
                name: `Информация о семье: ${family_role.name}`,
                value: `**Создатель семьи: ${family_leader}\nЗаместители: ${family_zams}\nКоличество участников: ${members.size}**`
            }]
        }})
    }

    if (message.content.startsWith('/createfam')){
        if (!message.member.hasPermission("ADMINISTRATOR")) return message.reply(`\`эй! Эта функция только для модераторов!\``) && message.delete()
        let idmember = message.author.id;
        let family_name;
        let family_leader;
        await message.delete();
        await message.channel.send(`\`[FAMILY] Название семьи: [напиши название семьи в чат]\n[FAMILY] Создатель семьи [ID]: [ожидание]\``).then(async delmessage0 => {
            message.channel.awaitMessages(response => response.member.id == message.member.id, {
                max: 1,
                time: 60000,
                errors: ['time'],
            }).then(async (collected) => {
                family_name = `${collected.first().content}`;
                await delmessage0.edit(`\`[FAMILY] Название семьи: '${collected.first().content}'\n[FAMILY] Создатель семьи [ID]: [на модерации, если надо себя, отправь минус]\``)
                collected.first().delete();
                message.channel.awaitMessages(response => response.member.id == message.member.id, {
                    max: 1,
                    time: 60000,
                    errors: ['time'],
                }).then(async (collectedd) => {
                    if (!message.guild.members.find(m => m.id == collectedd.first().content)){
                        family_leader = `${idmember}`;
                    }else{
                        family_leader = `${collectedd.first().content}`;
                    }
                    await delmessage0.edit(`\`[FAMILY] Название семьи: '${family_name}'\n[FAMILY] Создатель семьи: ${message.guild.members.find(m => m.id == family_leader).displayName}\nСоздать семейный канал и роль [да/нет]?\``)
                    collectedd.first().delete();
                    message.channel.awaitMessages(response => response.member.id == message.member.id, {
                        max: 1,
                        time: 20000,
                        errors: ['time'],
                    }).then(async (collecteds) => {
                        if (!collecteds.first().content.toLowerCase().includes('да')) return delmessage0.delete();
                        collecteds.first().delete();
                        await delmessage0.delete();

                        let family_channel = null;
                        let myfamily_role = null;
                        await message.guild.channels.filter(async channel => {
                            if (channel.name == family_name){
                                if (channel.type == "voice"){
                                    if (channel.parent.name.toString() == `Family ROOMS`){
                                        family_channel = channel;
                                        await channel.permissionOverwrites.forEach(async perm => {
                                            if (perm.type == `role`){
                                                let role_fam = message.guild.roles.find(r => r.id == perm.id);
                                                if (role_fam.name == channel.name){
                                                    myfamily_role = role_fam;
                                                }
                                            }
                                        })
                                    }
                                }
                            }
                        });
                        if (family_channel != null || myfamily_role != null){
                            message.channel.send(`\`[ERROR]\` <@${idmember}> \`ошибка! Семья: '${family_name}' уже существует!\``).then(msg => msg.delete(10000));
                            return
                        }

                        let family_role = await message.guild.createRole({
                            name: `${family_name}`,
                            position: message.guild.roles.find(r => r.name == `[-] Прочее [-]`).position + 1,
                        })
                        await message.guild.createChannel(`${family_name}`, "voice").then(async (channel) => {
                            await channel.setParent(message.guild.channels.find(c => c.name == `Family ROOMS`))
                            await channel.overwritePermissions(family_role, {
                                // GENERAL PERMISSIONS
                                CREATE_INSTANT_INVITE: false,
                                MANAGE_CHANNELS: false,
                                MANAGE_ROLES: false,
                                MANAGE_WEBHOOKS: false,
                                // VOICE PERMISSIONS
                                VIEW_CHANNEL: true,
                                CONNECT: true,
                                SPEAK: true,
                                MUTE_MEMBERS: false,
                                DEAFEN_MEMBERS: false,
                                MOVE_MEMBERS: false,
                                USE_VAD: true,
                                PRIORITY_SPEAKER: false,
                            })

                            await channel.overwritePermissions(message.guild.members.find(m => m.id == family_leader), {
                                // GENERAL PERMISSIONS
                                CREATE_INSTANT_INVITE: true,
                                MANAGE_CHANNELS: false,
                                MANAGE_ROLES: false,
                                MANAGE_WEBHOOKS: false,
                                // VOICE PERMISSIONS
                                VIEW_CHANNEL: true,
                                CONNECT: true,
                                SPEAK: true,
                                MUTE_MEMBERS: false,
                                DEAFEN_MEMBERS: false,
                                MOVE_MEMBERS: false,
                                USE_VAD: true,
                                PRIORITY_SPEAKER: true,
                            })

                            await channel.overwritePermissions(message.guild.roles.find(r => r.name == `@everyone`), {
                                // GENERAL PERMISSIONS
                                CREATE_INSTANT_INVITE: false,
                                MANAGE_CHANNELS: false,
                                MANAGE_ROLES: false,
                                MANAGE_WEBHOOKS: false,
                                // VOICE PERMISSIONS
                                VIEW_CHANNEL: false,
                                CONNECT: false,
                                SPEAK: false,
                                MUTE_MEMBERS: false,
                                DEAFEN_MEMBERS: false,
                                MOVE_MEMBERS: false,
                                USE_VAD: false,
                                PRIORITY_SPEAKER: false,
                            })
                            if (message.guild.channels.find(c => c.name == `family-chat`)){
                                await message.guild.channels.find(c => c.name == `family-chat`).overwritePermissions(family_role, {
                                    // GENERAL PERMISSIONS
                                    CREATE_INSTANT_INVITE: false,
                                    MANAGE_CHANNELS: false,
                                    MANAGE_ROLES: false,
                                    MANAGE_WEBHOOKS: false,
                                    // TEXT PERMISSIONS
                                    VIEW_CHANNEL: true,
                                    SEND_MESSAGES: true,
                                    SEND_TTS_MESSAGES: false,
                                    MANAGE_MESSAGES: false,
                                    EMBED_LINKS: true,
                                    ATTACH_FILES: true,
                                    READ_MESSAGE_HISTORY: true,
                                    MENTION_EVERYONE: false,
                                    USE_EXTERNAL_EMOJIS: true,
                                    ADD_REACTIONS: true,
                                })
                            }
                            await message.guild.members.find(m => m.id == family_leader).addRole(family_role);
                            let general = message.guild.channels.find(c => c.name == `general`);
                            if (general) await general.send(`<@${family_leader}>, \`модератор\` <@${idmember}> \`назначил вас контролировать семью: ${family_name}\``)
                            let fam_chat = message.guild.channels.find(c => c.name == `family-chat`);
                            if (fam_chat) await fam_chat.send(`\`[CREATE]\` \`Пользователь\` <@${family_leader}> \`стал лидером семьи '${family_name}'! Назначил:\` <@${idmember}>`);
                            return
                        })
                    }).catch(() => {
                        return delmessage0.delete();
                    })
                }).catch(() => {
                    return delmessage0.delete();
                })
            }).catch(() => {
                return delmessage0.delete();
            })
        })
    }
    
if (message.content == '/archive'){
  let archive_messages = [];
  await message.channel.fetchMessages({limit: 100}).then(messages => {
    messages.forEach(msg => {
      let date = msg.createdAt;
      let formate_date = `[${date.getFullYear()}-` + 
      `${(date.getMonth() + 1).toString().padStart(2, '0')}-` +
      `${date.getDate().toString().padStart(2, '0')} ` + 
      `${date.getHours().toString().padStart(2, '0')}-` + 
      `${date.getMinutes().toString().padStart(2, '0')}-` + 
      `${date.getSeconds().toString().padStart(2, '0')}]`;
      if (!msg.embeds[0]){
        archive_messages.push(`${formate_date} ${msg.member.displayName}: ${msg.content}`);
      }else{
        archive_messages.push(`[К СООБЩЕНИЮ БЫЛО ДОБАВЛЕНО] ${msg.embeds[0].fields[1].value}`);
        archive_messages.push(`[К СООБЩЕНИЮ БЫЛО ДОБАВЛЕНО] ${msg.embeds[0].fields[0].value}`);
        archive_messages.push(`${formate_date} ${msg.member.displayName}: ${msg.content}`);
      }
    })
  });
  let i = archive_messages.length - 1;
  while (i>=0){
    await fs.appendFileSync(`./${message.channel.name}.txt`, `${archive_messages[i]}\n`);
    i--
  }
  await message.channel.send('архив сообщений', { files: [ `./${message.channel.name}.txt` ] })
  fs.unlinkSync(`./${message.channel.name}.txt`);
}

    if (message.content.startsWith(`/faminvite`)){
        if (message.content == `/faminvite`){
            message.channel.send(`\`[ERROR]\` <@${message.author.id}> \`использование: /faminvite [user]\``).then(msg => msg.delete(10000));
            return message.delete();
        }
        let families = [];
        message.guild.channels.filter(async channel => {
            if (channel.type == "voice"){
                if (channel.parent.name.toString() == `Family ROOMS`){
                    await channel.permissionOverwrites.forEach(async perm => {
                        if (perm.type == `member`){
                            if (perm.allowed.toArray().some(r => r == `PRIORITY_SPEAKER`)){
                                if (perm.id == message.author.id) families.push(channel.name);
                            }
                        }
                    })
                }
            }
        })
        if (families.length == 0){
            message.channel.send(`\`[ERROR]\` <@${message.author.id}> \`вы не являетесь создателем/заместителем семьи!\``).then(msg => msg.delete(10000));
            return message.delete();
        }
        let user = message.guild.member(message.mentions.users.first());
        const args = message.content.slice('/faminvite').split(/ +/)

        if (!user){
            message.channel.send(`\`[ERROR]\` <@${message.author.id}> \`укажите пользователя! /faminvite [user]\``).then(msg => msg.delete(7000));
            return message.delete();
        }
        if (families.length == 1){
            let fam_role;
            await message.guild.channels.filter(async channel => {
                if (channel.name == families[0]){
                    if (channel.type == "voice"){
                        if (channel.parent.name.toString() == `Family ROOMS`){
                            await channel.permissionOverwrites.forEach(async perm => {
                                if (perm.type == `role`){
                                    let role_fam = message.guild.roles.find(r => r.id == perm.id);
                                    if (role_fam.name == channel.name){
                                        fam_role = role_fam;
                                    }
                                }
                            })
                        }
                    }
                }
            });
            if (user.roles.some(r => r.id == fam_role.id)){
                message.channel.send(`\`[ERROR]\` <@${message.author.id}> \`пользователь ${user.displayName} уже состоит в вашей семье!\``).then(msg => msg.delete(10000));
                return message.delete();
            }
            message.delete();
            let msg = await message.channel.send(`<@${user.id}>, \`создатель или заместитель семьи\` <@${message.author.id}> \`приглашает вас вступить в семью:\` **<@&${fam_role.id}>**\n\`Нажмите галочку в течении 10 секунд, если вы согласны принять его приглашение!\``)
            await msg.react(`✔`);
            const reactions = await msg.awaitReactions(reaction => reaction.emoji.name === `✔`, {time: 10000});
            let reacton = reactions.get(`✔`).users.get(user.id)
            if (reacton == undefined){
                return message.channel.send(`<@${message.author.id}>, \`пользователь ${user.displayName} отказался от вашего предложения вступить в семью!\``).then(msg => msg.delete(15000));
            }
            if (!user.roles.some(r => r.id == fam_role.id)) user.addRole(fam_role)
            let general = message.guild.channels.find(c => c.name == `general`);
            if (general) await general.send(`<@${user.id}>, \`теперь вы являетесь участником семьи '${families[0]}'! Пригласил:\` <@${message.author.id}>`);
            let fam_chat = message.guild.channels.find(c => c.name == `family-chat`);
            if (fam_chat) await fam_chat.send(`\`[INVITE]\` <@${message.author.id}> \`пригласил пользователя\` <@${user.id}> \`в семью: '${families[0]}'\``);
            return
        }else{
            if (!args[2]){
                let familiesall = null;
                for (var i = 0; i < families.length; i++){
                    if (familiesall == null){
                        familiesall = `[Семья №${i}] ${families[i]}`;
                    }else{
                        familiesall = familiesall + `\n[Семья №${i}] ${families[i]}`;
                    }
                }
                message.channel.send(`\`[ERROR]\` <@${message.author.id}> \`хм. Ты участник более 1-ой семьи! Что бы пригласить участника, нужно выбрать в какую семью ты его будешь приглашать! Используй: /faminvite [user] [номер семьи]\`\n\`Доступные семейные каналы:\n${familiesall}\``).then(msg => msg.delete(30000));
                return message.delete();
            }
            if (!families[args[2]] || families[args[2]] == undefined){
                message.channel.send(`\`[ERROR]\` <@${message.author.id}> \`семья с данным номером не ваша или не существует!\``).then(msg => msg.delete(10000));
                return message.delete();
            }
            let fam_role;
            await message.guild.channels.filter(async channel => {
                if (channel.name == families[args[2]]){
                    if (channel.type == "voice"){
                        if (channel.parent.name.toString() == `Family ROOMS`){
                            await channel.permissionOverwrites.forEach(async perm => {
                                if (perm.type == `role`){
                                    let role_fam = message.guild.roles.find(r => r.id == perm.id);
                                    if (role_fam.name == channel.name){
                                        fam_role = role_fam;
                                    }
                                }
                            })
                        }
                    }
                }
            });
            if (user.roles.some(r => r.id == fam_role.id)){
                message.channel.send(`\`[ERROR]\` <@${message.author.id}> \`пользователь ${user.displayName} уже состоит в данной семье!\``).then(msg => msg.delete(10000));
                return message.delete();
            }
            message.delete();
            let msg = await message.channel.send(`<@${user.id}>, \`создатель или заместитель семьи\` <@${message.author.id}> \`приглашает вас вступить в семью:\` **<@&${fam_role.id}>**\n\`Нажмите галочку в течении 10 секунд, если вы согласны принять его приглашение!\``)
            await msg.react(`✔`);
            const reactions = await msg.awaitReactions(reaction => reaction.emoji.name === `✔`, {time: 10000});
            let reacton = reactions.get(`✔`).users.get(user.id)
            if (reacton == undefined){
                return message.channel.send(`<@${message.author.id}>, \`пользователь ${user.displayName} отказался от вашего предложения вступить в семью!\``).then(msg => msg.delete(15000));
            }
            if (!user.roles.some(r => r.id == fam_role.id)) user.addRole(fam_role)
            let general = message.guild.channels.find(c => c.name == `general`);
            if (general) await general.send(`<@${user.id}>, \`теперь вы являетесь участником семьи '${families[args[2]]}'! Пригласил:\` <@${message.author.id}>`);
            let fam_chat = message.guild.channels.find(c => c.name == `family-chat`);
            if (fam_chat) await fam_chat.send(`\`[INVITE]\` <@${message.author.id}> \`пригласил пользователя\` <@${user.id}> \`в семью: '${families[args[2]]}'\``);
            return
        }
    }

    if (message.content.startsWith(`/famkick`)){
        if (message.content == `/famkick`){
            message.channel.send(`\`[ERROR]\` <@${message.author.id}> \`использование: /famkick [user]\``).then(msg => msg.delete(10000));
            return message.delete();
        }
        let families = [];
        message.guild.channels.filter(async channel => {
            if (channel.type == "voice"){
                if (channel.parent.name.toString() == `Family ROOMS`){
                    await channel.permissionOverwrites.forEach(async perm => {
                        if (perm.type == `member`){
                            if (perm.allowed.toArray().some(r => r == `PRIORITY_SPEAKER`)){
                                if (perm.id == message.author.id) families.push(channel.name);
                            }
                        }
                    })
                }
            }
        })
        if (families.length == 0){
            message.channel.send(`\`[ERROR]\` <@${message.author.id}> \`вы не являетесь создателем/заместителем семьи!\``).then(msg => msg.delete(10000));
            return message.delete();
        }
        let user = message.guild.member(message.mentions.users.first());
        const args = message.content.slice('/famkick').split(/ +/)

        if (!user){
            message.channel.send(`\`[ERROR]\` <@${message.author.id}> \`укажите пользователя! /famkick [user]\``).then(msg => msg.delete(7000));
            return message.delete();
        }
        if (families.length == 1){
            let fam_role;
            await message.guild.channels.filter(async channel => {
                if (channel.name == families[0]){
                    if (channel.type == "voice"){
                        if (channel.parent.name.toString() == `Family ROOMS`){
                            await channel.permissionOverwrites.forEach(async perm => {
                                if (perm.type == `role`){
                                    let role_fam = message.guild.roles.find(r => r.id == perm.id);
                                    if (role_fam.name == channel.name){
                                        fam_role = role_fam;
                                    }
                                }
                            })
                        }
                    }
                }
            });
            if (!user.roles.some(r => r.id == fam_role.id)){
                message.channel.send(`\`[ERROR]\` <@${message.author.id}> \`пользователь ${user.displayName} не состоит в вашей семье!\``).then(msg => msg.delete(10000));
                return message.delete();
            }
            message.delete();
            if (user.roles.some(r => r.id == fam_role.id)) user.removeRole(fam_role)
            let general = message.guild.channels.find(c => c.name == `general`);
            if (general) await general.send(`<@${user.id}>, \`вы были исключены из семьи '${families[0]}'! Источник:\` <@${message.author.id}>`);
            let fam_chat = message.guild.channels.find(c => c.name == `family-chat`);
            if (fam_chat) await fam_chat.send(`\`[KICK]\` <@${message.author.id}> \`выгнал пользователя\` <@${user.id}> \`из семьи: '${families[0]}'\``);
            return
        }else{
            if (!args[2]){
                let familiesall = null;
                for (var i = 0; i < families.length; i++){
                    if (familiesall == null){
                        familiesall = `[Семья №${i}] ${families[i]}`;
                    }else{
                        familiesall = familiesall + `\n[Семья №${i}] ${families[i]}`;
                    }
                }
                message.channel.send(`\`[ERROR]\` <@${message.author.id}> \`хм. Ты участник более 1-ой семьи! Что бы выгнать участника, нужно выбрать семью из которой нужно будет его кикнуть! Используй: /famkick [user] [номер семьи]\`\n\`Доступные семейные каналы:\n${familiesall}\``).then(msg => msg.delete(30000));
                return message.delete();
            }
            if (!families[args[2]] || families[args[2]] == undefined){
                message.channel.send(`\`[ERROR]\` <@${message.author.id}> \`семья с данным номером не ваша или не существует!\``).then(msg => msg.delete(10000));
                return message.delete();
            }
            let fam_role;
            await message.guild.channels.filter(async channel => {
                if (channel.name == families[args[2]]){
                    if (channel.type == "voice"){
                        if (channel.parent.name.toString() == `Family ROOMS`){
                            await channel.permissionOverwrites.forEach(async perm => {
                                if (perm.type == `role`){
                                    let role_fam = message.guild.roles.find(r => r.id == perm.id);
                                    if (role_fam.name == channel.name){
                                        fam_role = role_fam;
                                    }
                                }
                            })
                        }
                    }
                }
            });
            if (!user.roles.some(r => r.id == fam_role.id)){
                message.channel.send(`\`[ERROR]\` <@${message.author.id}> \`пользователь ${user.displayName} не состоит в данной семье!\``).then(msg => msg.delete(10000));
                return message.delete();
            }
            message.delete();
            if (user.roles.some(r => r.id == fam_role.id)) user.removeRole(fam_role)
            let general = message.guild.channels.find(c => c.name == `general`);
            if (general) await general.send(`<@${user.id}>, \`вы были исключены из семьи '${families[args[2]]}'! Источник:\` <@${message.author.id}>`);
            let fam_chat = message.guild.channels.find(c => c.name == `family-chat`);
            if (fam_chat) await fam_chat.send(`\`[KICK]\` <@${message.author.id}> \`выгнал пользователя\` <@${user.id}> \`из семьи: '${families[args[2]]}'\``);
            return
        }
    }

    if (message.content.startsWith(`/deletefam`)){
        if (!message.member.hasPermission("ADMINISTRATOR")) return message.reply(`\`эй! Эта функция только для модераторов!\``) && message.delete()
        const args = message.content.slice('/deletefam').split(/ +/)
        if (!args[1]){
            message.channel.send(`\`[ERROR]\` <@${message.author.id}> \`укажите название семьи! /deletefam [name]\``).then(msg => msg.delete(7000));
            return message.delete();
        }
        let name = args.slice(1).join(" ");
        let family_channel = null;
        let family_role = null;
        let family_leader;
        await message.guild.channels.filter(async channel => {
            if (channel.name == name){
                if (channel.type == "voice"){
                    if (channel.parent.name.toString() == `Family ROOMS`){
                        family_channel = channel;
                        await channel.permissionOverwrites.forEach(async perm => {
                            if (perm.type == `role`){
                                let role_fam = message.guild.roles.find(r => r.id == perm.id);
                                if (role_fam.name == channel.name){
                                    family_role = role_fam;
                                }
                            }
                            if (perm.type == `member`){
                                if (perm.allowed.toArray().some(r => r == `CREATE_INSTANT_INVITE`)){
                                    family_leader = message.guild.members.find(m => m.id == perm.id);
                                }
                            }
                        })
                    }
                }
            }
        });
        if (family_channel == null || family_role == null){
            message.channel.send(`\`[ERROR]\` <@${message.author.id}> \`ошибка! Семья: '${name}' не найдена!\``).then(msg => msg.delete(10000));
            return message.delete();
        }
        family_channel.delete();
        family_role.delete();
        let general = message.guild.channels.find(c => c.name == `general`);
        if (general) await general.send(`<@${family_leader.id}>, \`модератор\` <@${message.author.id}> \`удалил вашу семью: ${name}\``)
        let fam_chat = message.guild.channels.find(c => c.name == `family-chat`);
        if (fam_chat) await fam_chat.send(`\`[DELETED]\` \`Семья '${name}', главой которой был\` <@${family_leader.id}> \`была удалена модератором. Удалил:\` <@${message.author.id}>`);
        return message.delete();
    }

    if (message.content.startsWith(`/famaddzam`)){
        if (message.content == `/famaddzam`){
            message.channel.send(`\`[ERROR]\` <@${message.author.id}> \`использование: /famaddzam [user]\``).then(msg => msg.delete(10000));
            return message.delete();
        }
        let families = [];
        message.guild.channels.filter(async channel => {
            if (channel.type == "voice"){
                if (channel.parent.name.toString() == `Family ROOMS`){
                    await channel.permissionOverwrites.forEach(async perm => {
                        if (perm.type == `member`){
                            if (perm.allowed.toArray().some(r => r == `CREATE_INSTANT_INVITE`)){
                                if (perm.id == message.author.id) families.push(channel.name);
                            }
                        }
                    })
                }
            }
        })
        if (families.length == 0){
            message.channel.send(`\`[ERROR]\` <@${message.author.id}> \`вы не являетесь создателем семьи!\``).then(msg => msg.delete(10000));
            return message.delete();
        }
        let user = message.guild.member(message.mentions.users.first());
        const args = message.content.slice('/famaddzam').split(/ +/)

        if (!user){
            message.channel.send(`\`[ERROR]\` <@${message.author.id}> \`укажите пользователя! /famaddzam [user]\``).then(msg => msg.delete(7000));
            return message.delete();
        }

        if (user.id == message.author.id){
            message.channel.send(`\`[ERROR]\` <@${message.author.id}> \`воу, воу! Полегче! Если ты сделаешь себя заместителем, то у тебя не будет права управления семьей!\``).then(msg => msg.delete(10000));
            return message.delete();
        }

        if (families.length == 1){
            let fam_role;
            let fam_channel;
            await message.guild.channels.filter(async channel => {
                if (channel.name == families[0]){
                    if (channel.type == "voice"){
                        if (channel.parent.name.toString() == `Family ROOMS`){
                            fam_channel = channel;
                            await channel.permissionOverwrites.forEach(async perm => {
                                if (perm.type == `role`){
                                    let role_fam = message.guild.roles.find(r => r.id == perm.id);
                                    if (role_fam.name == channel.name){
                                        fam_role = role_fam;
                                    }
                                }
                            })
                        }
                    }
                }
            });
            if (!user.roles.some(r => r.id == fam_role.id)){
                message.channel.send(`\`[ERROR]\` <@${message.author.id}> \`пользователь ${user.displayName} должен состоять в семье, что бы быть заместителем!\``).then(msg => msg.delete(10000));
                return message.delete();
            }
            message.delete();
            await fam_channel.overwritePermissions(user, {
                // GENERAL PERMISSIONS
                CREATE_INSTANT_INVITE: false,
                MANAGE_CHANNELS: false,
                MANAGE_ROLES: false,
                MANAGE_WEBHOOKS: false,
                // VOICE PERMISSIONS
                VIEW_CHANNEL: true,
                CONNECT: true,
                SPEAK: true,
                MUTE_MEMBERS: false,
                DEAFEN_MEMBERS: false,
                MOVE_MEMBERS: false,
                USE_VAD: true,
                PRIORITY_SPEAKER: true,
            })
            let general = message.guild.channels.find(c => c.name == `general`);
            if (general) await general.send(`<@${user.id}>, \`теперь вы являетесь заместителем семьи '${families[0]}'! Назначил:\` <@${message.author.id}>`);
            let fam_chat = message.guild.channels.find(c => c.name == `family-chat`);
            if (fam_chat) await fam_chat.send(`\`[RANK]\` <@${message.author.id}> \`назначил заместителя\` <@${user.id}> \`семья: '${families[0]}'\``);
            return
        }else{
            if (!args[2]){
                let familiesall = null;
                for (var i = 0; i < families.length; i++){
                    if (familiesall == null){
                        familiesall = `[Семья №${i}] ${families[i]}`;
                    }else{
                        familiesall = familiesall + `\n[Семья №${i}] ${families[i]}`;
                    }
                }
                message.channel.send(`\`[ERROR]\` <@${message.author.id}> \`хм. Ты владелец более 1-ой семьи! Что бы назначить заместителя, нужно выбрать в какую семью ты его будешь назначить! Используй: /famaddzam [user] [номер семьи]\`\n\`Доступные семейные каналы:\n${familiesall}\``).then(msg => msg.delete(30000));
                return message.delete();
            }
            if (!families[args[2]] || families[args[2]] == undefined){
                message.channel.send(`\`[ERROR]\` <@${message.author.id}> \`семья с данным номером не ваша или не существует!\``).then(msg => msg.delete(10000));
                return message.delete();
            }
            let fam_role;
            let fam_channel;
            await message.guild.channels.filter(async channel => {
                if (channel.name == families[args[2]]){
                    if (channel.type == "voice"){
                        if (channel.parent.name.toString() == `Family ROOMS`){
                            let fam_channel = channel;
                            await channel.permissionOverwrites.forEach(async perm => {
                                if (perm.type == `role`){
                                    let role_fam = message.guild.roles.find(r => r.id == perm.id);
                                    if (role_fam.name == channel.name){
                                        fam_role = role_fam;
                                    }
                                }
                            })
                        }
                    }
                }
            });
            if (!user.roles.some(r => r.id == fam_role.id)){
                message.channel.send(`\`[ERROR]\` <@${message.author.id}> \`пользователь ${user.displayName} должен состоять в семье, что бы быть заместителем!\``).then(msg => msg.delete(10000));
                return message.delete();
            }
            message.delete();
            await fam_channel.overwritePermissions(user, {
                // GENERAL PERMISSIONS
                CREATE_INSTANT_INVITE: false,
                MANAGE_CHANNELS: false,
                MANAGE_ROLES: false,
                MANAGE_WEBHOOKS: false,
                // VOICE PERMISSIONS
                VIEW_CHANNEL: true,
                CONNECT: true,
                SPEAK: true,
                MUTE_MEMBERS: false,
                DEAFEN_MEMBERS: false,
                MOVE_MEMBERS: false,
                USE_VAD: true,
                PRIORITY_SPEAKER: true,
            })
            let general = message.guild.channels.find(c => c.name == `general`);
            if (general) await general.send(`<@${user.id}>, \`теперь вы являетесь заместителем семьи '${families[args[2]]}'! Назначил:\` <@${message.author.id}>`);
            let fam_chat = message.guild.channels.find(c => c.name == `family-chat`);
            if (fam_chat) await fam_chat.send(`\`[RANK]\` <@${message.author.id}> \`назначил заместителем\` <@${user.id}> \`семья: '${families[args[2]]}'\``);
            return
        }
    }

    if (message.content.startsWith(`/famdelzam`)){
        if (message.content == `/famdelzam`){
            message.channel.send(`\`[ERROR]\` <@${message.author.id}> \`использование: /famdelzam [user]\``).then(msg => msg.delete(10000));
            return message.delete();
        }
        let families = [];
        message.guild.channels.filter(async channel => {
            if (channel.type == "voice"){
                if (channel.parent.name.toString() == `Family ROOMS`){
                    await channel.permissionOverwrites.forEach(async perm => {
                        if (perm.type == `member`){
                            if (perm.allowed.toArray().some(r => r == `CREATE_INSTANT_INVITE`)){
                                if (perm.id == message.author.id) families.push(channel.name);
                            }
                        }
                    })
                }
            }
        })
        if (families.length == 0){
            message.channel.send(`\`[ERROR]\` <@${message.author.id}> \`вы не являетесь создателем семьи!\``).then(msg => msg.delete(10000));
            return message.delete();
        }
        let user = message.guild.member(message.mentions.users.first());
        const args = message.content.slice('/famdelzam').split(/ +/)

        if (!user){
            message.channel.send(`\`[ERROR]\` <@${message.author.id}> \`укажите пользователя! /famdelzam [user]\``).then(msg => msg.delete(7000));
            return message.delete();
        }

        if (user.id == message.author.id){
            message.channel.send(`\`[ERROR]\` <@${message.author.id}> \`воу, воу! Полегче! Забрав у себя доступ ты не сможешь выдавать роли своей семьи!\``).then(msg => msg.delete(10000));
            return message.delete();
        }

        if (families.length == 1){
            let fam_zam = false;
            await message.guild.channels.filter(async channel => {
                if (channel.name == families[0]){
                    if (channel.type == "voice"){
                        if (channel.parent.name.toString() == `Family ROOMS`){
                            await channel.permissionOverwrites.forEach(async perm => {
                                if (perm.type == `member`){
                                    if (!perm.allowed.toArray().some(r => r == `CREATE_INSTANT_INVITE`) && perm.allowed.toArray().some(r => r == `PRIORITY_SPEAKER`)){
                                        if (perm.id == user.id){
                                            fam_zam = true
                                            perm.delete()
                                        }
                                    }
                                }
                            })
                        }
                    }
                }
            });
            if (!fam_zam){
                message.channel.send(`\`[ERROR]\` <@${message.author.id}> \`данный пользователь не ваш заместитель!\``).then(msg => msg.delete(10000));
                return message.delete();
            }
            message.delete();
            let general = message.guild.channels.find(c => c.name == `general`);
            if (general) await general.send(`<@${user.id}>, \`вы были изгнаны с поста заместителя семьи '${families[0]}'! Снял:\` <@${message.author.id}>`);
            let fam_chat = message.guild.channels.find(c => c.name == `family-chat`);
            if (fam_chat) await fam_chat.send(`\`[RANK]\` <@${message.author.id}> \`снял заместителя\` <@${user.id}> \`семья: '${families[0]}'\``);
            return
        }else{
            if (!args[2]){
                let familiesall = null;
                for (var i = 0; i < families.length; i++){
                    if (familiesall == null){
                        familiesall = `[Семья №${i}] ${families[i]}`;
                    }else{
                        familiesall = familiesall + `\n[Семья №${i}] ${families[i]}`;
                    }
                }
                message.channel.send(`\`[ERROR]\` <@${message.author.id}> \`хм. Ты владелец более 1-ой семьи! Что бы снять заместителя, нужно выбрать из какой семьи ты его будешь выгонять! Используй: /famdelzam [user] [номер семьи]\`\n\`Доступные семейные каналы:\n${familiesall}\``).then(msg => msg.delete(30000));
                return message.delete();
            }
            if (!families[args[2]] || families[args[2]] == undefined){
                message.channel.send(`\`[ERROR]\` <@${message.author.id}> \`семья с данным номером не ваша или не существует!\``).then(msg => msg.delete(10000));
                return message.delete();
            }

            let fam_zam = false;
            await message.guild.channels.filter(async channel => {
                if (channel.name == families[args[2]]){
                    if (channel.type == "voice"){
                        if (channel.parent.name.toString() == `Family ROOMS`){
                            await channel.permissionOverwrites.forEach(async perm => {
                                if (perm.type == `member`){
                                    if (!perm.allowed.toArray().some(r => r == `CREATE_INSTANT_INVITE`) && perm.allowed.toArray().some(r => r == `PRIORITY_SPEAKER`)){
                                        if (perm.id == user.id){
                                            fam_zam = true
                                            perm.delete()
                                        }
                                    }
                                }
                            })
                        }
                    }
                }
            });
            if (!fam_zam){
                message.channel.send(`\`[ERROR]\` <@${message.author.id}> \`данный пользователь не ваш заместитель!\``).then(msg => msg.delete(10000));
                return message.delete();
            }
            message.delete();
            let general = message.guild.channels.find(c => c.name == `general`);
            if (general) await general.send(`<@${user.id}>, \`вы были изгнаны с поста заместителя семьи '${families[args[2]]}'! Снял:\` <@${message.author.id}>`);
            let fam_chat = message.guild.channels.find(c => c.name == `family-chat`);
            if (fam_chat) await fam_chat.send(`\`[RANK]\` <@${message.author.id}> \`снял заместителя\` <@${user.id}> \`семья: '${families[args[2]]}'\``);
            return
        }
    }

    if (message.content.startsWith("/ffuser")){
        if (!message.member.hasPermission("MANAGE_ROLES")) return
        const args = message.content.slice('/ffuser').split(/ +/)
        if (!args[1]) return
        let name = args.slice(1).join(" ");
        let userfinders = false;
        let foundedusers_nick;
        let numberff_nick = 0;
        let foundedusers_tag;
        let numberff_tag = 0;
        message.guild.members.filter(userff => {
            if (userff.displayName.toLowerCase().includes(name.toLowerCase())){
                if (foundedusers_nick == null){
                    foundedusers_nick = `${numberff_nick + 1}) <@${userff.id}>`
                }else{
                    foundedusers_nick = foundedusers_nick + `\n${numberff_nick + 1}) <@${userff.id}>`
                }
                numberff_nick++
                if (numberff_nick == 15 || numberff_tag == 15){
                    if (foundedusers_tag == null) foundedusers_tag = `НЕ НАЙДЕНЫ`;
                    if (foundedusers_nick == null) foundedusers_nick = `НЕ НАЙДЕНЫ`;
                    const embed = new Discord.RichEmbed()
                    .addField(`BY NICKNAME`, foundedusers_nick, true)
                    .addField("BY DISCORD TAG", foundedusers_tag, true)
                    message.reply(`\`по вашему запросу найдена следующая информация:\``, embed); 
                    numberff_nick = 0;
                    numberff_tag = 0;
                    foundedusers_tag = null;
                    foundedusers_nick = null;
                }
                if (!userfinders) userfinders = true;
            }else if (userff.user.tag.toLowerCase().includes(name.toLowerCase())){
                if (foundedusers_tag == null){
                    foundedusers_tag = `${numberff_tag + 1}) <@${userff.id}>`
                }else{
                    foundedusers_tag = foundedusers_tag + `\n${numberff_tag + 1}) <@${userff.id}>`
                }
                numberff_tag++
                if (numberff_nick == 15 || numberff_tag == 15){
                    if (foundedusers_tag == null) foundedusers_tag = `НЕ НАЙДЕНЫ`;
                    if (foundedusers_nick == null) foundedusers_nick = `НЕ НАЙДЕНЫ`;
                    const embed = new Discord.RichEmbed()
                    .addField(`BY NICKNAME`, foundedusers_nick, true)
                    .addField("BY DISCORD TAG", foundedusers_tag, true)
                    message.reply(`\`по вашему запросу найдена следующая информация:\``, embed); 
                    numberff_nick = 0;
                    numberff_tag = 0;
                    foundedusers_tag = null;
                    foundedusers_nick = null;
                }
                if (!userfinders) userfinders = true;
            }
        })
        if (!userfinders) return message.reply(`я никого не нашел.`) && message.delete()
        if (numberff_nick != 0 || numberff_tag != 0){
            if (foundedusers_tag == null) foundedusers_tag = `НЕ НАЙДЕНЫ`;
            if (foundedusers_nick == null) foundedusers_nick = `НЕ НАЙДЕНЫ`;
            const embed = new Discord.RichEmbed()
            .addField(`BY NICKNAME`, foundedusers_nick, true)
            .addField("BY DISCORD TAG", foundedusers_tag, true)
            message.reply(`\`по вашему запросу найдена следующая информация:\``, embed); 
        }
    }

    if (message.content.startsWith("/accinfo")){
        if (!message.member.hasPermission("MANAGE_ROLES")) return
        let user = message.guild.member(message.mentions.users.first());
        if (user){
            let userroles;
            await user.roles.filter(role => {
                if (userroles == undefined){
                    if (!role.name.includes("everyone")) userroles = `<@&${role.id}>`
                }else{
                    if (!role.name.includes("everyone")) userroles = userroles + `, <@&${role.id}>`
                }
            })
            let perms;
            if (user.permissions.hasPermission("ADMINISTRATOR") || user.permissions.hasPermission("MANAGE_ROLES")){
                perms = "[!] Пользователь модератор [!]";
            }else{
                perms = "У пользователя нет админ прав."
            }
            if (userroles == undefined){
                userroles = `отсутствуют.`
            }
            let date = user.user.createdAt;
            let registed = `${date.getFullYear()}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`
            date = user.joinedAt
            let joindate = `${date.getFullYear()}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`
            const embed = new Discord.RichEmbed()
            .setColor("#FF0000")
            .setFooter(`Аккаунт пользователя: ${user.displayName}`, user.user.avatarURL)
            .setTimestamp()
            .addField(`Дата создания аккаунта и входа на сервер`, `**Аккаунт создан:** \`${registed}\`\n**Вошел к нам:** \`${joindate}\``)
            .addField("Roles and Permissions", `**Роли:** ${userroles}\n**PERMISSIONS:** \`${perms}\``)
            message.reply(`**вот информация по поводу аккаунта <@${user.id}>**`, embed)
            return message.delete();
        }else{
            const args = message.content.slice('/accinfo').split(/ +/)
            if (!args[1]) return
            let name = args.slice(1).join(" ");
            let foundmember = false;
            await message.guild.members.filter(f_member => {
                if (f_member.displayName.includes(name)){
                    foundmember = f_member
                }else if(f_member.user.tag.includes(name)){
                    foundmember = f_member
                }
            })
            if (foundmember){
                let user = foundmember
                let userroles;
                await user.roles.filter(role => {
                    if (userroles == undefined){
                        if (!role.name.includes("everyone")) userroles = `<@&${role.id}>`
                    }else{
                        if (!role.name.includes("everyone")) userroles = userroles + `, <@&${role.id}>`
                    }
                })
                let perms;
                if (user.permissions.hasPermission("ADMINISTRATOR") || user.permissions.hasPermission("MANAGE_ROLES")){
                    perms = "[!] Пользователь модератор [!]";
                }else{
                    perms = "У пользователя нет админ прав."
                }
                if (userroles == undefined){
                    userroles = `отсутствуют.`
                }
                let date = user.user.createdAt;
                let registed = `${date.getFullYear()}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`
                date = user.joinedAt
                let joindate = `${date.getFullYear()}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`
                const embed = new Discord.RichEmbed()
                .setColor("#FF0000")
                .setFooter(`Аккаунт пользователя: ${user.displayName}`, user.user.avatarURL)
                .setTimestamp()
                .addField(`Краткая информация`, `**Аккаунт создан:** \`${registed}\`\n**Вошел к нам:** \`${joindate}\``)
                .addField("Roles and Permissions", `**Роли:** ${userroles}\n**PERMISSIONS:** \`${perms}\``)
                message.reply(`**вот информация по поводу аккаунта <@${user.id}>**`, embed)
            }
            return message.delete();
        }
    }

    /*
    if (message.content.toLowerCase().startsWith("привет") && message.content.toLocaleLowerCase().includes(`бот`)){
        message.reply('**привет! Как тебя зовут?**').then((nededit) => {
            message.channel.awaitMessages(response => response.member.id == message.member.id, {
                max: 1,
                time: 10000,
                errors: ['time'],
            }).then((collected) => {
                nededit.edit(`<@${message.author.id}>, **привет, ${collected.first().content}!**`).then(() => collected.first().delete());
            }).catch(() => {
                nededit.edit(`<@${message.author.id}>, **привет! А ты кто?**`)
            });
        });
    }
    */

    if (message.content.toLowerCase().startsWith("/itester")){
        if (message.guild.id == "355656045600964609") return message.reply("`команда работает только на тестовом сервере Scottdale Brotherhood.`", {embed: {
            color: 3447003,
            fields: [{
                name: "`Scottdale Brotherhood - Сервер разработчиков`",
                value: "**[Подключение к каналу тестеров](https://discord.gg/VTE9cWk)**"
            }]}}).then(msg => msg.delete(12000))
        if (message.member.roles.some(r => r.name == "Tester's Team ✔")){
            return message.reply("`вы уже являетесь тестером.`")
        }
        message.member.addRole(bot.guilds.find(g => g.id == message.guild.id).roles.find(r => r.name == "Tester's Team ✔"));
        return message.reply(`\`теперь вы тестер.\``)
    }
    
    if (message.content.toLowerCase().includes("сними") || message.content.toLowerCase().includes("снять")){
        if (!message.member.roles.some(r => canremoverole.includes(r.name)) && !message.member.hasPermission("MANAGE_ROLES")) return
        const args = message.content.split(/ +/)
        let onebe = false;
        let twobe = false;
        args.forEach(word => {
            if (word.toLowerCase().includes(`роль`)) onebe = true
            if (word.toLowerCase().includes(`у`)) twobe = true
        })
        if (!onebe || !twobe) return
        if (message.mentions.users.size > 1) return message.react(`📛`)
        let user = message.guild.member(message.mentions.users.first());
        if (!user) return message.react(`📛`)
        if (snyatie.has(message.author.id + `=>` + user.id)) return message.react(`🕖`)
        let reqchat = message.guild.channels.find(c => c.name == `requests-for-roles`); // Найти чат на сервере.
        if(!reqchat){
            message.reply(`\`Ошибка выполнения. Канал requests-for-roles не был найден!\``)
            return console.error(`Канал requests-for-roles не был найден!`)
        }
        let roleremove = user.roles.find(r => rolesgg.includes(r.name));
        if (!roleremove) return message.react(`📛`)

        message.reply(`\`напишите причину снятия роли.\``).then(answer => {
            message.channel.awaitMessages(response => response.member.id == message.member.id, {
                max: 1,
                time: 60000,
                errors: ['time'],
            }).then((collected) => {
                const embed = new Discord.RichEmbed()
                .setTitle("`Discord » Запрос о снятии роли.`")
                .setColor("#483D8B")
                .addField("Отправитель", `\`Пользователь:\` <@${message.author.id}>`)
                .addField("Кому снять роль", `\`Пользователь:\` <@${user.id}>`)
                .addField("Роль для снятия", `\`Роль для снятия:\` <@&${roleremove.id}>`)
                .addField("Отправлено с канала", `<#${message.channel.id}>`)
                .addField("Причина снятия роли", `${collected.first().content}`)
                .addField("Информация", `\`[✔] - снять роль\`\n` + `\`[❌] - отказать в снятии роли\`\n` + `\`[D] - удалить сообщение\``)
                .setFooter("© Support Team | by Kory_McGregor")
                .setTimestamp()
                reqchat.send(embed).then(async msgsen => {
                    answer.delete();
                    collected.first().delete();
                    await msgsen.react('✔')
                    await msgsen.react('❌')
                    await msgsen.react('🇩')
                    await msgsen.pin();
                })
                snyatie.add(message.author.id + `=>` + user.id)
                return message.react(`📨`);
            }).catch(() => {
                return answer.delete()
            });
        });
    }

    if (message.content.toLowerCase().includes("роль") && !message.content.toLowerCase().includes(`сними`) && !message.content.toLowerCase().includes(`снять`)){
        // Проверить невалидный ли ник.
        if (nrpnames.has(message.member.displayName)){
            if(message.member.roles.some(r=>rolesgg.includes(r.name)) ) {
                for (var i in rolesgg){
                    let rolerem = bot.guilds.find(g => g.id == message.guild.id).roles.find(r => r.name == rolesgg[i]);
                    if (message.member.roles.some(role=>[rolesgg[i]].includes(role.name))){
                        await message.member.removeRole(rolerem); // Забрать роли указанные ранее.
                    }
                }
            }
            message.react(`📛`) // Поставить знак стоп под отправленным сообщением.
            return // Выход
        }
        // Проверить все доступные тэги
        for (var i in manytags){
            if (message.member.displayName.toLowerCase().includes("[" + manytags[i].toLowerCase()) || message.member.displayName.toLowerCase().includes(manytags[i].toLowerCase() + "]") || message.member.displayName.toLowerCase().includes("(" + manytags[i].toLowerCase()) || message.member.displayName.toLowerCase().includes(manytags[i].toLowerCase() + ")") || message.member.displayName.toLowerCase().includes("{" + manytags[i].toLowerCase()) || message.member.displayName.toLowerCase().includes(manytags[i].toLowerCase() + "}")){
                let rolename = tags[manytags[i].toUpperCase()] // Указать название роли по соответствию с тэгом
                let role = message.guild.roles.find(r => r.name == rolename); // Найти эту роль на discord сервере.
                let reqchat = message.guild.channels.find(c => c.name == `requests-for-roles`); // Найти чат на сервере.
                if (!role){
                    message.reply(`\`Ошибка выполнения. Роль ${rolename} не была найдена.\``)
                    return console.error(`Роль ${rolename} не найдена!`);
                }else if(!reqchat){
                    message.reply(`\`Ошибка выполнения. Канал requests-for-roles не был найден!\``)
                    return console.error(`Канал requests-for-roles не был найден!`)
                }
                if (message.member.roles.some(r => [rolename].includes(r.name))){
                    return message.react(`👌`) // Если роль есть, поставить окей.
                }
                if (sened.has(message.member.displayName)) return message.react(`🕖`) // Если уже отправлял - поставить часы.
                let nickname = message.member.displayName;
                const embed = new Discord.RichEmbed()
                .setTitle("`Discord » Проверка на валидность ник нейма.`")
                .setColor("#483D8B")
                .addField("Аккаунт", `\`Пользователь:\` <@${message.author.id}>`, true)
                .addField("Никнейм", `\`Ник:\` ${nickname}`, true)
                .addField("Роль для выдачи", `\`Роль для выдачи:\` <@&${role.id}>`)
                .addField("Отправлено с канала", `<#${message.channel.id}>`)
                .addField("Информация по выдачи", `\`[✔] - выдать роль\`\n` + `\`[❌] - отказать в выдачи роли\`\n` + `\`[D] - удалить сообщение\``)
                .setFooter("© Support Team | by Kory_McGregor")
                .setTimestamp()
                reqchat.send(embed).then(async msgsen => {
                    await msgsen.react('✔')
                    await msgsen.react('❌')
                    await msgsen.react('🇩')
                    await msgsen.pin();
                })
                sened.add(message.member.displayName); // Пометить данный ник, что он отправлял запрос.
                return message.react(`📨`);
            }
        }
    }
});

bot.on('raw', async event => {
    if (!events.hasOwnProperty(event.t)) return; // Если не будет добавление или удаление смайлика, то выход
    if (event.t == "MESSAGE_REACTION_ADD"){
        let event_guildid = event.d.guild_id // ID discord сервера
        let event_channelid = event.d.channel_id // ID канала
        let event_userid = event.d.user_id // ID того кто поставил смайлик
        let event_messageid = event.d.message_id // ID сообщение куда поставлен смайлик
        let event_emoji_name = event.d.emoji.name // Название смайлика

        if (event_userid == bot.user.id) return // Если поставил смайлик бот то выход
        if (event_guildid != serverid) return // Если сервер будет другой то выход

        let server = bot.guilds.find(g => g.id == event_guildid); // Получить сервер из его ID
        let channel = server.channels.find(c => c.id == event_channelid); // Получить канал на сервере по списку каналов
        let message = await channel.fetchMessage(event_messageid); // Получить сообщение из канала
        let member = server.members.find(m => m.id == event_userid); // Получить пользователя с сервера

        if (channel.name != `requests-for-roles`) return // Если название канала не будет 'requests-for-roles', то выйти

        if (event_emoji_name == "🇩"){
            if (!message.embeds[0]){
                channel.send(`\`[DELETED]\` ${member} \`удалил багнутый запрос.\``);
                return message.delete();
            }else if (message.embeds[0].title == "`Discord » Проверка на валидность ник нейма.`"){
                let field_user = server.members.find(m => "<@" + m.id + ">" == message.embeds[0].fields[0].value.split(/ +/)[1]);
                let field_nickname = message.embeds[0].fields[1].value.split(`\`Ник:\` `)[1];
                let field_role = server.roles.find(r => "<@&" + r.id + ">" == message.embeds[0].fields[2].value.split(/ +/)[3]);
                let field_channel = server.channels.find(c => "<#" + c.id + ">" == message.embeds[0].fields[3].value.split(/ +/)[0]);
                if (!field_user || !field_nickname || !field_role || !field_channel){
                    channel.send(`\`[DELETED]\` ${member} \`удалил багнутый запрос.\``);
                }else{
                    channel.send(`\`[DELETED]\` ${member} \`удалил запрос от ${field_nickname}, с ID: ${field_user.id}\``);
                }
                if (sened.has(field_nickname)) sened.delete(field_nickname); // Отметить ник, что он не отправлял запрос
                return message.delete();
            }else if (message.embeds[0].title == '`Discord » Запрос о снятии роли.`'){
                let field_author = server.members.find(m => "<@" + m.id + ">" == message.embeds[0].fields[0].value.split(/ +/)[1]);
                let field_user = server.members.find(m => "<@" + m.id + ">" == message.embeds[0].fields[1].value.split(/ +/)[1]);
                let field_role = server.roles.find(r => "<@&" + r.id + ">" == message.embeds[0].fields[2].value.split(/ +/)[3]);
                let field_channel = server.channels.find(c => "<#" + c.id + ">" == message.embeds[0].fields[3].value.split(/ +/)[0]);
                if (!field_author || !field_user || !field_role || !field_channel){
                    channel.send(`\`[DELETED]\` ${member} \`удалил багнутый запрос на снятие роли.\``);
                }else{
                    channel.send(`\`[DELETED]\` ${member} \`удалил запрос на снятие роли от ${field_author.displayName}, с ID: ${field_author.id}\``);
                }
                if (snyatie.has(field_author.id + `=>` + field_user.id)) snyatie.delete(field_author.id + `=>` + field_user.id)
                return message.delete();
            }
        }else if(event_emoji_name == "❌"){
            if (message.embeds[0].title == '`Discord » Проверка на валидность ник нейма.`'){
                if (message.reactions.size != 3){
                    return channel.send(`\`[ERROR]\` \`Не торопись! Сообщение еще загружается!\``)
                }
                let field_user = server.members.find(m => "<@" + m.id + ">" == message.embeds[0].fields[0].value.split(/ +/)[1]);
                let field_nickname = message.embeds[0].fields[1].value.split(`\`Ник:\` `)[1];
                let field_role = server.roles.find(r => "<@&" + r.id + ">" == message.embeds[0].fields[2].value.split(/ +/)[3]);
                let field_channel = server.channels.find(c => "<#" + c.id + ">" == message.embeds[0].fields[3].value.split(/ +/)[0]);
                channel.send(`\`[DENY]\` <@${member.id}> \`отклонил запрос от ${field_nickname}, с ID: ${field_user.id}\``);
                field_channel.send(`<@${field_user.id}>**,** \`модератор\` <@${member.id}> \`отклонил ваш запрос на выдачу роли.\nВаш ник при отправке: ${field_nickname}\nУстановите ник на: [Фракция] Имя_Фамилия [Ранг]\``)
                nrpnames.add(field_nickname); // Добавить данный никнейм в список невалидных
                if (sened.has(field_nickname)) sened.delete(field_nickname); // Отметить ник, что он не отправлял запрос
                return message.delete();
            }else if (message.embeds[0].title == '`Discord » Запрос о снятии роли.`'){
                if (message.reactions.size != 3){
                    return channel.send(`\`[ERROR]\` \`Не торопись! Сообщение еще загружается!\``)
                }
                let field_author = server.members.find(m => "<@" + m.id + ">" == message.embeds[0].fields[0].value.split(/ +/)[1]);
                let field_user = server.members.find(m => "<@" + m.id + ">" == message.embeds[0].fields[1].value.split(/ +/)[1]);
                let field_role = server.roles.find(r => "<@&" + r.id + ">" == message.embeds[0].fields[2].value.split(/ +/)[3]);
                let field_channel = server.channels.find(c => "<#" + c.id + ">" == message.embeds[0].fields[3].value.split(/ +/)[0]);
                if (member.id == field_author.id) return channel.send(`\`[ERROR]\` \`${member.displayName} свои запросы отклонять нельзя!\``).then(msg => msg.delete(5000))
                if (!field_user.roles.some(r => r.id == field_role.id)){
                    if (snyatie.has(field_author.id + `=>` + field_user.id)) snyatie.delete(field_author.id + `=>` + field_user.id)
                    return message.delete();
                }
                channel.send(`\`[DENY]\` <@${member.id}> \`отклонил запрос на снятие роли от\` <@${field_author.id}>\`, с ID: ${field_author.id}\``);
                field_channel.send(`<@${field_author.id}>**,** \`модератор\` <@${member.id}> \`отклонил ваш запрос на снятие роли пользователю:\` <@${field_user.id}>`)
                if (snyatie.has(field_author.id + `=>` + field_user.id)) snyatie.delete(field_author.id + `=>` + field_user.id)
                return message.delete();
            }
        }else if (event_emoji_name == "✔"){
            if (message.embeds[0].title == '`Discord » Проверка на валидность ник нейма.`'){
                if (message.reactions.size != 3){
                    // return channel.send(`\`[ERROR]\` \`Не торопись! Сообщение еще загружается!\``)
                }
                let field_user = server.members.find(m => "<@" + m.id + ">" == message.embeds[0].fields[0].value.split(/ +/)[1]);
                let field_nickname = message.embeds[0].fields[1].value.split(`\`Ник:\` `)[1];
                let field_role = server.roles.find(r => "<@&" + r.id + ">" == message.embeds[0].fields[2].value.split(/ +/)[3]);
                let field_channel = server.channels.find(c => "<#" + c.id + ">" == message.embeds[0].fields[3].value.split(/ +/)[0]);
                if (field_user.roles.some(r => field_role.id == r.id)){
                    if (sened.has(field_nickname)) sened.delete(field_nickname); // Отметить ник, что он не отправлял запрос
                    return message.delete(); // Если роль есть, то выход
                }
                let rolesremoved = false;
                let rolesremovedcount = 0;
                if (field_user.roles.some(r=>rolesgg.includes(r.name))) {
                    for (var i in rolesgg){
                        let rolerem = server.roles.find(r => r.name == rolesgg[i]);
                        if (field_user.roles.some(role=>[rolesgg[i]].includes(role.name))){
                            rolesremoved = true;
                            rolesremovedcount = rolesremovedcount+1;
                            await field_user.removeRole(rolerem); // Забрать фракционные роли
                        }
                    }
                }
                await field_user.addRole(field_role); // Выдать роль по соответствию с тэгом
                channel.send(`\`[ACCEPT]\` <@${member.id}> \`одобрил запрос от ${field_nickname}, с ID: ${field_user.id}\``);
                if (rolesremoved){
                    if (rolesremovedcount == 1){
                        field_channel.send(`<@${field_user.id}>**,** \`модератор\` <@${member.id}> \`одобрил ваш запрос на выдачу роли.\`\n\`Роль\`  <@&${field_role.id}>  \`была выдана! ${rolesremovedcount} роль другой фракции была убрана.\``)
                    }else if (rolesremovedcount < 5){
                        field_channel.send(`<@${field_user.id}>**,** \`модератор\` <@${member.id}> \`одобрил ваш запрос на выдачу роли.\`\n\`Роль\`  <@&${field_role.id}>  \`была выдана! Остальные ${rolesremovedcount} роли других фракций были убраны.\``)
                    }else{
                        field_channel.send(`<@${field_user.id}>**,** \`модератор\` <@${member.id}> \`одобрил ваш запрос на выдачу роли.\`\n\`Роль\`  <@&${field_role.id}>  \`была выдана! Остальные ${rolesremovedcount} ролей других фракций были убраны.\``)
                    }
                }else{
                    field_channel.send(`<@${field_user.id}>**,** \`модератор\` <@${member.id}> \`одобрил ваш запрос на выдачу роли.\`\n\`Роль\`  <@&${field_role.id}>  \`была выдана!\``)
                }
                if (sened.has(field_nickname)) sened.delete(field_nickname); // Отметить ник, что он не отправлял запрос
                return message.delete();
            }else if (message.embeds[0].title == '`Discord » Запрос о снятии роли.`'){
                if (message.reactions.size != 3){
                    // return channel.send(`\`[ERROR]\` \`Не торопись! Сообщение еще загружается!\``)
                }
                let field_author = server.members.find(m => "<@" + m.id + ">" == message.embeds[0].fields[0].value.split(/ +/)[1]);
                let field_user = server.members.find(m => "<@" + m.id + ">" == message.embeds[0].fields[1].value.split(/ +/)[1]);
                let field_role = server.roles.find(r => "<@&" + r.id + ">" == message.embeds[0].fields[2].value.split(/ +/)[3]);
                let field_channel = server.channels.find(c => "<#" + c.id + ">" == message.embeds[0].fields[3].value.split(/ +/)[0]);
                if (member.id == field_author.id) return channel.send(`\`[ERROR]\` \`${member.displayName} свои запросы принимать нельзя!\``).then(msg => msg.delete(5000))
                if (!field_user.roles.some(r => r.id == field_role.id)){
                    if (snyatie.has(field_author.id + `=>` + field_user.id)) snyatie.delete(field_author.id + `=>` + field_user.id)
                    return message.delete();
                }
                field_user.removeRole(field_role);
                channel.send(`\`[ACCEPT]\` <@${member.id}> \`одобрил снятие роли (${field_role.name}) от\` <@${field_author.id}>, \`пользователю\` <@${field_user.id}>, \`с ID: ${field_user.id}\``);
                field_channel.send(`**<@${field_user.id}>, с вас сняли роль**  <@&${field_role.id}>  **по запросу от <@${field_author.id}>.**`)
                if (snyatie.has(field_author.id + `=>` + field_user.id)) snyatie.delete(field_author.id + `=>` + field_user.id)
                return message.delete()
            }
        }
    }
});