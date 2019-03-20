const Discord = require('discord.js'); // by YukiFlores
const bot = new Discord.Client();
let serverid = '528635749206196232';
const authed = new Set();
const stmod = new Set();
const spmod = new Set();
const dm_mod = new Set();

const VkBot = require('node-vk-bot-api');
const vkint = new VkBot({
    token: process.env.tokenvk,
    confirmation: process.env.confim,
  })

let roles = 0;

function getRandomInt(min, max)
{

  return Math.floor(Math.random() * (max - min + 1)) + min;

}
/*
vkint.command('/ban', async (ctx) => {

    let from = ctx.message.from_id;
    if(!authed.has(from)) return ctx.reply("Ошибка: вы не авторизованы, используйте /auth [ID Discord]");
    if(!stmod.has(from)) return ctx.reply("Ошибка: для вас команда не доступна, получите повышение :)");
    if(ctx.message.peer_id != 2000000003 || ctx.message.peer_id != 2000000004 || ctx.message.peer_id != 398115725) ctx.reply("Ошибка: доступно только в беседе модераторов"); 
    let text = ctx.message.text;
    const args = text.slice(`/ban`).split(/ +/);
    if(!args[1] || !args[2]) return ctx.reply("Ошибка: использование: /ban [ID discord] [Причина]");
    let server = bot.guilds.get(serverid);
    if (!server) return ctx.reply("Ошибка: Бот не находится на сервере");
    let member = server.members.get(args[1]);
    if(!member) return ctx.reply("Ошибка: аккаунт не найден");
    let reason = `${args.slice(2).join(" ")} | Mod: ${from}`;
    if(!dm_mod.has(from) && member.roles.some(r => ["✔ Administrator ✔","✔Jr.Administrator✔","Support Team","✔ Helper ✔", "Spectator™"].includes(r.name))) return ctx.reply("Ошибка: заблокировать данного пользователя имеет право только Discord Master")
    member.ban(reason).then(() => {
 
        return ctx.reply(`Пользователь ${member.displayName || member.username} (ID: ${member.id}) заблокирован *id${from} (модератором). По причине: ${args.slice(2).join(" ")}`);

    }).catch(() => {

        return ctx.reply(`Я не смог заблокировать пользователя ${member.displayName || member.username} (ID: ${member.id}), вероятно у меня нет прав`);

    })

})

vkint.command('/unban', async (ctx) => {

    let from = ctx.message.from_id;
    if(!authed.has(from)) return ctx.reply("Ошибка: вы не авторизованы, используйте /auth [ID Discord]");
    if(!stmod.has(from)) return ctx.reply("Ошибка: для вас команда не доступна, получите повышение :)");
    if(ctx.message.peer_id != 2000000003 || ctx.message.peer_id != 2000000004 || ctx.message.peer_id != 398115725) ctx.reply("Ошибка: доступно только в беседе модераторов"); 
    let text = ctx.message.text;
    const args = text.slice(`/unban`).split(/ +/);
    if(!args[1] || !args[2]) return ctx.reply("Ошибка: использование: /unban [ID discord] [Причина]");
    let server = bot.guilds.get(serverid);
    if (!server) return ctx.reply("Ошибка: Бот не находится на сервере");
    let reason = `${args.slice(2).join(" ")} | Mod: ${from}`;
    server.unban(args[1], reason).then(() => {
 
        return ctx.reply(`ID ${args[1]} разблокирован *id${from} (модератором). По причине: ${args.slice(2).join(" ")}`);

    }).catch(() => {

        return ctx.reply(`Я не смог разблокировать ID ${args[1]}, вероятно у меня нет прав или не заблокирован`);

    })

})



vkint.command('/auth', async (ctx) => {
    
    let from = ctx.message.from_id;
    if(ctx.message.peer_id != 2000000003 || ctx.message.peer_id != 2000000004 || ctx.message.peer_id != 398115725) ctx.reply("Ошибка: доступно только в беседе модераторов"); 
    if(authed.has(from)) return ctx.reply("Ошибка: вы уже авторизированы в системе контроля");
    let text = ctx.message.text;
    let server = bot.guilds.get(serverid);
    if (!server) return ctx.reply("Ошибка: Бот не находится на сервере");
    const args = text.slice(`/auth`).split(/ +/);
    if(!args[1]) return ctx.reply("Ошибка: использование: /auth [ID discord]");
    let member = server.members.get(args[1]);
    if(!member) return ctx.reply("Ошибка: аккаунт не найден");
    if(member.roles.some(r => ["Spectator™", "Support Team", "Discord Master"].includes(r.name))){
        let channel = server.channels.find(c => c.name == "spectator-chat");
        let code = getRandomInt(1000, 9999);
        let lvlmod = returnlvl(member);
        let lvltext = lvltotext(lvlmod);
        ctx.reply(`[Процесс верификации прав модератора]\nВнимание! Вы начали процесс подтверждения ваших прав, введите код который будет указан ниже в канале дискорда #${channel.name}\nНовым сообщением в канале, иначе код будет неверным\n\nКод подтверждения для *id${from} (${member.displayName}) - ${code}`);
        let question = await channel.send(`<@${member.id}>, введите код из сообщения ВК для подтверждения аккаунта`);
        channel.awaitMessages(response => response.member.id == member.id, {
            max: 1,
            time: 120000,
            errors: ['time'],
        }).then(async (answer) => {
            question.delete().catch(() => {});
            if(answer.first().content != code) {
                return ctx.reply(`Аккаунт *id${from} (${member.displayName}) подтвердить не удалось. Причина: ввёл неверный код`);
            }
            else {
                authed.add(from);
                answer.first().delete().catch(() => {});
                spmod.add(from);
                if(lvlmod >= 2) stmod.add(from);
                if(lvlmod == 3) dm_mod.add(from);
                return ctx.reply(`Аккаунт *id${from} (${member.displayName}) авторизовался как ${lvltext}`)
            }

        }).catch(async () => {
            question.delete().catch(() => {});
            return ctx.reply(`Аккаунт *id${from} (${member.displayName}) подтвердить не удалось. Причина: истёк срок кода`);
        })
    
    }
    else return ctx.reply("Ошибка: этот пользователь не модератор");
});

vkint.command('/giverole', (ctx) => {
    
    let from = ctx.message.from_id;
    if(ctx.message.peer_id != 2000000003 || ctx.message.peer_id != 2000000004 || ctx.message.peer_id != 398115725) ctx.reply("Ошибка: доступно только в беседе модераторов"); 
    if(!authed.has(from)) return ctx.reply("Ошибка: /auth [ваш дискорд ид] для авторизации в боте");
    if(!dm_mod.has(from)) return ctx.reply("Ошибка: команда временно недоступна для Support Team и ниже");
    let text = ctx.message.text;
    const args = text.slice(`/giverole`).split(/ +/);
    if(!args[1] || !args[2]) return ctx.reply("Ошибка: использование: /giverole [ID участника] [Название роли]");
    let server = bot.guilds.get(serverid);
    if (!server) return ctx.reply("Ошибка: Бот не находится на сервере");
    let member = server.members.get(args[1]);
    if (!member) return ctx.reply("Ошибка: Указанный пользователь не находится на сервере");
    let role = server.roles.find(r => r.name == args.slice(2).join(" "));
    if (!role){
        role = server.roles.find(r => r.name.includes(args.slice(2).join(" ")));
        if (!role) return ctx.reply(`Ошибка: Роли ${args.slice(2).join(" ")} нет на сервере`);
    }
    member.addRole(role).then(() => {
        return ctx.reply(`Роль ${role.name} выдана успешна пользователю ${member.displayName} c ID ${args[1]}`);
    }).catch(() => {
        return ctx.reply(`Роль ${role.name} не может быть выдана в свзязи с отсуствием прав доступа!`);
    })

});

vkint.command('/removerole', (ctx) => {
    
    let from = ctx.message.from_id;
    if(ctx.message.peer_id != 2000000003 || ctx.message.peer_id != 2000000004 || ctx.message.peer_id != 398115725) ctx.reply("Ошибка: доступно только в беседе модераторов"); 
    if(!authed.has(from)) return ctx.reply("Ошибка: /auth [ваш дискорд ид] для авторизации в боте");
    if(!dm_mod.has(from)) return ctx.reply("Ошибка: команда временно недоступна для Support Team и ниже");
    let text = ctx.message.text;
    const args = text.slice(`/removerole`).split(/ +/);
    if(!args[1] || !args[2]) return ctx.reply("Ошибка: использование: /removerole [ID участника] [Название роли]");
    let server = bot.guilds.get(serverid);
    if (!server) return ctx.reply("Ошибка: Бот не находится на сервере");
    let member = server.members.get(args[1]);
    if (!member) return ctx.reply("Ошибка: Указанный пользователь не находится на сервере");
    let role = server.roles.find(r => r.name == args.slice(2).join(" "));
    if (!role){
        role = server.roles.find(r => r.name.includes(args.slice(2).join(" ")));
        if (!role) return ctx.reply(`Ошибка: Роли ${args.slice(2).join(" ")} нет на сервере`);
    }
    member.removeRole(role).then(() => {
        return ctx.reply(`Роль ${role.name} успешно снята с пользователя ${member.displayName} c ID ${args[1]}`);
    }).catch(() => {
        return ctx.reply(`Роль ${role.name} не может быть снята в свзязи с отсуствием прав доступа!`);
    })

});

vkint.command('/info_ac', (ctx) => {

let from = ctx.message.from_id;
let info_auth;
let info_sp = "Нету";
let info_st = "Нету";
let info_adm = "Нету";

if(authed.has(from)) {
    info_auth = "авторизованы";
    if(spmod.has(from)) info_sp = "Есть";
    if(stmod.has(from)) info_st = "Есть";
    if(dm_mod.has(from)) info_adm = "Есть";
} else {
    info_auth = "не авторизованы";
    info_sp = "Нет информации";
    info_st = "Нет информации";
    info_adm = "Нет информации";
}

ctx.reply(`[Информация о авторизации]\n\nВы ${info_auth}\nЕсть ли у вас доступ к командам уровня Spectator - ${info_sp}\nЕсть ли у вас доступ к командам уровня Support Team - ${info_st}\nЕсть ли у вас доступ к командам уровня Discord Master - ${info_adm}`);

});

vkint.command('/unauth', (ctx) => {

    let from = ctx.message.from_id;
    if(ctx.message.peer_id != 2000000003 || ctx.message.peer_id != 2000000004 || ctx.message.peer_id != 398115725) ctx.reply("Ошибка: доступно только в беседе модераторов"); 
    if(!authed.has(from)) return ctx.reply("Ошибка: вы не были авторизованы");
    if(spmod.has(from)) spmod.delete(from);
    if(stmod.has(from)) stmod.delete(from);
    if(dm_mod.has(from)) dm_mod.delete(from);
    authed.delete(from);
    ctx.reply("Вы успешно вышли из системы!");

});



vkint.on((ctx) => {
    console.log(ctx);
    if(ctx.message.action.type == "chat_kick_user") {
        let server = bot.guilds.find(g => g.id == serverid);
        let channel = server.channels.find(c => c.name == "all");
        channel.send(`Пользователь с ID - ${ctx.message.action.member_id} был кикнут из беседы`);
    }
  })
  
 */
  vkint.startPolling(() => {
    console.log('ВК интеграция успешно запущена!')
  })


bot.login(process.env.token);
bot.on('ready', () => {
    console.log("Бот был успешно запущен!");
    bot.user.setPresence({ game: { name: 'защиту Discord' }, status: 'idle' })
});

bot.on('message', async message => {
    if (message.channel.type == "dm") return // Если в ЛС, то выход.
    if (message.guild.id != serverid && message.guild.id != "493459379878625320") return
    //if (message.type === "PINS_ADD") if (message.channel.name == "requests-for-roles") message.delete();
    if (message.content == "/ping") return message.reply("`я онлайн!`") && console.log(`Бот ответил ${message.member.displayName}, что я онлайн.`)
    if (message.member.id == bot.user.id) return
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
