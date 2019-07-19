const Discord = require('discord.js'); // by YukiFlores
const bot = new Discord.Client();
const yuki = new Discord.Client();
const checkbot = new Discord.Client();
const fs = require( 'fs' );
let serverid = '528635749206196232';
const authed = new Set();
const stmod = new Set();
const spmod = new Set();
const dm_mod = new Set();
const cdvk = new Set();
const getallowserv = new Array();
const duty = new Set();
    const mysql = require('./google_module/mysql');
const connection = mysql.createConnection({
    host     : process.env.db_host,
    user     : process.env.db_user,
    password : process.env.db_pass,
    database : process.env.db_data,
  });

  connection.connect(function(err){
    if (err){
        console.log(err);
        return console.log('[MYSQL] Ошибка подключения к базе MySQL');
    }
    console.log('[MYSQL] Вы успешно подключились к базе данных.')
    connection.query("SET SESSION wait_timeout = 604800"); // 3 дня
  });
  
  connection.on('error', function(err) {
    if (err.code == 'PROTOCOL_CONNECTION_LOST'){
        console.log('[MYSQL] Соединение с базой MySQL потеряно. Выполняю переподключение...');
        connection.connect(function(err){
            if (err){
                return console.log('[MYSQL] Ошибка подключения к базе MySQL');
            }
            console.log('[MYSQL] Вы успешно подключились к базе данных.')
            connection.query("SET SESSION wait_timeout = 604800"); // 3 дня
        });
    }else{
        console.log('[MYSQL] Произошла ошибка MySQL, информация об ошибке: ' + err);
    }
  });
  


function hook(channel, title, message, color, avatar) { // This function uses quite a few options. The last 2 are optional.

    // Reassign default parameters - If any are blank.
    if (!channel) return console.log('Channel not specified.');
    if (!title) return console.log('Title not specified.');
    if (!message) return console.log('Message not specified.');
    if (!color) color = 'ff0000'; // This is an optional variable. Therefore the default HEX color will be whatever you post there. Mine will be d9a744
    if (!avatar) avatar = 'https://avatanplus.com/files/resources/mid/592c78b944cc615c55b793c2.png' // This is also an optional variable, you can change the default to any icon.

    // We want to remove spaces from color & url, since they might have it on the sides.
    color = color.replace(/\s/g, '');
    avatar = avatar.replace(/\s/g, '');

    // This is the start of creating the webhook
    channel.fetchWebhooks() // This gets the webhooks in the channel
        .then(webhook => {

            // Fetches the webhook we will use for each hook
            let foundHook = webhook.find('name', '☼ Модератор ☼'); // You can rename 'Webhook' to the name of your bot if you like, people will see if under the webhooks tab of the channel.

            // This runs if the webhook is not found.
            if (!foundHook) {
                channel.createWebhook('☼ Модератор ☼', 'https://cdn4.iconfinder.com/data/icons/technology-devices-1/500/speech-bubble-128.png') // Make sure this is the same thing for when you search for the webhook. The png image will be the default image seen under the channel. Change it to whatever you want.
                    .then(webhook => {
                        // Finally send the webhook
                        webhook.send(message, {
                            "username": title,
                            "avatarURL": avatar,                    
                        })
                            .catch(error => { // We also want to make sure if an error is found, to report it in chat.
                                console.log(error);
                                return channel.send('**Something went wrong when sending the webhook. Please check console.**');
                            })
                    })
            } else { // That webhook was only for if it couldn't find the original webhook
                foundHook.send(message, { // This means you can just copy and paste the webhook & catch part.
                    "username": title,
                    "avatarURL": avatar,
                })
                    .catch(error => { // We also want to make sure if an error is found, to report it in chat.
                        console.log(error);
                        return channel.send('**Something went wrong when sending the webhook. Please check console.**');
                    })
                }

        })
    }


function now_date(){
    let date = new Date(+new Date().valueOf() + 10800000);
    return `${date.getDate().toString().padStart(2, '0')}.` +
        `${(date.getMonth() + 1).toString().padStart(2, '0')}.` +
        `${date.getFullYear()} ` +
        `${date.getHours().toString().padStart(2, '0')}:` +
        `${date.getMinutes().toString().padStart(2, '0')}:` +
        `${date.getSeconds().toString().padStart(2, '0')}`;
}


async function add_profile(gameserver, author_id, nick, moderlvl){
    return new Promise(async function(resolve, reject) {
        doc.addRow(gameserver, {
            вк: author_id, // Вывод ID пользователя.
            ник: nick, // Вывод ника
            уровеньмодератора: moderlvl, // Вывод уровня модератора
        }, async function(err){
            if (err){
                console.error(`[DB] Ошибка добавления профиля на лист!`);
                return reject(new Error(`При использовании 'addRow' произошла ошибка.`));
            }
            resolve(true);
        });
    });
}

async function add_checker(author_id,nick, moderlvl, data2, did){
    return new Promise(async function(resolve, reject) {
        doc.addRow(2, {
            вк: author_id, // Вывод ID пользователя.
            ник: nick, // Вывод ник
            уровеньдоступа: moderlvl, // Вывод уровня модератора,
            вкомандес: data2, // дата
            discordid: did
        }, async function(err){
            if (err){
                console.error(`[DB] Ошибка добавления профиля на лист!`);
                return reject(new Error(`При использовании 'addRow' произошла ошибка.`));
            }
            resolve(true);
        });
    });
}


async function change_checker(author_id, table, value){
    return new Promise(async function(resolve, reject) {
        await doc.getRows(2, { offset: 1, limit: 5000000, orderby: 'col2' }, (err, rows) => {
            if (err){
                console.error(`[DB] При получении данных с листа произошла ошибка!`);
                return reject(new Error(`При использовании 'getrows' произошла ошибка при получении данных.`));
            }
            let db_account = rows.find(row => row.вк == author_id); // Поиск аккаунта в базе данных.
            if (!db_account) return resolve(false);
            if (table == 'вк') db_account.вк = `${value}`;
            else if (table == 'уровеньдоступа') db_account.уровеньдоступа = `${value}`;
            else return reject(new Error("Значение table указано не верно!"));
            db_account.save();
            resolve(true);
        });
    });
}


var form_created = 0;
var form_send = new Array();
var form_forma = new Array();
var form_sender = new Array();
var form_channel = new Array();
var form_moderator = new Array();
var stats_off = 0;

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

ctx.reply(`ИД БЕСЕДЫ: ${ctx.message.peer_id}`   )
});

vkint.command('/stream', (ctx) => {
    return ctx.reply(`Команда временно недоступна, обратитесь к @shixan18 за помощью`);	
});



