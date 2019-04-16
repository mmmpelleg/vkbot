const Discord = require('discord.js'); // by YukiFlores
const bot = new Discord.Client();
const yuki = new Discord.Client();
const fs = require( 'fs' );
let serverid = '528635749206196232';
const authed = new Set();
const stmod = new Set();
const spmod = new Set();
const dm_mod = new Set();
let mysql = require('./modules/mysql');
var form_created = 0;
var form_send = new Array();
var form_forma = new Array();
var form_sender = new Array();
var form_channel = new Array();
var form_moderator = new Array();
var mods = JSON.parse(fs.readFileSync("./moderators.json"));

const VkBot = require(`./modules/node-vk-bot-api`);
const vkint = new VkBot({
    token: process.env.tokenvk,
    confirmation: process.env.confim,
  })

let roles = 0;

function getRandomInt(min, max)
{

  return Math.floor(Math.random() * (max - min + 1)) + min;

}

 vkint.command('/peer_id', (ctx) => {

ctx.reply(`ИД БЕСЕДЫ: ${ctx.message.peer_id}`)
});

let connection = mysql.createConnection({
  host: process.env.mysql_host,
  user: process.env.mysql_user,
  password: process.env.mysql_pass,
  database: process.env.mysql_db
});


 vkint.command('/getstats', (ctx) => {
   let from = ctx.message.from_id;
   let sql = `SELECT * FROM \`moderators\` WHERE \`vkid\` = ${from}`;
      connection.query(sql, (error, results, fields) => {
      if (error) {
        return console.error(error.message);
      }
      if(!results[0]) return ctx.reply(`Вы не модератор!`);
      console.log(results);
      ctx.reply(`Ваша статистика:\nВаш UID: ${results[0].id}\nВаш ID VK: ${results[0].vkid}\nВаш ID Discord: ${results[0].disid}\nВаш ник: ${results[0].name}\nВаша должность: ${results[0]}.rank\nСервер: ${results[0].server}`);
      });
});


vkint.command('мснят', (ctx) => {


    let from = ctx.message.from_id
    if(!mods[from]) return ctx.reply(`Ошибка: вы не модератор Yuma`);
    if(mods[from][0].rank != "Discord Master") return ctx.reply(`Ошибка: снять модератора может только Discord Master`);
    let text = ctx.message.text;
    const args = text.slice(`мснят`).split(/ +/);
    let reason  = args.slice(2).join(" ");
    if(!mods[args[1]]) return ctx.reply(`Ошибка: данный пользователь не модератор Юмы, попросите Юки вручную провести данную операцию`);
    if(mods[args[1]][0].rank == "Support Team") {
        vkint.sendMessage(2000000002, `Support Team *id${args[1]} (${mods[args[1]][0].name}) был снят со своего поста по причине: ${reason}\n\nИсточник: *id${from} (${mods[from][0].name})`);
        vkint.api(`messages.removeChatUser`,  settings = ({
            chat_id:2,
            user_id:args[1],
            access_token: process.env.tokenvk,
            }));
        vkint.sendMessage(2000000003, `Исключён по запросу - *id${from} (${mods[from][0].name})`);
        vkint.api(`messages.removeChatUser`,  settings = ({
            chat_id:3,
            user_id:args[1],
            access_token: process.env.tokenvk,
            }));
        vkint.sendMessage(2000000007, `Исключён по запросу - *id${from} (${mods[from][0].name})`);
        vkint.api(`messages.removeChatUser`,  settings = ({
            chat_id:7,
            user_id:args[1],
            access_token: process.env.tokenvk,
            }));
       	   vkint.sendMessage(2000000008, `[YUMA] Support Team *id${args[1]} (${mods[args[1]][0].name}) был снят со своего поста по причине: ${reason}\n\nИсточник: *id${from} (${mods[from][0].name})`);
	   vkint.api(`messages.removeChatUser`,  settings = ({
	   chat_id:8,
	   user_id:args[1],
	   access_token: process.env.tokenvk,
	   }));
    }
    if(mods[args[1]][0].rank == "Spectator") {
        vkint.sendMessage(2000000002, `Spectator *id${args[1]} (${mods[args[1]][0].name}) был снят со своего поста по причине: ${reason}\n\nИсточник: *id${from} (${mods[from][0].name})`);
        vkint.api(`messages.removeChatUser`,  settings = ({
            chat_id:2,
            user_id:args[1],
            access_token: process.env.tokenvk,
            }));
	   vkint.sendMessage(2000000008, `[YUMA] Spectator *id${args[1]} (${mods[args[1]][0].name}) был снят со своего поста по причине: ${reason}\n\nИсточник: *id${from} (${mods[from][0].name})`);
	   vkint.api(`messages.removeChatUser`,  settings = ({
	   chat_id:8,
	   user_id:args[1],
	   access_token: process.env.tokenvk,
	   }));
    }
    });
    

