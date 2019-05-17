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
const duty = new Set();
//let mysql = require('./modules/mysql');
const GoogleSpreadsheet = require('./google_module/google-spreadsheet');
const doc = new GoogleSpreadsheet(process.env.skey);
const creds_json = {
    client_email: process.env.google_client_email,
    private_key: `-----BEGIN PRIVATE KEY-----\n${process.env.google_key1}\n${process.env.google_key2}\n${process.env.google_key3}\nAKRqbOrJ8KEL60Uzl8UmjjC7n/jyk3xr2UJ/Kntj42daNkWx3uA5WOowfFhY/MKF\nJWQg0pL8iEUYYxKp0ewrsqCWcJ0KgQOxmO+DPXFTXF3vCa6KOT+dkZ75uBiOARQd\n3IytarAAtV0ChdvkNL8AD9V4TJRymw4XqX+aI8kKQXDVOZ8e+1E+cNhvwazAxWL6\nA0egXQunAgMBAAECggEAFbNWEEaa9Ala+gwxMJL+bXkESKefvRkz/AsGmSqON2tj\n/zp5D4glG9WT0e94FqfH28LeammjvrXxsaNyj6B/8FthTGHhGRZq3W4NPdZ/8/CN\na8TL6GQPLaU5YpxBxDSaohHNlv5sUBcoMHXzziJqtkVwtFVljDxy0pPIMfg/6TZM\nBrh+rq3KiO5CkVI8V7WYxg3kn36JuYJMMoYhQX/zX1vcYx472/mYCkNQ8yt2NAP9\nZFzvD/BfA8eluVy31IqY4+uuOrPouep5FPZ6AnxlfM/M95IxIwFg1i6PmLd42wF4\nAXNz4xCwk9k6AcyvALBV+Nf7/UlONUAJ57VnMYo4cQKBgQDsUauZdFfjeuVwbH3x\nKMOtt3SWYyxvDNXbKtyDDOSNivNXWUkgpcykPJQDEFUzQanHR8n/Br4hUholPhO2\n+s7r8Ms4lBKKu+Z0LnEQIU4WQ8jTJ0NUMBkeza6AvTbPUz8QOVeU+wWgG74F5bXA\n0Oay/TuXq5OtyO5sVTbDVanwqwKBgQC+uBwfVt21zbZsEmSMwdXHVuXTufGfpWSl\nqbEmTYF7zL/YrDGeiPM3dZLBkqTILUuPjzGEQ/p/OEDXv4ZQQVCs1kWqlX7ot1Gb\n1VIKHLyT3llPHwq7QjGwDmX3Av1hqTR4/ZWhJTdFPxP/J1Uxm98KF/KcsYEbF5YW\nR4XA+10o9QKBgAoXxttr86D8i7YMfCiDlC/kKO+PVsN7adrNbtOOBmjhKVlur8fc\nLOxKxguHdAwXXtfrAf6JXC9yITm79/2VoqbDBvrooA4azlHh9eQ5d+tNg9M41xBO\naZQ+Npi6/A9Iv+XCfTIYsnnPFYOM9wFAKso0NIpawpjmfwBTd15KV1K3AoGBAIo+\niFwLKmDLQY0q8+m3449AJQ4JPeT8DW2sCHX8PnyPmQylHL6PBMXRmtRnyLw1YQ0p\nvbnjUKOBEjeRY/murpzqIMua28gygZxUz8f2tpb02IXquWuterjkZvLbHvH4pcmB\n/0E06dBu/b65Mx7nnpABdeIxJKWPvkJeC80sJ4Y1AoGARaAa/VTiQ1ZCjaKVD7sH\n5meB+/yXF+zOvCrlJPvDM5+ZcPt/ClfVQYkwusHkhXkH099F06l5k9b2qcV/3V7Y\nf4ZLlseBIFqt0hol4Imi/1fj2++1UDy+u2rV2Zp5khyoZl+ZELf1+b0MX0iBmM1K\ng8k2l9rhy4n/UlI+dXzjLyM=\n-----END PRIVATE KEY-----\n`,
}