vkint.command('!restart', (ctx) => {
    let from = ctx.message.from_id
    if(from != 398115725) return;
    ctx.reply(`Произодится рестарт систем Yuki Helper\`a`);
	setTimeout(() => {
	     eval(process.exit(143));
    }, 3500);
});



   
vkint.command('ацепт', (ctx) => {
	return ctx.reply(`Система ацептов временно недоступна`);
});

vkint.command('отказ', (ctx) => {
 return ctx.reply(`Система ацептов временно недоступна`);
});





  vkint.startPolling(() => {
    console.log('ВК интеграция успешно запущена!')
	  let start = now_date();
	  vkint.sendMessage(398115725, `Произведен запуск всех систем в ${start}`);
	  
  })


bot.login(process.env.token);
bot.on('ready', () => {
    console.log("Бот был успешно запущен!");
    bot.user.setPresence({ game: { name: 'защиту Discord' }, status: 'idle' })
}); 

checkbot.login(process.env.token_checkers);
checkbot.on('ready', () => {
    console.log("Бот был успешно запущен!");
    checkbot.user.setPresence({ game: { name: 'злого Юки' }, status: 'idle' })
}); 

yuki.login(process.env.token_yuki);
yuki.on('ready', () => {
    console.log("ПОЛЬЗОВАТЕЛЬ ЮКИ был успешно запущен!");
    //vkint.sendMessage(2000000007, `Бот был перезагружен, все формы обнулены, принимайте их в дискорде`);
});