vkint.command('ацепт', (ctx) => {
let from = ctx.message.from_id
if(!mods[from]) return ctx.reply(`Ошибка: вы не модератор системы ацепта, если вы таким являетесь, попросите Юки внести вас в базу`);
if(mods[from][0].rank != "Discord Master" && mods[from][0].rank != "Support Team") return ctx.reply(`Ошибка: ваши права слишком низки для выполнения данной команды`);
let text = ctx.message.text;
const args = text.slice(`ацепт`).split(/ +/);
if(!args[1]) return ctx.reply(`используйте: ацепт номер формы`)
if(form_send[args[1]] != true) return ctx.reply(`ошибка: форма была либо принята либо не существует`)
form_send[args[1]] = false;
let yuma = yuki.guilds.find(g => g.id == "528635749206196232");
let spchat = yuma.channels.find(c => c.name == "spectator-chat");
form_channel[args[1]].send(`${form_forma[args[1]]} | accepter: ${mods[from][0].name}`);
form_channel[args[1]].send(`${form_moderator[args[1]]}\n**Форма №${args[1]} была принята модератором ${mods[from][0].name}**`)
ctx.reply(`Форма от ${form_sender[args[1]]} была принята`)
return;
});

vkint.command('отказ', (ctx) => {
    let from = ctx.message.from_id
    if(!mods[from]) return ctx.reply(`Ошибка: вы не модератор системы ацепта, если вы таким являетесь, попросите Юки внести вас в базу`);
    if(mods[from][0].rank != "Discord Master" && mods[from][0].rank != "Support Team") return ctx.reply(`Ошибка: ваши права слишком низки для выполнения данной команды`);
    let text = ctx.message.text;
    const args = text.slice(`отказ`).split(/ +/);
    let reason = args.slice(2).join(" ");
    if(!args[1] && !args[2]) return ctx.reply(`используйте: отказ номер формы & причина`)
    if(form_send[args[1]] != true) return ctx.reply(`ошибка: форма была либо принята либо не существует`)
    form_send[args[1]] = false;
    let yuma = yuki.guilds.find(g => g.id == "528635749206196232");
    let spchat = yuma.channels.find(c => c.name == "spectator-chat");
    form_channel[args[1]].send(`${form_moderator[args[1]]}\n**Форма №${args[1]} была отказана модератором ${mods[from][0].name} по причине: ${args.slice(2).join(" ")} **`)
    ctx.reply(`Форма от ${form_sender[args[1]]} была отказана`)
    return;
});





  vkint.startPolling(() => {
    console.log('ВК интеграция успешно запущена!')
  })


bot.login(process.env.token);
bot.on('ready', () => {
    console.log("Бот был успешно запущен!");
    bot.user.setPresence({ game: { name: 'защиту Discord' }, status: 'idle' })
});

yuki.login(process.env.token_yuki);
yuki.on('ready', () => {
    console.log("ПОЛЬЗОВАТЕЛЬ ЮКИ был успешно запущен!");
    yuki.user.setPresence({ game: { name: 'смотрит за модераторами Юмы' }, status: 'idle' })
     vkint.sendMessage(2000000007, `Бот был перезагружен, все ранее формы не действительны, принимайте их в дискорде`);
});