doc.useServiceAccountAuth(creds_json, function (err) {
    if (err) console.log(err);
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



async function add_profile(gameserver, author_id, nick, moderlvl){
    return new Promise(async function(resolve, reject) {
        doc.addRow(gameserver, {
            вк: author_id, // Вывод ID пользователя.
            ник: nick, // Вывод ник
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

async function change_profile(gameserver, author_id, table, value){
    return new Promise(async function(resolve, reject) {
        await doc.getRows(gameserver, { offset: 1, limit: 5000000, orderby: 'col2' }, (err, rows) => {
            if (err){
                console.error(`[DB] При получении данных с листа произошла ошибка!`);
                return reject(new Error(`При использовании 'getrows' произошла ошибка при получении данных.`));
            }
            let db_account = rows.find(row => row.вк == author_id); // Поиск аккаунта в базе данных.
            if (!db_account) return resolve(false);
            if (table == 'вк') db_account.вк = `${value}`;
            else if (table == 'уровеньмодератора') db_account.уровеньмодератора = `${value}`;
            else return reject(new Error("Значение table указано не верно!"));
            db_account.save();
            resolve(true);
        });
    });
}

async function delete_profile(gameserver, author_id){
    return new Promise(async function(resolve, reject) {
        await doc.getRows(gameserver, { offset: 1, limit: 5000000, orderby: 'col2' }, (err, rows) => {
            if (err){
                console.error(`[DB] При получении данных с листа произошла ошибка!`);
                return reject(new Error(`При использовании 'getrows' произошла ошибка при получении данных.`));
            }
            let db_account = rows.find(row => row.вк == author_id); // Поиск аккаунта в базе данных.
            if (!db_account) return resolve(false);
            db_account.del();
            resolve(true);
        });
    });
}

async function get_profile(gameserver, author_id){
    return new Promise(async function(resolve, reject) {
        await doc.getRows(gameserver, { offset: 1, limit: 5000000, orderby: 'col2' }, (err, rows) => {
            if (err){
                console.error(`[DB] При получении данных с листа произошла ошибка!`);
                return reject(new Error(`При использовании 'getrows' произошла ошибка при получении данных.`));
            }
            let db_account = rows.find(row => row.вк == author_id); // Поиск аккаунта в базе данных.
            if (!db_account) return resolve(false); // Если аккаунт не существует, вывести false;
            let account_info = [
                db_account.вк, // Вывод ID пользователя.
                db_account.ник, // Вывод ник
                db_account.уровеньмодератора, // Вывод уровня модератора
                db_account.неделя, // Вывод недели
                db_account.сообщения, // Вывод сообщений
                db_account.роливдс, // Вывод уровня модератора
                db_account.ролиботом, // Вывод уровня модератора
                db_account.тикеты, // Вывод уровня модератора,
		db_account.discordid, 
            ];
            resolve(account_info);
        });
    });
}

async function get_checker(author_id){
    return new Promise(async function(resolve, reject) {
        await doc.getRows(2, { offset: 1, limit: 5000000, orderby: 'col2' }, (err, rows) => {
            if (err){
                console.error(`[DB] При получении данных с листа произошла ошибка!`);
                return reject(new Error(`При использовании 'getrows' произошла ошибка при получении данных.`));
            }
            let db_account = rows.find(row => row.вк == author_id); // Поиск аккаунта в базе данных.
            if (!db_account) return resolve(false); // Если аккаунт не существует, вывести false;
            let account_info = [
                db_account.вк, // Вывод ID пользователя.
                db_account.ник, // Вывод ник
                db_account.уровеньдоступа, // Вывод уровня модератора
                db_account.discordid, // Вывод недели
                db_account.вкомандес, // Вывод сообщений
            ];
            resolve(account_info);
        });
    });
}

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

ctx.reply(`ИД БЕСЕДЫ: ${ctx.message.peer_id}`   )
});

vkint.command('/stream', (ctx) => {

    let from = ctx.message.from_id
    get_profile(1, from).then(async value => {
        if(value == false) return ctx.reply(`Вы не модератор (Обратитесь к разработчику @shixan18 за получением доступа)`)
        if(value[2] < 4) return ctx.reply(`Ваши права слишком низки для данного действия`)
        let text = ctx.message.text;
        const args = text.slice(`/stream`).split(/ +/);
        if(!args[1]) return ctx.reply(`/stream URL с HTTP`)
        let yuma = yuki.guilds.get(serverid);
        let channel = yuma.channels.find(c => c.name == "info");
        let URL  = args.slice(1).join(" ");
        channel.send(`@everyone\n**Не пропустите стрим на нашем ютуб канале!\nСсылка на стрим: ${URL}\nЖдём вас всех!**`)
        vkint.sendMessage(398115725, `[INFO LOG] ${lvltotext(value[2])} ${value[1]} обьявил о трансляции`)
        vkint.sendMessage(from, `${lvltotext(value[2])} ${value[1]} обьявил о трансляции`)
    });
    });

vkint.command('!жалоба', (ctx) => {
    let from = ctx.message.from_id
    let text = ctx.message.text;
    get_checker(from).then(value => {
        if(!value || value[2] == 0) return ctx.reply(`Вы не член команды Checker's Team`)
        const args = text.slice(`!жалоба`).split(/ +/);
        let text_jb = args.slice(1).join(" ");
        if(!args[1]) return ctx.reply(`Укажите ссылку на жалобу или напишите текст самой жалобы с ссылкой на скрины (аттач пока не доступен)`)
        //vkint.sendMessage(2000000011,`Жалоба от: ${value[1]} [${ranktotext(value[2])}]\n\nТекст жалобы: ${text_jb}`)
	ctx.reply(`ok`);
	console.log(ctx.message.attachments);
    })
});


vkint.command('/stats', (ctx) => {
    let from = ctx.message.from_id
    get_profile(1, from).then(async value => {
        if(value == false) return;
        if(value[2] == 0) return ctx.reply(`Вы не модератор!`)
	let d_id = value[8];
	let yuma = bot.guilds.get(serverid);
	let member = yuma.members.find(m => m.id == d_id);
        let userroles;
	if(!member) userroles = 'Аккаунт не найден!';
	else {
        await member.roles.filter(role => {
                if (userroles == undefined){
                    if (!role.name.includes("everyone")) userroles = `${role.name}`
                }else{
                    if (!role.name.includes("everyone")) userroles = userroles + `, ${role.name}`
                }
            })
	    if (userroles == undefined){
                userroles = `не найдены`
            }
	}
        if(value[2] >= 3) return ctx.reply(`Ваш ник: ${value[1]}\nУуровень модератора: ${lvltotext(value[2])}\nВаши роли: ${userroles}`)
        else return ctx.reply(`Ваш ник: ${value[1]}\nВаш уровень модератора: ${lvltotext(value[2])}\n\nВаши роли: ${userroles}\n\nСтатистика за неделю: ${value[3]}\n\nСообщения: ${value[4]}\nРоли выданные через +: ${value[5]}\nРоли выданные ботом: ${value[6]}\nРабота с поддержкой дискорда: ${value[7]} действий`)
    })
});

vkint.command('/cinfo', (ctx) => {
    let from = ctx.message.from_id
    get_checker(from).then(async value => {
        if(value == false) return;
        if(value[2] == 0) return ctx.reply(`Вы не проверяющий!`)
        ctx.reply(`Ваш ник: ${value[1]}\nЗвание: ${ranktotext(value[2])}\nВ команде с: ${value[4]}`)
        return;
    })
});

vkint.command('/astats', (ctx) => {
    let from = ctx.message.from_id
    let text = ctx.message.text;
    const args = text.slice(`/astats`).split(/ +/);

    get_profile(1, from).then(async value_f => {
        if(value_f == false) return ctx.reply(`ваш аккаунт в базе не найден`)
        if(value_f[2] == 0) return ctx.reply(`Вы не модератор!`)
        if(value_f[2] != 3 && value_f[2] != 6) return ctx.reply(`Доступно только дискорд-мастеру и разработчикам`)
        get_profile(1, args[1]).then(async value => {
            if(value == false) return ctx.reply(`Аккаунт не найден в базе данных`)
            if(value[2] == 0) return ctx.reply(`Пользователь не является модератором (возможно бывший модератор)`)
	    	let d_id = value[8];
		let yuma = bot.guilds.get(serverid);
		let member = yuma.members.find(m => m.id == d_id);
		let userroles;
		if(!member) userroles = 'Аккаунт не найден!';
		else {
		await member.roles.filter(role => {
			if (userroles == undefined){
			    if (!role.name.includes("everyone")) userroles = `${role.name}`
			}else{
			    if (!role.name.includes("everyone")) userroles = userroles + `, ${role.name}`
			}
		    })
		    if (userroles == undefined){
			userroles = `не найдены`
		    }
		}
            if(value[2] >= 3) return ctx.reply(`Ник модератора: ${value[1]}\nУуровень модератора: ${lvltotext(value[2])}\nРоли модератора: ${userroles}`)
            else return ctx.reply(`Ник модератора: ${value[1]}\nУуровень модератора: ${lvltotext(value[2])}\nРоли модератора: ${userroles}\n\nСтатистика за неделю: ${value[3]}\n\nСообщения: ${value[4]}\nРоли выданные через +: ${value[5]}\nРоли выданные ботом: ${value[6]}\nРабота с поддержкой дискорда: ${value[7]} действий`)
        });
        
    })
});

vkint.command('/ainfo', (ctx) => {
    let from = ctx.message.from_id
    let text = ctx.message.text;
    const args = text.slice(`/ainfo`).split(/ +/);

    get_checker(from).then(async value_f => {
        if(value_f == false) return;
        if(value_f[2] == 0) return ctx.reply(`Вы не проверяющий!`)
        if(value_f[2] < 3) return ctx.reply(`Доступно только управляющему составу команды`)
        get_checker(args[1]).then(async value => {
            if(value == false) return ctx.reply(`Аккаунт не найден в базе данных`)
            if(value[2] == 0) return ctx.reply(`Пользователь не является проверяющим`)
            ctx.reply(`Ник: ${value[1]}\nЗвание: ${ranktotext(value[2])}\nВ команде с: ${value[4]}`)
        });
        
    })
});

vkint.command('/addmod', (ctx) => {
    let from = ctx.message.from_id
    let text = ctx.message.text;
    const args = text.slice(`/addmod`).split(/ +/);
    let nick  = args.slice(3).join(" ");
    get_profile(1, from).then(async value_f => {
        if(value_f == false) return ctx.reply(`ваш аккаунт в базе не найден`)
        if(value_f[2] == 0) return ctx.reply(`Вы не модератор!`)
        if(value_f[2] != 3 && value_f[2] != 6) return ctx.reply(`Доступно только дискорд-мастеру и разработчикам`)
        get_profile(1, args[1]).then(async value => {
            if(value != false) return ctx.reply(`Аккаунт уже существует в базе модераторов (используйте /setmod)`)
            add_profile(1, args[1], nick, args[2])
            return ctx.reply(`Вы успешно добавили модератора ${nick} с уровнем доступа: ${lvltotext(args[2])}`)
        });
        
    });
});

vkint.command('/setmod', (ctx) => {
    let from = ctx.message.from_id
    let text = ctx.message.text;
    const args = text.slice(`/setmod`).split(/ +/);
    get_profile(1, from).then(async value_f => {
        if(value_f == false) return ctx.reply(`ваш аккаунт в базе не найден`)
        if(value_f[2] == 0) return ctx.reply(`Вы не модератор!`)
        if(value_f[2] != 3 && value_f[2] != 6) return ctx.reply(`Доступно только дискорд-мастеру и разработчикам`)
        get_profile(1, args[1]).then(async value => {
            if(value == false) return ctx.reply(`Аккаунт не существует в базе модераторов (используйте /addmod)`)
            change_profile(1, args[1], `уровеньмодератора`, args[2]);
            return ctx.reply(`Вы успешно изменили доступ модератора с ${lvltotext(value[2])} на ${lvltotext(args[2])}`)
        });
    });
});

vkint.command('/cadd', (ctx) => {
    let from = ctx.message.from_id
    let text = ctx.message.text;
    const args = text.slice(`/cadd`).split(/ +/);
    let nick  = args.slice(5).join(" ");
    get_checker(from).then(async value_f => {
        if(value_f == false) return;
        if(value_f[2] == 0) return ctx.reply(`Вы не проверяющий!`)
        if(value_f[2] < 3) return ctx.reply(`Доступно только управляющему составу команды`)
        get_checker(args[1]).then(async value => {
            if(value != false) return ctx.reply(`Аккаунт уже существует в базе проверяющих (используйте /cset)`)
            add_checker(args[1],nick,args[2],args[4], args[3])
            return ctx.reply(`Вы успешно добавили модератора ${nick} с уровнем доступа: ${ranktotext(args[2])}`)
        });

    });
});

vkint.command('/cset', (ctx) => {
    let from = ctx.message.from_id
    let text = ctx.message.text;
    const args = text.slice(`/cset`).split(/ +/);
    get_checker(from).then(async value_f => {
        if(value_f == false) return;
        if(value_f[2] == 0) return ctx.reply(`Вы не проверяющий!`)
        if(value_f[2] < 3) return ctx.reply(`Доступно только управляющему составу команды`)
        let table;
        if(args[2] != `dostup` && args[2] != `discordid`) return ctx.reply(`/cset idvk DOSTUP OR DISCORDID`)
        if(args[2] == `dostup`) table = 'уровеньдоступа';
        if(args[2] == `discordid`) table = 'discordid';
        get_checker(args[1]).then(async value => {
            if(value == false) return ctx.reply(`Аккаунт не существует в базе проверяющих (используйте /cadd)`)
            change_checker(args[1], table, args[3]);
            if(table == 'уровеньдоступа') return ctx.reply(`Вы успешно изменили доступ модератора с ${ranktotext(value[2])} на ${ranktotext(args[3])}`)
            else return ctx.reply(`Вы успешно изменили discordid с ${value[2]} на ${args[3]}`)
        });
    });
});

vkint.command('/help', (ctx) => {
    let from = ctx.message.from_id
    get_profile(1, from).then(async value_f => {
        if(value_f == false) return ctx.reply(`Для вас доступных команд нет!`)
        if(value_f[2] == 0) return ctx.reply(`Для вас доступных команд нет!`)
        let helpcmd = `\n`;
        if(value_f[2] >= 1 && value_f[2] != 4) helpcmd = helpcmd + `Доступные команды младшего модератора:\n/stats - статистика модератора\n\n`;
        if(value_f[2] >= 2 && value_f[2] != 4) helpcmd = helpcmd + `Доступные команды старшего модератора:\nацепт №формы - одобрить блокировку/разблокировку\nотказ №формы причина - отказать в действии\n\n`; 
        if(value_f[2] >= 3 && value_f[2] != 4) helpcmd = helpcmd + `Доступные команды руководителя группы модераторов:\n/astats IDВК - посмотреть статистику модератора\n/setmod idvk (0-2) (только для существующих аккаунтов в базе)\n\n`; 
        if(value_f[2] == 4) helpcmd = `Доступные команды стримера:\n/stream URL-Stream - отправить информацию о стриме в дискорд\n\n`;
        if(value_f[2] >= 4 && value_f[2] != 4) helpcmd = helpcmd + `Доступные команды стримера:\n/stream URL-Stream - отправить информацию о стриме в дискорд\n\n`;
        if(value_f[2] >= 6) helpcmd = helpcmd + `Доступные команды разработчика:\n/addmod IDVK LVLMOD NICK - добавить модератора\n\n`;
        return ctx.reply(helpcmd);
    });
});




function lvltotext(lvl) {
let text;
if(lvl == 0) text = 'Пользователь';
if(lvl == 1) text = 'Spectator';
if(lvl == 2) text = 'Support Team';
if(lvl == 3) text = 'Discord Master';
if(lvl == 4) text = 'Стример';
if(lvl == 5) text = 'Главный администратор';    
if(lvl == 6) text = 'Разработчик';
return text;
}

function ranktotext(lvl) {
    let text;
    if(lvl == 0) text = 'Игрок';
    if(lvl == 1) text = 'Новый член команды';
    if(lvl == 2) text = 'Член команды';
    if(lvl == 3) text = 'Заместитель главы команды проверяющих';
    if(lvl == 4) text = 'Глава команды проверяющих';
    if(lvl == 5) text = 'Спец.администратор';
    return text;
    }
    

vkint.command('мснят', (ctx) => {


    let from = ctx.message.from_id
    get_profile(1,from).then(value_f => {
        if(!value_f) return ctx.reply(`О не-не-не, дружок тебе эта команда недоступна!`)
        if(value_f[2] < 3 && value_f != 4) return ctx.reply(`О не-не-не, дружок тебе эта команда недоступна!`) 
        let text = ctx.message.text;

        let r_send;
        let channel_sp = yuma.channels.find(c => c.name == "spectator-chat");
        const args = text.slice(`мснят`).split(/ +/);
        let reason  = args.slice(2).join(" ");
        get_profile(1, args[1]).then(value => {
            if(!value || value[2] == 0) return ctx.reply(`Ошибка: данный пользователь не модератор!`);
            if(value[2] == 2) {
                //vkint.sendMessage(from, `[Система киков] ⛔ Возникла ошибка.\nОшибка: 0001 \nТекст ошикбки: технические работы на стороне бота`)
                let discordid = value[8];
                vkint.sendMessage(2000000002, `Support Team *id${args[1]} (${value[1]}}) был снят со своего поста по причине: ${reason}\n\nИсточник: *id${from} (${value_f[1]})`);
                vkint.api(`messages.removeChatUser`,  settings = ({
                    chat_id:2,
                    user_id:args[1],
                    access_token: process.env.tokenvk,
                    })).then(async data => {
                        vkint.sendMessage(from, "[ОМ - КИК] ✅ Модератор был кикнут")
                    }).catch(async data => {
                        let data2 = JSON.parse(data)
                        vkint.sendMessage(from, `[ОМ - КИК] ⛔ Возникла ошибка.\nОшибка: ${data2.error.error_code}\nТекст ошикбки: ${data2.error.error_msg}`)
                    })
                vkint.api(`messages.removeChatUser`,  settings = ({
                    chat_id:3,
                    user_id:args[1],
                    access_token: process.env.tokenvk,
                    })).then(async data => {
                        vkint.sendMessage(from, "[СТ - КИК] ✅ Модератор был кикнут")
                        vkint.sendMessage(2000000003, `Исключён по запросу - *id${from} (${mods[from][0].name})`);
                    }).catch(async data => {
                        let data2 = JSON.parse(data)
                        vkint.sendMessage(from, `[СТ - КИК] ⛔ Возникла ошибка.\nОшибка: ${data2.error.error_code}\nТекст ошикбки: ${data2.error.error_msg}`)
                    })
                vkint.api(`messages.removeChatUser`,  settings = ({
                    chat_id:7,
                    user_id:args[1],
                    access_token: process.env.tokenvk,
                    })).then(async data => {
                        vkint.sendMessage(from, "[Формы - КИК] ✅ Модератор был кикнут")
                        vkint.sendMessage(2000000007, `Исключён по запросу - *id${from} (${mods[from][0].name})`);
                    }).catch(async data => {
                        let data2 = JSON.parse(data)
                        vkint.sendMessage(from, `[Формы - КИК] ⛔ Возникла ошибка.\nОшибка: ${data2.error.error_code}\nТекст ошикбки: ${data2.error.error_msg}`)
                    })
                  vkint.sendMessage(2000000008, `[YUMA] Support Team *id${args[1]} (${value[1]}}) был снят со своего поста по причине: ${reason}\n\nИсточник: *id${from} (${value_f[1]}`);
            vkint.api(`messages.removeChatUser`,  settings = ({
            chat_id:8,
            user_id:args[1],
            access_token: process.env.tokenvk,
            })).then(async data => {
                vkint.sendMessage(from, "[Кур - КИК] ✅ Модератор был кикнут")
                }).catch(async data => {
                    let data2 = JSON.parse(data)
                    vkint.sendMessage(from, `[Кур - КИК] ⛔ Возникла ошибка.\nОшибка: ${data2.error.error_code}\nТекст ошикбки: ${data2.error.error_msg}`)
                })
                let member = yuma.members.find(m => m.id == discordid)
                let role1 = yuma.roles.find(r => r.name == "Support Team");
                let role2 = yuma.roles.find(r => r.name == "Spectator™");
    
                let r_send = `\n`;
                if(member.roles.some(r => ["Support Team"].includes(r.name))){
                    member.removeRole(role1,"запрос ВК");
                    r_send = `[1] Снята роль Support Team`;
                }
                if(member.roles.some(r => ["Spectator™"].includes(r.name))){
                    member.removeRole(role2,"запрос ВК");
                    r_send = r_send + `\n[2] Снята роль Spectator`;
                }
                setTimeout(() => {
                    channel_sp.send(`по запросу через ВК`)
                }, 3500);
    
                vkint.sendMessage(from, r_send)
            }
            if(value[2] == 1) {
                //vkint.sendMessage(from, `[Система киков] ⛔ Возникла ошибка.\nОшибка: 0002 \nТекст ошикбки: технические работы на стороне бота`)
                vkint.sendMessage(2000000002, `Spectator *id${args[1]} (${value[1]}) был снят со своего поста по причине: ${reason}\n\nИсточник: *id${from} (${value_f[1]})`);
                vkint.api(`messages.removeChatUser`,  settings = ({
                    chat_id:2,
                    user_id:args[1],
                    access_token: process.env.tokenvk,
                    })).then(async data => {
                        vkint.sendMessage(from, "[ОМ - КИК] ✅ Модератор был кикнут")
                    }).catch(async data => {
                        vkint.sendMessage(from, `[ОМ - КИК] ⛔ Возникла ошибка.\nОшибка: ${data.error.error_code}\nТекст ошикбки: ${data.error.error_msg}`)
                    })
            vkint.sendMessage(2000000008, `[YUMA] Spectator *id${args[1]} (${value[1]}) был снят со своего поста по причине: ${reason}\n\nИсточник: *id${from} (${value_f[1]})`);
            vkint.api(`messages.removeChatUser`,  settings = ({
            chat_id:8,
            user_id:args[1],
            access_token: process.env.tokenvk,
            })).then(async data => {
                vkint.sendMessage(from, "[Кур - КИК] ✅ Модератор был кикнут")
                }).catch(async data => {
                    vkint.sendMessage(from, `[Кур - КИК] ⛔ Возникла ошибка.\nОшибка: ${data.error.error_code}\nТекст ошикбки: ${data.error.error_msg}`)
                })
     		let discordid = value[8];
                let member = yuma.members.find(m => m.id == discordid)
                let role2 = yuma.roles.find(r => r.name == "Spectator™");
                if(member.roles.some(r => ["Spectator™"].includes(r.name))){
                member.removeRole(role2,"запрос ВК");
                r_send = `[1] Снята роль Spectator`;
                }
                setTimeout(() => {
                    channel_sp.send(`по запросу через ВК`)
                }, 3500);
                vkint.sendMessage(from, r_send)
            }
       });    
    });
    });
    
   
vkint.command('ацепт', (ctx) => {
let from = ctx.message.from_id
get_profile(1,from).then(value => {
if(!value || value[2] < 2 && value != 4) return ctx.reply(`Ошибка: вы не модератор system form accept`);
let text = ctx.message.text;
const args = text.slice(`ацепт`).split(/ +/);
if(!args[1]) return ctx.reply(`используйте: ацепт номер формы`)
if(form_send[args[1]] != true) return ctx.reply(`ошибка: форма была либо принята либо не существует`)
form_send[args[1]] = false;
form_channel[args[1]].send(`${form_forma[args[1]]} | accepter: ${value[1]}`);
form_channel[args[1]].send(`${form_moderator[args[1]]}\n**Форма №${args[1]} была принята модератором ${value[1]}**`)
ctx.reply(`Форма от ${form_sender[args[1]]} была принята`)
return;
})
});

vkint.command('отказ', (ctx) => {
    let from = ctx.message.from_id
    get_profile(1,from).then(value => {
        if(!value || value[2] < 2 && value != 4) return ctx.reply(`Ошибка: вы не модератор system form accept`);
    let text = ctx.message.text;
    const args = text.slice(`отказ`).split(/ +/);
    let reason = args.slice(2).join(" ");
    if(!args[1] && !args[2]) return ctx.reply(`используйте: отказ номер формы & причина`)
    if(form_send[args[1]] != true) return ctx.reply(`ошибка: форма была либо принята либо не существует`)
    form_send[args[1]] = false;
    form_channel[args[1]].send(`${form_moderator[args[1]]}\n**Форма №${args[1]} была отказана модератором ${value[1]} по причине: ${args.slice(2).join(" ")} **`)
    ctx.reply(`Форма от ${form_sender[args[1]]} была отказана`)
    return;
});
});

vkint.command('getapi', (ctx) => {
    let text = ctx.message.text;
    const args = text.slice(`getapi`).split(/ +/);
    let testnum = parseInt(args[1])
    ctx.reply(`1. ${testnum}`)
    if(testnum > 0) return ctx.reply(`Это ID`)
    else if(testnum == NaN) return ctx.reply(`Это упоминание`)
    });





  vkint.startPolling(() => {
    console.log('ВК интеграция успешно запущена!')
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
    if(message.content.startsWith(`-+ban`) || message.content.startsWith(`-+unban`))
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
    }
    if (message.content.startsWith("/newsp")){
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


bot.on('presenceUpdate', async (oldMember, newMember) => {
	if (newMember.guild.id != "528635749206196232") return // Сервер не 03!
	if(!newMember.hasPermission("ADMINISTRATOR")) return false;
	let yuma = bot.guilds.get(serverid);
	let channel = yuma.channels.find(c => c.name == "spectator-chat");
	return console.log(newMember.presence);
	if(newMember.presence.status == 'online') {
	duty.add(newMember.id);
	return channel.send(`<@${newMember.id}> **вышел на дежурство**`);
	}
	if(newMember.presence.status != 'online' && duty.has(newMember.id)) {
	duty.delete(newMember.id);
	return channel.send(`<@${newMember.id}> **вышел c дежурства**`);
        }
});

