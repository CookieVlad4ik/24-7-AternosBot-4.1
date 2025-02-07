const mineflayer = require('mineflayer');
const fs = require('fs');
const util = require('util');
const waitUntil = require('wait-until');

let rawdata = fs.readFileSync('config.json');
let data = JSON.parse(rawdata);
const language = data["language"];
let rawlang = fs.readFileSync('./lang/'+ language +'.json');
let lang = JSON.parse(rawlang);
const readFile = (fileName) => util.promisify(fs.readFile)(fileName, 'utf8')

const host = data["ip"];
const port = data["port"];
const version = data["version"];
const password = data["password"];
const interval = data["interval"];

const consolebotlistlogin1 = lang["consolebotlistlogin1"];
const consolebotlistlogin2 = lang["consolebotlistlogin2"];
const spawnmessage = lang["spawnmessage"];
const deathmessage = lang["deathmessage"];
const botkickmessage = lang["botkickmessage"];
const commandposmessage = lang["commandposmessage"];
const commandstopmessage = lang["commandstopmessage"];
const commandstartmessage = lang["commandstartmessage"];
const consoledeathmessage = lang["consoledeathmessage"];
const consolespawnmessage = lang["consolespawnmessage"];
const consoleauthmessage = lang["consoleauthmessage"];
const consoleloginmessage = lang["consoleloginmessage"];
const consolestartmessage = lang["consolestartmessage"];
const consolebotendreconnect = lang["consolebotendreconnect"];
const consolebotendreconnecterror = lang["consolebotendreconnecterror"];
const consolebotendreconnecterrorattempt = lang["consolebotendreconnecterrorattempt"];
const consolebot = lang["consolebot"];

console.log('Thank you for using the bot from JodexIndustries');
console.log('Aternos Bot 24/7 4.1');
console.log('\x1b[32m');
console.log(consolestartmessage,'\x1b[0m');

function makeBot ([_u, _p], ix) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const bot = mineflayer.createBot({
      username: _u,
      password: _p,
      host: host,
      port: port,
      version: version
    });
    bot.on('spawn', () => resolve(bot));
    bot.on('error', (err) => reject(err));
    bot.on('login', function() {
      console.log('\x1b[35m');
      console.log(consolebot + ' ' + _u + ' ' + consoleloginmessage,'\x1b[0m');
      bot.chat('/register ' + password + ' ' + password);
      bot.chat('/login ' + password);
      console.log('\x1b[33m');
      console.log(consolebot + ' ' + _u + ' ' +  consoleauthmessage,'\x1b[0m');
    });
    bot.on('chat', (username, message) => {
      if (username === bot.username) return
      target = bot.players[username].entity
      let entity
      switch (message) {
        case ';start':
          bot.setControlState('forward', true);
          bot.setControlState('jump', true);
          bot.setControlState('sprint', true);
          bot.chat(commandstartmessage);
          break
        case ';stop':
          bot.clearControlStates();
          bot.chat(commandstopmessage);
          break
        case ';pos':
          sayPosition(username);
          break
          }

          function sayPosition (username) {
            bot.chat(commandposmessage + ` ${bot.entity.position}`);
          }
          console.log(`[Chat] <${username}> ${message}`);
        });
        bot.on('spawn', function() {
          bot.chat(spawnmessage);
          console.log('\x1b[36m');
          console.log(consolebot + ' ' + _u + ' ' +  consolespawnmessage,'\x1b[0m');
          bot.setControlState('forward', true);
          bot.setControlState('jump', true);
          bot.setControlState('sprint', true);
        });
        bot.on('end', function(reason) {
          waitUntil(10000, 9999, function condition() {
            try {
              console.log(consolebot + ' ' + _u + ' ' +  consolebotendreconnect);
                  makeBot ([_u, _p], ix);
                  return true;
             } catch (error) {
                  console.log(consolebot + ' ' + _u + ' ' +  consolebotendreconnecterror + " " + error);
                  return false;
              }
          }, function done(result) {
              console.log(consolebot + ' ' + _u + ' ' +  consolebotendreconnecterrorattempt + result);
          });
     });
        bot.on('death', function() {
          bot.chat(deathmessage);
          console.log('\x1b[31m');
          console.log(consolebot + ' ' + _u + ' ' +  consoledeathmessage,'\x1b[0m');
        });
        bot.on('kicked', function(reason) {
          console.log('\x1b[31m');
          console.log(consolebot + ' ' + _u + ' ' +  botkickmessage + " ", reason, " ");
        });
        setTimeout(() => reject(Error('Took too long to spawn.')), 5000) // 5 сек
      }, interval * ix)
    })
}

async function main () {
  const file = await readFile("./accounts.txt")
  const accounts = file.split(/\r?\n/).map(login => login.split(':'))
  const botProms = accounts.map(makeBot)
  const bots = (await Promise.allSettled(botProms)).map(({ value, reason }) => value || reason).filter(value => !(value instanceof Error))
  console.log(consolebotlistlogin1 +  ` (${bots.length} / ${accounts.length}) ` + consolebotlistlogin2)
}

main()