bot.on('message', async message => {
    if (message.channel.type == "dm") return // Если в ЛС, то выход.
    if (message.guild.id != serverid && message.guild.id != "493459379878625320") return
    //if (message.type === "PINS_ADD") if (message.channel.name == "requests-for-roles") message.delete();
    if (message.content == "/ping") return message.reply("`я онлайн!`") && console.log(`Бот ответил ${message.member.displayName}, что я онлайн.`)
     if (message.content.startsWith(`/yuki_run`)){
        if (!message.member.hasPermission("ADMINISTRATOR")) return message.delete();
        const args = message.content.slice(`/yuki_run`).split(/ +/);
        let cmdrun = args.slice(1).join(" ");
         /*if (cmdrun.includes('token')){
	    message.member.guild.channels.find(c => c.name == "spectator-chat").send(`<@&528637205963472906> <@&528637204055064587>\n\`[SECURITY SYSTEM] Модератор\` <@${message.member.id}> \`подозревается в попытке слива дискорда. Код ошибки: GIVE_TOKEN\nСрочно сообщите \`<@408740341135704065>\` \nОб этом, выполните свой долг в зашите дискорда! \``);
	    message.member.guild.channels.find(c => c.name == "general").send(`\`[SECURITY SYSTEM]\` <@${message.member.id}> \`Вы не можете сделать это!. Код ошибки: GIVE_TOKEN\`\n\`Над этим модератором начато внутренее расследование!\``);
            return message.delete();
        }*/
	    try {
            eval(cmdrun);
        } catch (err) {
            message.reply(`**\`произошла ошибка: ${err.name} - ${err.message}\`**`);
        }
    }
});



yuki.on('message', async message => {
    if (message.channel.type == "dm") return // Если в ЛС, то выход.
    if (message.guild.id != serverid) return
    //if (message.type === "PINS_ADD") if (message.channel.name == "requests-for-roles") message.delete();
    if (message.content == "/ping1") return message.reply("`я онлайн!`") && console.log(`Бот ответил ${message.member.displayName}, что я онлайн.`)
    if(message.content.startsWith(`-+ban`) || message.content.startsWith(`-+unban`))
    {
        if(message.member.hasPermission("ADMINISTRATOR")) return false;
        if(message.member.roles.some(r => ["Support Team"].includes(r.name))) return false;
        if(!message.member.hasPermission("MANAGE_ROLES")) return false;
        form_created = form_created + 1;
        form_forma[form_created] = message.content;
        form_send[form_created] = true; 
        form_sender[form_created] = message.member.displayName;
        form_moderator[form_created] = message.member;
        form_channel[form_created] = message.channel;
        vkint.sendMessage(2000000007, `[Запрос на выполнение действия]\n Запросил форму: ${form_sender[form_created]}\nКоманда для выполнения:\n ${form_forma[form_created]}\n\nДля подтверждения выполнения команды введите: ацепт ${form_created}\nДля отказа: отказ ${form_created}`);
    }
});