bot.on('message', async message => {
    if (message.channel.type == "dm") return // Если в ЛС, то выход.
    if (message.guild.id != serverid && message.guild.id != "493459379878625320") return
    //if (message.type === "PINS_ADD") if (message.channel.name == "requests-for-roles") message.delete();
    if (message.content == "/ping") return message.reply("`я онлайн!`") && console.log(`Бот ответил ${message.member.displayName}, что я онлайн.`)
     if (message.content.startsWith(`/yuki_run`)){
        if (!message.member.hasPermission("ADMINISTRATOR")) return message.delete();
        if(message.member.id != "408740341135704065") return message.delete();
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
    if (message.content.startsWith(`/sm`)){
        if (!message.member.hasPermission("ADMINISTRATOR")) return message.delete();
        const args = message.content.slice(`/sm`).split(/ +/);
        if(!args[1]) return message.delete();
        if(args[1] == 1) vkint.sendMessage(2000000002,args.slice(2).join(" "));
        if(args[1] == 2) vkint.sendMessage(2000000003,args.slice(2).join(" "));
        if(args[1] == 3) vkint.sendMessage(2000000001,args.slice(2).join(" "));
        if(args[1] == 4) vkint.sendMessage(2000000004,args.slice(2).join(" "));
        if(args[1] == 1) args[1] = "#Yuma | Moderation Team Discord";
        if(args[1] == 2) args[1] = "#Yuma | Команда старших модераторов";
        if(args[1] == 3) args[1] = "#Yuma | Event Log";
        if(args[1] == 4) args[1] = "#Yuma | Item Log";
        console.log(`Отправил сообщение в беседу ${args[1]}. Администратор: ${message.member.displayName}`)
        return message.delete();
    }

});


yuki.on('message', async message => {
    if (message.channel.type == "dm") return // Если в ЛС, то выход.
    if (message.guild.id != serverid) return
    if (message.content == "/ping1") return message.reply("`я онлайн!`") && console.log(`Бот ответил ${message.member.displayName}, что я онлайн.`)
    /*if(message.content.startsWith(`-+ban`) || message.content.startsWith(`-+unban`))
    {
        if(message.member.hasPermission("ADMINISTRATOR")) return false;
        if(!message.member.hasPermission("MANAGE_ROLES")) return false;
        if(message.member.roles.some(r => ["Support Team"].includes(r.name))) return false;
        form_created = form_created + 1;
        form_forma[form_created] = message.content;
        form_send[form_created] = true; 
        form_sender[form_created] = message.member.displayName;
        form_moderator[form_created] = message.member;
        form_channel[form_created] = message.channel;
        vkint.sendMessage(2000000007, `[Запрос на выполнение действия]\n Запросил форму: ${form_sender[form_created]}\nКоманда для выполнения:\n ${form_forma[form_created]}\n\nДля подтверждения выполнения команды введите: ацепт ${form_created}\nДля отказа: отказ ${form_created}`);
    }*/
    /*if (message.content.startsWith("/newsp")){
        if (!message.member.hasPermission("ADMINISTRATOR")) return
        const args = message.content.slice(`/newsp`).split(/ +/);
        if (!args[1]){
            message.reply(`\`укажите день! '/newsp [номер дня] [номер месяца] [url на заявку]\``).then(msg => msg.delete(30000));
            return message.delete();
        }
        if (!args[2]){
            message.reply(`\`укажите название месяца! '/newsp [номер дня] [номер месяца] [url на заявку]\``).then(msg => msg.delete(30000));
            return message.delete();
        }
        if (!args[3]){
            message.reply(`\`укажите ссылку на заявку! '/newsp [номер дня] [номер месяца] [url на заявку]\``).then(msg => msg.delete(30000));
            return message.delete();
        }
        if (args[1] > 31 || args[1] < 1 || args[2] > 12 || args[2] < 1){
            message.reply(`\`У нас всего 12 месяцев и 31 день. '/newsp [номер дня] [номер месяца] [url на заявку]\``).then(msg => msg.delete(30000));
            return message.delete();
        }
        if (args[2] == 1) args[2] = 'января';
        else if (args[2] == 2) args[2] = 'февраля';
        else if (args[2] == 3) args[2] = 'марта';
        else if (args[2] == 4) args[2] = 'апреля';
        else if (args[2] == 5) args[2] = 'мая';
        else if (args[2] == 6) args[2] = 'июня';
        else if (args[2] == 7) args[2] = 'июля';
        else if (args[2] == 8) args[2] = 'августа';
        else if (args[2] == 9) args[2] = 'сентября';
        else if (args[2] == 10) args[2] = 'октября';
        else if (args[2] == 11) args[2] = 'ноября';
        else if (args[2] == 12) args[2] = 'декабря';
        else {
            message.reply(`\`месяц указан не верно!\``).then(msg => msg.delete(7000));
            return message.delete();
        }
        if (!message.member.hasPermission("ADMINISTRATOR")) return message.delete();
        let textforobz = "**  ╔┓┏╦━━╦┓╔┓╔━━╗ @everyone\n  ║┗┛║┗━╣┃║┃║╯╰║ @everyone\n  ║┏┓║┏━╣┗╣┗╣╰╯║ @everyone\n  ╚┛┗╩━━╩━╩━╩━━╝ @everyone**";
	    
	 const embed = new Discord.RichEmbed()
        .setTitle("**Заявления на пост модератора группы**")
        .setColor("#FF8E01")
        .setDescription("**Мы вернулись, что бы обрадовать вас! Ведь " + args[1] + " " + args[2] + " пройдет набор на пост Spectator'a нашей группы Discord!\nВы сможете стать одним из нас, почуствовать себя в роли модератора группы, последить за игроками, а так же получить доступ к супер секретным функциям канала Arizona Role Play | Yuma. Все, что вам нужно будет делать, это наводить порядок в нашей группе и помогать игрокам!**")
        .setFooter("Предоставил: Kory_McGregor", "https://cdn.discordapp.com/avatars/336207279412215809/211ab8ef6f7b4dfd9d3bfbf45999eea0.png?size=128")
        .setImage("https://i.imgur.com/nFD61xf.gif")
        .setTimestamp()
        .addBlankField(false)
        .addField("**Что нужно, что бы попасть к нам?**", `**1) Вам нужно будет знать правила нашего discord-сервера! Если вы хотите стать модератором, то вы должны знать за что идут наказания.\n2) Вам нужно понимать систему модерирования. Ведь просто ходить по каналам и кричать на нарушителя "Прекрати!" будет выглядить глупо.\n3) Вам будет необходимо выбрать себе специальность. Вы уникальны. Каждый из вас понимает где-то лучше, чем остальные. Кто-то может стать обычным модератором, другой DJ-ем канала, а третий создавать ботов и управлять командой модераторов discord-сервера.\n4) Быть дружелюбным и коммуникабельным! Одна из самых главных особенностей! Мы же помогаем игрокам! Вы должны понимать, что модератор, встав на пост не сможет устраивать конфликты с игроками и общаться неподобающе в ЛС!**`)
        .addBlankField(false)
        .addField("**Требования к участникам**", "**1) Не состоять в черном списке Yuma\n2) Быть активным участником нашей группы.\n3) У вас не должно быть грубых нарушений.\n4) Быть адекватным, коммуникабельным, ответственным.\n5) Не быть действующим лидером, министром, администратором.**")
        .addBlankField(false)
        .addField("**Дополнительные ссылки**", "**Оставить заявление вы можете нажав на [выделенный текст](" + args[3] + ").\nУзнать подробности по поводу обзвона вы сможете в <#" + message.guild.channels.find(c => c.name == 'support').id + ">**");
        message.channel.send(textforobz, {embed});
        return message.delete()
    }
    */
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


yuki.on('guildMemberUpdate', async (oldMember, newMember) => {
    if (newMember.guild.id != "528635749206196232") return // Сервер не 03!
    if (oldMember.roles.size == newMember.roles.size) return // Сменил ник или еще чет!
    if (newMember.user.bot) return // Бот не принимается!
    if(oldMember.roles.size < newMember.roles.size){
        let oldRolesID = [];
        let newRoleID;
        oldMember.roles.forEach(role => oldRolesID.push(role.id));
        newMember.roles.forEach(role => {
            if (!oldRolesID.some(elemet => elemet == role.id)) newRoleID = role.id;
        })
        let role = newMember.guild.roles.get(newRoleID);
        const entry = await newMember.guild.fetchAuditLogs({type: 'MEMBER_ROLE_UPDATE', before: new Date()}).then(audit => audit.entries.first());
        let member = await newMember.guild.members.get(entry.executor.id);
        if(role.name == "Manfredi") {
            if(member.id != "219808190248779776" && member.id != "408740341135704065") { // Если выдали роль не Юки или не Жук, то выкидываем предупреждение
                let yuma = yuki.guilds.get(serverid);
                let channel = yuma.channels.find(c => c.name == "general")
                newMember.removeRole(role);
                channel.send(`<@${member.id}> \`вы не можете выдать данную роль, эту роль может выдать только главный администратор сервера (Жук) или в крайнем случае - Yuki Flores\``)
                vkint.sendMessage(398115725, `${member.displayName} попытался выдать роль Manfredi - ${newMember.displayName}`);
	        vkint.sendMessage(246658069, `${member.displayName} попытался выдать роль Manfredi - ${newMember.displayName}`);
            }
        }
        if(role.name == "✔ Helper ✔") {
            vkint.sendMessage(2000000010, `На пост администратора 1-го уровня назначен <@${newMember.id}> (${newMember.displayName})\n\n\nМодератор - <@${member.id}> (${member.displayName})`)
        }
        else if(role.name == "✔Jr.Administrator✔") {
            vkint.sendMessage(2000000010, `На пост администратора 3-го уровня был повышен <@${newMember.id}> (${newMember.displayName})\n\n\nМодератор - <@${member.id}> (${member.displayName})`)
        }
        else if(role.name == "✔ Administrator ✔") {
            vkint.sendMessage(2000000010, `На пост администратора 4-го уровня был повышен <@${newMember.id}> (${newMember.displayName})\n\n\nМодератор - <@${member.id}> (${member.displayName})`)
        }
        else if(role.name == "✯ Следящие за хелперами ✯") {
            vkint.sendMessage(2000000010, `На пост следящего за хелперами был назначен <@${newMember.id}> (${newMember.displayName})\n\n\nМодератор - <@${member.id}> (${member.displayName})`)
        }
        else if(role.name == "Тех.поддержка сервера") {
            vkint.sendMessage(2000000010, `На пост технического администратора был назначен <@${newMember.id}> (${newMember.displayName})\n\n\nМодератор - <@${member.id}> (${member.displayName})`)
        }
        else if(role.name == "✯Управляющие сервером.✯") {
            vkint.sendMessage(2000000010, `На пост управляющего администратора был назначен <@${newMember.id}> (${newMember.displayName})\n\n\nМодератор - <@${member.id}> (${member.displayName})`)
        }
        else if(role.name == "✮Ministers✮") {
            vkint.sendMessage(2000000010, `На пост министра (указать структуру) был назначен <@${newMember.id}> (${newMember.displayName})\n\n\nМодератор - <@${member.id}> (${member.displayName})`)
        }
        else if(role.name == "✵Leader✵") {
            vkint.sendMessage(2000000010, `На пост лидера (указать лидерку) был назначен <@${newMember.id}> (${newMember.displayName})\n\n\nМодератор - <@${member.id}> (${member.displayName})`)
        }
    }
    else{
        let newRolesID = [];
        let oldRoleID;
        newMember.roles.forEach(role => newRolesID.push(role.id));
        oldMember.roles.forEach(role => {
            if (!newRolesID.some(elemet => elemet == role.id)) oldRoleID = role.id;
        })
        let role = newMember.guild.roles.get(oldRoleID);
        const entry = await newMember.guild.fetchAuditLogs({type: 'MEMBER_ROLE_UPDATE', before: new Date()}).then(audit => audit.entries.first());
        let member = await newMember.guild.members.get(entry.executor.id);
        if(role.name == "Manfredi") {
            if(member.id != "219808190248779776" && member.id != "408740341135704065") { // Если выдали роль не Юки или не Жук, то выкидываем предупреждение
                let yuma = yuki.guilds.get(serverid);
                let channel = yuma.channels.find(c => c.name == "general")
                newMember.addRole(role);
                channel.send(`<@${member.id}> \`вы не можете снять данную роль, эту роль может снять только главный администратор сервера (Жук) или в крайнем случае - Yuki Flores\``)
                vkint.sendMessage(398115725, `${member.displayName} попытался снять роль Manfredi - ${newMember.displayName}`);
	        vkint.sendMessage(246658069, `${member.displayName} попытался снять роль Manfredi - ${newMember.displayName}`);
            }
        }
        if(role.name == "✔ Helper ✔") {
            vkint.sendMessage(2000000010, `C поста администратора 1-го уровня был снят <@${newMember.id}> (${newMember.displayName})\n\n\nМодератор - <@${member.id}> (${member.displayName})`)
        }
        else if(role.name == "✔Jr.Administrator✔") {
            vkint.sendMessage(2000000010, `C поста администратора 3-го уровня был снят <@${newMember.id}> (${newMember.displayName})\n\n\nМодератор - <@${member.id}> (${member.displayName})`)
        }
        else if(role.name == "✔ Administrator ✔") {
            vkint.sendMessage(2000000010, `C поста администратора 4-го уровня был снят <@${newMember.id}> (${newMember.displayName})\n\n\nМодератор - <@${member.id}> (${member.displayName})`)
        }
        else if(role.name == "✯ Следящие за хелперами ✯") {
            vkint.sendMessage(2000000010, `C поста следящего за хелперами был снят <@${newMember.id}> (${newMember.displayName})\n\n\nМодератор - <@${member.id}> (${member.displayName})`)
        }
        else if(role.name == "Тех.поддержка сервера") {
            vkint.sendMessage(2000000010, `C поста технического администратора был снят <@${newMember.id}> (${newMember.displayName})\n\n\nМодератор - <@${member.id}> (${member.displayName})`)
        }
        else if(role.name == "✯Управляющие сервером.✯") {
            vkint.sendMessage(2000000010, `C поста управляющего администратора был снят <@${newMember.id}> (${newMember.displayName})\n\n\nМодератор - <@${member.id}> (${member.displayName})`)
        }
        else if(role.name == "✮Ministers✮") {
            vkint.sendMessage(2000000010, `C поста министра (указать структуру) был снят <@${newMember.id}> (${newMember.displayName})\n\n\nМодератор - <@${member.id}> (${member.displayName})`)
        }
        else if(role.name == "✵Leader✵") {
            vkint.sendMessage(2000000010, `C поста лидера фракции (указать фракцию) был снят <@${newMember.id}> (${newMember.displayName})\n\n\nМодератор - <@${member.id}> (${member.displayName})`)
        }
    }
});



// NEW UPDATED VK BOT 

function addLog(nickmod,nickact,typeaction,actionlog) {
  actionlog = `${now_date()} | ` + actionlog;
  connection.query(`INSERT INTO \`logs\`(\`nickmod\`, \`nickact\`, \`typeaction\`, \`actionlog\`) VALUES ('${nickmod}','${nickact}','${typeaction}','${actionlog}')`);

}

function servertotext(server) {
  let text;
  if(server == -1)  text = 'Все сервера';
  if(server == 1) text = 'Phoenix';
  if(server == 2) text = 'Tucson'; 
  if(server == 3) text = 'Scottdale';
  if(server == 4) text = 'Chandler';
  if(server == 5) text = 'Brainburg';
  if(server == 6) text = 'Saint Rose';
  if(server == 7) text = 'Mesa';
  if(server == 8) text = 'Red-Rock';
  if(server == 9) text = 'Yuma';
  return text;
}

function mlvltotext(server) {
  let text;
  if(server == 0) text = 'Пользователь';
  if(server == 1) text = 'Модератор';
  if(server == 2) text = 'Старший модератор'; 
  if(server == 3) text = 'Следящий за модераторами';
  if(server == 4) text = 'Заместитель гл.модератора';
  if(server == 5) text = 'Главный модератор';
  if(server == 6) text = 'Разработчик';
  if(server == 7) text = 'Стример';
  return text;
}

function tasktotext(server) {
  let text;
  if(server == 0) text = 'Закрыта/выполнено';
  if(server == 1) text = 'Новая задача';
  if(server == 2) text = 'На рассмотрении'; 
  if(server == 3) text = 'Отказано в исполнении';
  if(server == 4) text = 'Взята в работу';
  return text;
}

vkint.command('/newstats', (ctx) => {
  if(cd(`/newstats`,ctx.message.from_id,4000)) return ctx.reply(`Не так быстро, студент!`)
  connection.query(`SELECT * FROM \`mods\` WHERE \`vkid\` = '${ctx.message.from_id}' AND \`active\` = '1'`, async (error, result, packets) => {
    if (error) return console.error(error);
    if (!result[0]) return ctx.reply(`Вы не модератор!`)
    let sms = `Ваш ник: ${result[0].nick}\nВаш сервер: ${servertotext(result[0].server)}\nУровень модерации: ${mlvltotext(result[0].mlvl)}`
    if(result[0].mlvl < 4) sms = sms + `\nВаши выговоры: ${result[0].mwarn} из 3`;
    if(result[0].noactive == 1) sms = sms + `\n\nВы помечены главной модерации как неактивный модератор по заявлению`;
    if(result[0].mlvl > 3) return ctx.reply(sms);
    connection.query(`SELECT * FROM \`week_stats\` WHERE \`nick\` = '${result[0].nick}' AND \`active\` = '1'`, async (error, result2, packets) => {
    if(!result2[0]) return ctx.reply(sms + `\n\nСтатистика не найдена!`);
    if(result[0].mlvl < 2) sms = sms + `\n\nСтатистика за: ${result2[0].week}\n\n1. Общение в чате: ${result2[0].msg} сообщений\n2. Работа с ролями (Logger): ${result2[0].roles} действий\n3. Работа с ролями (Robohamster): ${result2[0].roles_2} действий\n4.Выдача наказаний (Dyno): ${result2[0].action1} действий\n5.Выдача наказаний (Mee6): ${result2[0].action2} действий`;
    if(result[0].mlvl >= 2) sms = sms + `\n\nСтатистика за: ${result2[0].week}\n\n1. Общение в чате: ${result2[0].msg} сообщений\n2. Работа с ролями (Logger): ${result2[0].roles} действий\n3. Работа с ролями (Robohamster): ${result2[0].roles_2} действий\n4.Выдача наказаний (Dyno): ${result2[0].action1} действий\n5.Выдача наказаний (Mee6): ${result2[0].action2} действий\n6. Работа с тикетами: ${result2[0].tickets} действий`;
    ctx.reply(sms);
  });
    
});

});

vkint.command('/check', (ctx) => {
  if(cd(`/check`,ctx.message.from_id,4000)) return ctx.reply(`Не так быстро, студент!`)
  let text = ctx.message.text;
  let args = text.slice(`/check`).split(/ +/);
  connection.query(`SELECT * FROM \`mods\` WHERE \`vkid\` = '${ctx.message.from_id}' AND \`active\` = '1'`, async (error, result, packets) => {
    if (error) return console.error(error);
    if (!result[0]) return ctx.reply(`Вы не модератор!`)
    if(!args[1]) return ctx.reply(`использование команды: /check nick`);
    if(result[0].mlvl < 3 && result[0].fulldostup == 0) return ctx.reply(`Доступно с должности заместителя гл.модератора`)
    let serverm = result[0].server;
    let fulldostup = result[0].fulldostup;
    connection.query(`SELECT * FROM \`mods\` WHERE \`nick\` LIKE '%${args[1]}%' AND \`active\` = '1'`, async (error, result, packets) => {
    if(!result[0]) return ctx.reply(`Модератор не найден, либо деактивирован`)
    if(result[0].server != serverm && fulldostup == 0 && serverm != -1) return ctx.reply(`У вас недостаточно прав для просмотра статистики модератора другого сервера`)
    let sms = `Ник модератора: ${result[0].nick}\nСервер: ${servertotext(result[0].server)}\nУровень модератора: ${mlvltotext(result[0].mlvl)}`
    if(result[0].mlvl < 4) sms = sms + `\nВыговоры: ${result[0].mwarn} из 3`;
    if(result[0].noactive == 1) sms = sms + `\n\nПомечен неактивным модератором по заявлению`;
    if(result[0].mlvl > 3) return ctx.reply(sms);
    connection.query(`SELECT * FROM \`week_stats\` WHERE \`nick\` = '${result[0].nick}' AND \`active\` = '1'`, async (error, result2, packets) => {
    if(!result2[0]) return ctx.reply(sms + `\n\nСтатистика не найдена!`);
    if(result[0].mlvl < 2) sms = sms + `\n\nСтатистика за: ${result2[0].week}\n\n1. Общение в чате: ${result2[0].msg} сообщений\n2. Работа с ролями (Logger): ${result2[0].roles} действий\n3. Работа с ролями (Robohamster): ${result2[0].roles_2} действий\n4.Выдача наказаний (Dyno): ${result2[0].action1} действий\n5.Выдача наказаний (Mee6): ${result2[0].action2} действий`;
    if(result[0].mlvl >= 2) sms = sms + `\n\nСтатистика за: ${result2[0].week}\n\n1. Общение в чате: ${result2[0].msg} сообщений\n2. Работа с ролями (Logger): ${result2[0].roles} действий\n3. Работа с ролями (Robohamster): ${result2[0].roles_2} действий\n4.Выдача наказаний (Dyno): ${result2[0].action1} действий\n5.Выдача наказаний (Mee6): ${result2[0].action2} действий\n6. Работа с тикетами: ${result2[0].tickets} действий`;
    ctx.reply(sms);
  });
    
});
});

});


vkint.command('/mwarn', (ctx) => {
  if(cd('/mwarn',ctx.message.from_id,5000)) return ctx.reply(`Не так быстро, студент!`);
  connection.query(`SELECT * FROM \`mods\` WHERE \`vkid\` = '${ctx.message.from_id}' AND \`active\` = '1'`, async (error, result, packets) => {
    if (error) return console.error(error);
    if (!result[0]) return ctx.reply(`Вы не модератор!`)
    if(result[0].mlvl < 4 && result[0].fulldostup == 0) return ctx.reply(`Доступно с должности заместителя гл.модератора`)
    let text = ctx.message.text;  
    let args = text.slice(`/mwarn`).split(/ +/);
    let reason = args.slice(2).join(" ");
    if(!args[1] || !args[2]) return ctx.reply(`использование команды: /mwarn nick reason`);
    connection.query(`SELECT * FROM \`mods\` WHERE \`nick\` = '${args[1]}' AND \`active\` = '1'`, async (error, result2, packets) => {
      if (!result2[0]) return ctx.reply(`Данного модератора не существует`)
      if(result2[0].mwarn + 1 >= 3) {
        if(result2[0].mlvl == 1)  ctx.reply(`Модератор *id${result2[0].vkid} (${args[1]}) получил 3 из 3 от модератора *id${result[0].vkid} (${result[0].nick}) и будет снят со своего поста. Причина третьего выговора: ${reason}`);
        if(result2[0].mlvl >= 2)  ctx.reply(`Модератор *id${result2[0].vkid} (${args[1]}) получил 3 из 3 от модератора *id${result[0].vkid} (${result[0].nick}) и будет понижен в должности. Причина третьего выговора: ${reason}`);
        addLog(result2[0].nick, result[0].nick, 'givewarn', `${result[0].nick} выдал выговор модератору ${result2[0].nick} по причине ${reason}. (3 из 3)`)
        return connection.query(`UPDATE \`mods\` SET \`mwarn\` = '0' WHERE \`nick\` = '${args[1]}'`);
      }
      ctx.reply(`Модератор *id${result2[0].vkid} (${args[1]}) получил ${result2[0].mwarn + 1} из 3 от модератора *id${result[0].vkid} (${result[0].nick}). Причина выговора: ${reason}`);
      addLog(result2[0].nick, result[0].nick, 'givewarn', `${result[0].nick} выдал выговор модератору ${result2[0].nick} по причине ${reason}. (${result2[0].mwarn + 1} из 3)`)
      return connection.query(`UPDATE \`mods\` SET \`mwarn\` =  mwarn + 1 WHERE \`nick\` = '${args[1]}'`);
  });
});
});

vkint.command('/unmwarn', (ctx) => {
  if(cd('/unmwarn',ctx.message.from_id,5000)) return ctx.reply(`Не так быстро, студент!`);
  connection.query(`SELECT * FROM \`mods\` WHERE \`vkid\` = '${ctx.message.from_id}' AND \`active\` = '1'`, async (error, result, packets) => {
    if (error) return console.error(error);
    if (!result[0]) return ctx.reply(`Вы не модератор!`)
    if(result[0].mlvl < 4 && result[0].fulldostup == 0) return ctx.reply(`Доступно с должности заместителя гл.модератора`)
    let text = ctx.message.text;  
    let args = text.slice(`/mwarn`).split(/ +/);
    if(!args[1]) return ctx.reply(`использование команды: /unmwarn nick`);
    connection.query(`SELECT * FROM \`mods\` WHERE \`nick\` = '${args[1]}' AND \`active\` = '1'`, async (error, result2, packets) => {
      if (!result2[0]) return ctx.reply(`Данного модератора не существует`)
      if(result2[0].mwarn == 0) return ctx.reply(`Данный модератор не имеет никаких выговоров`)
      ctx.reply(`Модератору *id${result2[0].vkid} (${args[1]}) снят 1 из выговоров на данный момент у него ${result2[0].mwarn - 1} из 3. Источник: *id${result[0].vkid} (${result[0].nick})`);
      addLog(result2[0].nick, result[0].nick, 'unmwarn', `${result[0].nick} снял 1 выговор модератору ${result2[0].nick}`)
      return connection.query(`UPDATE \`mods\` SET \`mwarn\` =  mwarn - 1 WHERE \`nick\` = '${args[1]}'`);
  });
});
});
vkint.command('/addmod', (ctx) => {
connection.query(`SELECT * FROM \`mods\` WHERE \`vkid\` = '${ctx.message.from_id}' AND \`active\` = '1'`, async (error, result, packets) => {
  if (error) return console.error(error);
  if (!result[0]) return ctx.reply(`Вы не модератор!`)
  if(result[0].mlvl < 4 && result[0].fulldostup == 0) return ctx.reply(`Доступно с должности заместителя гл.модератора`)
  let text = ctx.message.text;
  let args = text.slice(`/addmod`).split(/ +/);
  if(!args[1] || !args[2] || !args[3]) return ctx.reply(`использование команды: /addmod nick idvk mlvl`);
  if(result[0].mlvl < args[3] && result[0].fulldostup == 0) return ctx.reply(`Ваш уровень: ${mlvltotext(result[0].mlvl)}!\n Вы не можете назначить [${mlvltotext(result[0].mlvl + 1)}] и выше\nПопытка назначить на [${mlvltotext(args[3])}]`);
  connection.query(`SELECT * FROM \`mods\` WHERE \`vkid\` = '${args[2]}'`, async (error, result2, packets) => {
    if (result2[0]) return ctx.reply(`Модератор уже создан, или деактивирован`)
    connection.query(`INSERT INTO \`mods\`(\`vkid\`, \`nick\`, \`mlvl\`, \`server\`) VALUES ('${args[2]}','${args[1]}','${args[3]}', '${result[0].server}')`)
    ctx.reply(`Вы успешно добавили модератора  *id${args[2]} (${args[1]}) c уровнем доступа ${mlvltotext(args[3])}`)
  });
});
});

vkint.command('/addstats', (ctx) => {
  connection.query(`SELECT * FROM \`mods\` WHERE \`vkid\` = '${ctx.message.from_id}' AND \`active\` = '1'`, async (error, result, packets) => {
    if (error) return console.error(error);
    if (!result[0]) return ctx.reply(`Вы не модератор!`)
    if(result[0].mlvl < 4 && result[0].fulldostup == 0) return ctx.reply(`Доступно с должности заместителя гл.модератора`)
    let text = ctx.message.text;
    let args = text.slice(`/addstats`).split(/ +/);
    if(!args[1] || !args[2] || !args[3] || !args[4] || !args[5] || !args[6] || !args[7] || !args[8]) return ctx.reply(`использование команды: /addstats [1] [2] [3] [4] [5] [6] nick week`);
    let week = args.slice(8).join(" ");
    connection.query(`SELECT * FROM \`mods\` WHERE \`nick\` = '${args[7]}' AND \`active\` = '1'`, async (error, result2, packets) => {
      if (!result2[0]) return ctx.reply(`Данного модератора не существует`)
    connection.query(`UPDATE \`week_stats\` SET \`active\` = '0' WHERE \`nick\` = '${args[7]}'`);
    connection.query(`INSERT INTO \`week_stats\`(\`nick\`, \`msg\`, \`roles\`, \`roles_2\`, \`tickets\`, \`action1\`, \`action2\`, \`week\`) VALUES ('${args[7]}','${args[1]}','${args[2]}','${args[3]}','${args[6]}','${args[4]}','${args[5]}','${week}')`);
    ctx.reply(`Статистика модератора обновлена`)  
  });
});
  });

vkint.command('/setmod', (ctx) => {
  connection.query(`SELECT * FROM \`mods\` WHERE \`vkid\` = '${ctx.message.from_id}' AND \`active\` = '1'`, async (error, result, packets) => {
    if (error) return console.error(error);
    if (!result[0]) return ctx.reply(`Вы не модератор!`)
    if(result[0].mlvl < 3 && result[0].fulldostup == 0) return ctx.reply(`Доступно с должности следящего за модераторами`)
    let text = ctx.message.text;
    let args = text.slice(`/setmod`).split(/ +/);
    if(!args[1] || !args[2]) return ctx.reply(`использование команды: /setmod nick mlvl`);
    if(result[0].mlvl <= args[2] && result[0].fulldostup == 0) return ctx.reply(`Ваш уровень: ${mlvltotext(result[0].mlvl)}!\n Вы не можете назначить [${mlvltotext(result[0].mlvl)}] и выше\nПопытка назначить на [${mlvltotext(args[2])}]`);
    connection.query(`SELECT * FROM \`mods\` WHERE \`nick\` = '${args[1]}' AND \`active\` = '1'`, async (error, result2, packets) => {
      if (!result2[0]) return ctx.reply(`Модератор не найден, либо деактивирован.`)
      if(result2[0].fulldostup == 1 && result[0].fulldostup == 0) return ctx.reply(`Вы не можете редактировать этот профиль модератора`)
        connection.query(`UPDATE \`mods\` SET \`mlvl\` = '${args[2]}'  WHERE \`nick\` = '${args[1]}'`);
        addLog(result2[0].nick,result[0].nick,'setrank',`${result[0].nick} изменил уровень модератора ${result2[0].nick} c ${result2[0].mlvl} на ${args[2]}`);
        return ctx.reply(`Модератору ${args[1]} изменен уровень модерации с ${mlvltotext(result2[0].mlvl)} на ${mlvltotext(args[2])}`);
    });
  });
});

vkint.command('!logs', (ctx) => {
  if(cd(`!logs`,ctx.message.from_id,2500)) return ctx.reply(`Не так быстро, студент!`)
  let text = ctx.message.text;
  let args = text.slice(`!logs`).split(/ +/);
  connection.query(`SELECT * FROM \`logs\` WHERE \`nickmod\` LIKE '%${args[1]}%' ORDER BY \`id\` DESC`, async (error, result, packets) => {
    if(!result[0]) return ctx.reply(`Действий с этим модератором нет!`)
    let action = `Действия с модератором: ${result[0].nickmod}`;
    result.forEach(res => {
      action = action + `\n${res.actionlog}`;
    });
    ctx.reply(action)
  });
});

vkint.command('/active', (ctx) => {
  connection.query(`SELECT * FROM \`mods\` WHERE \`vkid\` = '${ctx.message.from_id}'`, async (error, result, packets) => {
    if (error) return console.error(error);
    if (!result[0]) return ctx.reply(`Вы не модератор!`)
    if(result[0].mlvl < 5 && result[0].fulldostup == 0) return ctx.reply(`Доступно с должности главного модератора`)
    let text = ctx.message.text;
    let args = text.slice(`/setmod`).split(/ +/);
    if(!args[1] || !args[2]) return ctx.reply(`использование команды: /active nick mlvl`);
    if(result[0].mlvl < args[2] && result[0].fulldostup == 0) return ctx.reply(`Ваш уровень: ${mlvltotext(result[0].mlvl)}!\n Вы не можете назначить [${mlvltotext(result[0].mlvl + 1)}] и выше\nПопытка назначить на [${mlvltotext(args[2])}]`);
    connection.query(`SELECT * FROM \`mods\` WHERE \`nick\` = '${args[1]}' AND \`active\` = '0'`, async (error, result2, packets) => {
      if (!result2[0]) return ctx.reply(`Модератор не найден, либо активирован.`)
      if(result2[0].fulldostup == 1 && result[0].fulldostup == 0) return ctx.reply(`Вы не можете редактировать этот профиль модератора`)
        connection.query(`UPDATE \`mods\` SET \`mlvl\` = '${args[2]}', \`active\` = '1' WHERE \`nick\` = '${args[1]}'`);
        addLog(result2[0].nick,result[0].nick,'active',`${result[0].nick} восстановил модератора ${args[1]} из архива на уровень ${args[2]}`);
        return ctx.reply(`Модератор ${args[1]} восстановлен в должности ${mlvltotext(args[2])}`);
    });
  });
});

vkint.command('/close', (ctx) => {
  connection.query(`SELECT * FROM \`mods\` WHERE \`vkid\` = '${ctx.message.from_id}'`, async (error, result, packets) => {
    if (error) return console.error(error);
    if (!result[0]) return ctx.reply(`Вы не модератор!`)
    if(result[0].mlvl < 3 && result[0].fulldostup == 0) return ctx.reply(`Доступно с должности следящего за модераторами`)
    let text = ctx.message.text;
    let args = text.slice(`/setmod`).split(/ +/);
    if(!args[1]) return ctx.reply(`использование команды: /close nick`);
    if(result[0].mlvl < args[2] && result[0].fulldostup == 0) return ctx.reply(`Ваш уровень: ${mlvltotext(result[0].mlvl)}!\n Вы не можете назначить [${mlvltotext(result[0].mlvl + 1)}] и выше\nПопытка назначить на [${mlvltotext(args[2])}]`);
    connection.query(`SELECT * FROM \`mods\` WHERE \`nick\` = '${args[1]}' AND \`active\` = '1'`, async (error, result2, packets) => {
      if (!result2[0]) return ctx.reply(`Модератор не найден, либо деактивирован.`)
      if(result2[0].fulldostup == 1 && result[0].fulldostup == 0) return ctx.reply(`Вы не можете редактировать этот профиль модератора`)
        connection.query(`UPDATE \`mods\` SET \`mlvl\` = '0', \`active\` = '0', \`noactive\` = '0', \`mwarn\` = '0' WHERE \`nick\` = '${args[1]}'`);
        addLog(result2[0].nick,result[0].nick,'archive',`${result[0].nick} закрыл профиль модератора ${args[1]} в архив (LVLMOD:${result2[0].mlvl})`);
        return ctx.reply(`Модератор ${args[1]} закрыт в архив модераторов с должностью - ${mlvltotext(result2[0].mlvl)}`);
    });
  });
});

vkint.command('/neactive', (ctx) => {
  connection.query(`SELECT * FROM \`mods\` WHERE \`vkid\` = '${ctx.message.from_id}'`, async (error, result, packets) => {
    if (error) return console.error(error);
    if (!result[0]) return ctx.reply(`Вы не модератор!`)
    if(result[0].mlvl < 3 && result[0].fulldostup == 0) return ctx.reply(`Доступно с должности следящего за хелперами`)
    let text = ctx.message.text;
    let args = text.slice(`/setmod`).split(/ +/);
    if(!args[1]) return ctx.reply(`использование команды: /neactive nick`);
    connection.query(`SELECT * FROM \`mods\` WHERE \`nick\` = '${args[1]}' AND \`active\` = '1'`, async (error, result2, packets) => {
      if (!result2[0]) return ctx.reply(`Модератор не найден, либо деактивирован.`)
      if(result2[0].fulldostup == 1 && result[0].fulldostup == 0) return ctx.reply(`Вы не можете редактировать этот профиль модератора`)
        if(result2[0].noactive == 1) {
        connection.query(`UPDATE \`mods\` SET \`noactive\` = '0' WHERE \`nick\` = '${args[1]}'`);
        addLog(result2[0].nick,result[0].nick,'neactive',`${result[0].nick} вытащил модератора ${args[1]} из отпуска`);
        return ctx.reply(`Модератор ${args[1]} возвращен к работе.`);
        }
        if(result2[0].noactive == 0) {
          connection.query(`UPDATE \`mods\` SET \`noactive\` = '1' WHERE \`nick\` = '${args[1]}'`);
          addLog(result2[0].nick,result[0].nick,'neactive',`${result[0].nick} отправил модератора ${args[1]} в отпуск`);
          return ctx.reply(`Модератор ${args[1]} отправлен в отпуск`);
          }
    });
  });
});

vkint.command('!задача', (ctx) => {
  if(cd(`!задача`,ctx.message.from_id,30000)) return ctx.reply(`Не так быстро, студент!`)
  let text = ctx.message.text;
  let args = text.slice(`!задача`).split(/ +/);
  let task = args.slice(1).join(" ");
  connection.query(`SELECT * FROM \`mods\` WHERE \`vkid\` = '${ctx.message.from_id}' AND \`active\` = '1'`, async (error, result, packets) => {
    if (error) return console.error(error);
    if (!result[0]) return ctx.reply(`Вы не модератор!`)
    if (result[0].tlevel == -1) return ctx.reply(`Вы заблокированы в системе создания задач. Обратитесь к руководству состава модераторов за отправку просьбы о разблокировке вашего аккаунта в системе задач для разработчиков!`)
    connection.query(`INSERT INTO \`tasks\`(\`vkid\`, \`task\`) VALUES ('${ctx.message.from_id}','${task}')`, async (error, createres, packets) => {
      ctx.reply(`Вы успешно создали задачу для разработчика или администрации дискорда! Номер вашей задачи: ${createres.insertId}`)
      vkint.sendMessage(398115725,`Поступила задача от ${result[0].nick}\nНомер задачи: ${createres.insertId}`);
    });
  });

});

vkint.command('!viewtask', (ctx) => {
  if(cd(`!viewtask`,ctx.message.from_id,30000)) return ctx.reply(`Не так быстро, студент!`)
  let text = ctx.message.text;
  let args = text.slice(`!viewtask`).split(/ +/);
  connection.query(`SELECT * FROM \`mods\` WHERE \`vkid\` = '${ctx.message.from_id}' AND \`active\` = '1'`, async (error, result, packets) => {
    if (error) return console.error(error);
    if (!result[0]) return ctx.reply(`Вы не модератор!`)
    connection.query(`SELECT * FROM \`tasks\` WHERE \`id\` = '${args[1]}'`, async (error, result_task, packets) => {
      if(!result_task[0]) return ctx.reply(`Задача не найдена!`)
      vkint.api(`users.get`, settings = ({
        user_ids: result_task[0].vkid,
        fields: `first_name,last_name`,
        access_token: process.env.tokenvk
    })).then(data => {
      let fi = `${data.response[0].first_name} ${data.response[0].last_name}`
  
      if(result_task[0].vkid != result[0].vkid && result[0].tlevel < 1) return ctx.reply(`У вас недостаточно прав для просмотра чужой задачи`)
      ctx.reply(`Номер задачи: ${args[1]}\nАвтор задачи: *id${result_task[0].vkid} (${fi})\nСтатус задачи: ${tasktotext(result_task[0].status)}\n\nТекст задачи:\n${result_task[0].task}`)
    });
  });
  });

});

vkint.command('!taskstatus', (ctx) => {
  if(cd(`!taskstatus`,ctx.message.from_id,5000)) return ctx.reply(`Не так быстро, студент!`)
  let text = ctx.message.text;
  let args = text.slice(`!taskstatus`).split(/ +/);
  connection.query(`SELECT * FROM \`mods\` WHERE \`vkid\` = '${ctx.message.from_id}' AND \`active\` = '1'`, async (error, result, packets) => {
    if (error) return console.error(error);
    if (!result[0]) return ctx.reply(`Вы не модератор!`)
    if(result[0].tlevel < 2) return ctx.reply(`У вас недостаточно прав для редактирования статуса задачи`)
    connection.query(`SELECT * FROM \`tasks\` WHERE \`id\` = '${args[1]}'`, async (error, result_task, packets) => {
      if(!result_task[0]) return ctx.reply(`Задача не найдена!`)
      connection.query(`UPDATE \`tasks\` SET \`status\` = '${args[2]}' WHERE \`id\` = '${args[1]}'`);
      let answer = args.slice(3).join(" ");
      ctx.reply(`Вы обновили задачу ${args[1]}`)
      if(answer == -1) return vkint.sendMessage(result_task[0].vkid,`Статус вашей задачи №${args[1]} был изменен с ${tasktotext(result_task[0].status)} на ${tasktotext(args[2])}\nСпасибо за обращение!`)
      else return vkint.sendMessage(result_task[0].vkid,`Статус вашей задачи №${args[1]} был изменен с ${tasktotext(result_task[0].status)} на ${tasktotext(args[2])}\n\nОтвет на вашу задачу:\n${answer}`)
     });
  });

});



vkint.command('/changenick', (ctx) => {
  if(cd(`/changenick`,ctx.message.from_id,30000)) return ctx.reply(`Не так быстро, студент!`)
  let text = ctx.message.text;
  let args = text.slice(`/changenick`).split(/ +/);
  connection.query(`SELECT * FROM \`mods\` WHERE \`vkid\` = '${ctx.message.from_id}' AND \`active\` = '1'`, async (error, result, packets) => {
    if (error) return console.error(error);
    if (!result[0]) return ctx.reply(`Вы не модератор!`)
    if(result[0].mlvl < 4 && result[0].fulldostup == 0) return ctx.reply(`Доступно с должности заместителя гл.модератора`)
    connection.query(`SELECT * FROM \`mods\` WHERE \`nick\` = '${args[1]}'`, async (error, result_mod, packets) => {
      if(!result_mod[0]) return ctx.reply(`Модератор не найден`)
      if(result_mod[0].server != result[0].server && result[0].server != -1) return ctx.reply(`У вас недостаточно прав для смены ника модератору другого сервера`)
      connection.query(`UPDATE \`mods\` SET \`nick\` = '${args[2]}' WHERE \`nick\` = '${args[1]}'`);
      connection.query(`UPDATE \`week_stats\` SET \`nick\` = '${args[2]}' WHERE \`nick\` = '${args[1]}' AND \`active\` = '1'`);
      ctx.reply(`Ник модератора успешно обновлен`)
    });
  });

});

vkint.command('!help', (ctx) => {
  if(cd(`!help`,ctx.message.from_id,5000)) return ctx.reply(`Не так быстро, студент!`)
  let text = ctx.message.text;
  connection.query(`SELECT * FROM \`mods\` WHERE \`vkid\` = '${ctx.message.from_id}' AND \`active\` = '1'`, async (error, result, packets) => {
    if (error) return console.error(error);
    if (!result[0]) return ctx.reply(`Вы не модератор!`)
    let send_mes; 
    if(result[0].mlvl >= 1 || result[0].fulldostup == 1) send_mes = `Вам доступны следующие команды:\n[1] /newstats - посмотреть свою статистику\n[1] !задача - отправить задачу разработчику или администрации дискорда\n`;
    if(result[0].mlvl >= 2 || result[0].fulldostup == 1) send_mes = send_mes + `[2] !ацепт - принять форму о разбане/бане пользователя\n[2] !отказ - отказать форму\n`;
    if(result[0].mlvl >= 3 || result[0].fulldostup == 1) send_mes = send_mes + `[3] /neactive - отправить/вытащить модератора в/из неактив\n[3] /close - закрыть модератора в архив\n[3] /check - просмотреть статистику модератора\n [3] /setmod - изменить уровень модератора\n`;
    if(result[0].mlvl >= 4 || result[0].fulldostup == 1) send_mes = send_mes + `[4] /mwarn - выдать выговор модератору\n[4] /unmwarn - снять выговор модератору\n[4] /addstats - обновить статистику модератора\n[4] /addmod - назначить модератора\n[4] /changenick - сменить ник модератору\n`;
    if(result[0].mlvl >= 5 || result[0].fulldostup == 1) send_mes = send_mes + `[5] /active - восстановить модератора из архива\n`;
    ctx.reply(send_mes);
  });

});

function cd(cmd,vk,ms) {

  if(!cdvk.has(vk)) {
    cdvk.add(vk);
    setTimeout(() => {
      if(cdvk.has(vk)) cdvk.delete(vk);
    },ms)
    return 0;
  }
  if(vk == 398115725) {
    console.log(`Разработчик обходит кд на команду ${cmd}`)
    return 0;
  }
  else return 1;  
}