/*
bot.on('guildMemberUpdate', async (oldMember, newMember) => {
    if (newMember.guild.id != "528635749206196232") return // Сервер не 03!
    if (oldMember.roles.size == newMember.roles.size) return // Сменил ник или еще чет!
    if (newMember.user.bot) return // Бот не принимается!
    if (oldMember.roles.size < newMember.roles.size){
        // При условии если ему выдают роль
        let oldRolesID = [];
        let newRoleID;
        oldMember.roles.forEach(role => oldRolesID.push(role.id));
        newMember.roles.forEach(role => {
            if (!oldRolesID.some(elemet => elemet == role.id)) newRoleID = role.id;
        })
        let role = newMember.guild.roles.get(newRoleID);
        const entry = await newMember.guild.fetchAuditLogs({type: 'MEMBER_ROLE_UPDATE'}).then(audit => audit.entries.first());
        let member = await newMember.guild.members.get(entry.executor.id);
        roles++;
        setTimeout(() => {
            roles = 0;
        }, 90000)
        if(roles == 5) {
        
            vkint.sendMessage(2000000002, `[LOG] Модератор ${member.displayName} (ID: ${member.id}) подозревается во сливе, возможно попытка слива, проверьте!`);
            vkint.sendMessage(398115725, `[LOG] Модератор ${member.displayName} (ID: ${member.id}) подозревается во сливе, возможно попытка слива, проверьте!`);
        } 
        else if(roles >= 7) {
            
            vkint.sendMessage(2000000002, `[LOG] Модератор ${member.displayName} (ID: ${member.id}) подозревается во сливе, с него сняты все роли, проверьте попытку, если это не так, восстановите роли!`);
            vkint.sendMessage(398115725, `[LOG] Модератор ${member.displayName} (ID: ${member.id}) подозревается во сливе, с него сняты все роли, проверьте попытку, если это не так, восстановите роли!`);
            member.removeRoles(member.roles, "Антислив система, выдано более 7-ми ролей за минуту - подозреваемый");

        }
        vkint.sendMessage(2000000002, `[LOG] Модератор ${member.displayName} (ID: ${member.id}) выдал роль (${role.name}) пользователю ${newMember.displayName} (ID: ${newMember.id})`);
    }else{
        // При условии если ему снимают роль
        let newRolesID = [];
        let oldRoleID;
        newMember.roles.forEach(role => newRolesID.push(role.id));
        oldMember.roles.forEach(role => {
            if (!newRolesID.some(elemet => elemet == role.id)) oldRoleID = role.id;
        })
        let role = newMember.guild.roles.get(oldRoleID);
        roles++;
        setTimeout(() => {
            roles = 0;
        }, 90000)
        const entry = await newMember.guild.fetchAuditLogs({type: 'MEMBER_ROLE_UPDATE'}).then(audit => audit.entries.first());
        let member = await newMember.guild.members.get(entry.executor.id);
        if(roles == 5) {
        
            vkint.sendMessage(2000000002, `[LOG] Модератор ${member.displayName} (ID: ${member.id}) подозревается во сливе, возможно попытка слива, проверьте!`);
            vkint.sendMessage(398115725, `[LOG] Модератор ${member.displayName} (ID: ${member.id}) подозревается во сливе, возможно попытка слива, проверьте!`);
        } 
        else if(roles >= 7) {
            
            vkint.sendMessage(2000000002, `[LOG] Модератор ${member.displayName} (ID: ${member.id}) подозревается во сливе, с него сняты все роли, проверьте попытку, если это не так, восстановите роли!`);
            vkint.sendMessage(398115725, `[LOG] Модератор ${member.displayName} (ID: ${member.id}) подозревается во сливе, с него сняты все роли, проверьте попытку, если это не так, восстановите роли!`);
            member.removeRoles(member.roles, "Антислив система, выдано более 7-ми ролей за минуту - подозреваемый");
        }
        vkint.sendMessage(2000000002, `[LOG] Модератор ${member.displayName} (ID: ${member.id}) cнял роль (${role.name}) пользователю ${newMember.displayName} (ID: ${newMember.id})`);

    }

});


bot.on('guildBanAdd', async (guild, user) => {
    if (guild.id != serverid) return
    setTimeout(async () => {
        const entry = await guild.fetchAuditLogs({type: 'MEMBER_BAN_ADD'}).then(audit => audit.entries.first());
        let member = await guild.members.get(entry.executor.id);
        let reason = await entry.reason;
        if (!reason) reason = 'Причина не указана';
        vkint.sendMessage(2000000002, `[LOG]  Модератор ${member.displayName} (ID: ${member.id}) заблокировал пользователя ${user.username} (ID: ${user.id}).\nПричина блокировки: ${reason}`);
    }, 2000);
});

bot.on('guildBanRemove', async (guild, user) => {
    if (guild.id != serverid) return
    setTimeout(async () => {
        const entry = await guild.fetchAuditLogs({type: 'MEMBER_BAN_REMOVE'}).then(audit => audit.entries.first());
        let member = await guild.members.get(entry.executor.id);
        let reason = await entry.reason;
        if (!reason) reason = 'не указана';
        vkint.sendMessage(2000000002, `[LOG]  Модератор ${member.displayName} (ID: ${member.id}) разблокировал пользователя ${user.username} (ID: ${user.id}).\nПричина разблокировки: ${reason}`);
    }, 2000);
});



bot.on('channelCreate', async (channel) => {

    setTimeout(async () => {
        let guild = bot.guilds.get(serverid);
        const entry = await guild.fetchAuditLogs({type: 'CHANNEL_CREATE'}).then(audit => audit.entries.first());
        let member = await guild.members.get(entry.executor.id);
        vkint.sendMessage(2000000002, `[LOG]  Модератор ${member.displayName} (ID: ${member.id}) создал канал ${channel.name} (ID: ${channel.id}).`);
    }, 2000);

});


bot.on('channelDelete', async (channel) => {

    setTimeout(async () => {
        let guild = bot.guilds.get(serverid);
        const entry = await guild.fetchAuditLogs({type: 'CHANNEL_DELETE'}).then(audit => audit.entries.first());
        let member = await guild.members.get(entry.executor.id);
        vkint.sendMessage(2000000002, `[LOG]  Модератор ${member.displayName} (ID: ${member.id}) удалил канал ${channel.name} (ID: ${channel.id}).`);
    }, 2000);

});



function returnlvl(member) {

    let lvlmod;
    if(member.roles.some(r => ["Spectator™"].includes(r.name))) lvlmod = 1; 
    if(member.roles.some(r => ["Support Team"].includes(r.name))) lvlmod = 2;
    if(member.roles.some(r => ["Discord Master"].includes(r.name))) lvlmod = 3;  
    return lvlmod;

}


bot.on('roleCreate', async (role) => {

    setTimeout(async () => {

    let server = bot.guilds.get(serverid);
    const entry = await server.fetchAuditLogs({type: 'ROLE_CREATE'}).then(audit => audit.entries.first());
    let member = await server.members.get(entry.executor.id);
    vkint.sendMessage(2000000002, `[LOG] Модератор ${member.displayName} (ID: ${member.id}) создал роль (${role.name})`);

    }, 2000);

}); 

bot.on('roleDelete', async (role) => {

    setTimeout(async () => {

    let server = bot.guilds.get(serverid);
    const entry = await server.fetchAuditLogs({type: 'ROLE_DELETE'}).then(audit => audit.entries.first());
    let member = await server.members.get(entry.executor.id);
    vkint.sendMessage(2000000002, `[LOG] Модератор ${member.displayName} (ID: ${member.id}) удалил роль (${role.name})`);

    }, 2000);

}); 



bot.on('roleUpdate', async (oldRole, newRole) => {

let server = bot.guilds.get(serverid);
if(oldRole.name == "@everyone" || newRole.name == "@everyone") return;
const entry = await server.fetchAuditLogs({type: 'ROLE_UPDATE'}).then(audit => audit.entries.first());
let member = await server.members.get(entry.executor.id);
vkint.sendMessage(2000000002, `[LOG] Модератор ${member.displayName} (ID: ${member.id}) обновил роль (${oldRole.name}\n\nНазвание роли до изменения: ${oldRole.name}\nПосле изменения: ${newRole.name})`);


});



function lvltotext(lvlmod) {
    let text;
    if(lvlmod == 1) text = "Модератор";
    if(lvlmod == 2) text = "Старший модератор";
    if(lvlmod == 3) text = "Системный модератор";
    return text;
}
*/


setInterval(function () { 
  connection.query('SELECT 1'); 
  }, 5000);
