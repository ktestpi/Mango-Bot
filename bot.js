const Aghanim = require('aghanim')
const path = require('path')
const util = require('erisjs-utils')
const lang = require('./lang.json')
const firebase = require('firebase-admin');
const basic = require('./helpers/basic')
// const FirebaseCache = require('./helpers/cache.js')
const package = require('./package.json')

let TOKEN;
const firebaseConfig = {
  "type": "service_account",
  // "private_key": process.env.PRIVATE_KEY.replace(/\\n/g, '\n'),
  // "client_email": process.env.CLIENT_EMAIL,
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://accounts.google.com/o/oauth2/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
};
let ENVPROD = false;
let CONFIG = require('./config.json')

try{
  TOKEN = process.env.BOT_TOKEN;
  firebaseConfig.private_key = process.env.PRIVATE_KEY.replace(/\\n/g, '\n');
  firebaseConfig.client_email = process.env.CLIENT_EMAIL;
  ENVPROD = true
}catch(err){
  const env = require('./env.json');
  TOKEN = env.BOT_TOKEN;
  firebaseConfig.private_key = env.PRIVATE_KEY.replace(/\\n/g, '\n');
  firebaseConfig.client_email = env.CLIENT_EMAIL
  CONFIG.guild = {
    id : "332023803691532289",
    "text" : {"reclutamiento" : "332024705177354240", "anuncios" : "332024661959376898", "normas" : "332266182302367744", mensajeria : "332023803691532289", "lieupload" : "396080354865184778", "hoster_chat" : "332023803691532289", "lie_announce" : "400646047493521408"},
    "voice" : {"lieSala1" : "332023803691532290","lieSala2" : "333240206209843201", "lieWaitRoom" : "392346574056849409", "taberna" : "333218349167149058"}
  };
  CONFIG.ready.channel = "332023803691532289";
  CONFIG.bot.id = "332083791759933443";
}

CONFIG.color = util.color.convert(CONFIG.color,'hex-int');
for(cat in CONFIG.colors){
  if(typeof CONFIG.colors[cat] == 'string'){CONFIG.colors[cat] = util.color.convert(CONFIG.colors[cat],'hex-int');continue}
  for(c in CONFIG.colors[cat]){
    CONFIG.colors[cat][c] = util.color.convert(CONFIG.colors[cat][c],'hex-int');
  }
}

firebase.initializeApp({
  credential: firebase.credential.cert(firebaseConfig),
  databaseURL: "https://mango-bot.firebaseio.com"
});

const bot = new Aghanim(Object.assign({token : TOKEN},CONFIG.setup))
bot.config = CONFIG
bot.config.colors.palette = {default : CONFIG.color}
bot.envprod = ENVPROD
bot.cache = {}
// bot.helpers = require('./helpers/account.js')
// bot.helpers = {}
// for (var h in bot.helpers) {
//   bot.helpers[h] = bot.helpers[h].bind(bot)
// }
bot.defineCategories([{name : 'General', help : 'Ayuda de general'},
{name : 'Perfil', help : 'Ayuda de comandos de perfil de miembro de la FED'},
{name : 'Admin', help : 'Ayuda para comandos de Admin'},
{name : 'Owner', help : 'Ayuda para comandos de propietario'}
])

bot.addCommandDir(path.join(__dirname,'general'))
bot.addCommandDir(path.join(__dirname,'admin'))
bot.addCommandDir(path.join(__dirname,'owner'))
// bot.addCommandDir(path.join(__dirname,'general'))
// bot.addCommandDir(path.join(__dirname,'fun'))
// bot.addCommandDir(path.join(__dirname,'bot'))
// bot.addCommandDir(path.join(__dirname,'dota2'))

bot.addWatcherDir(path.join(__dirname,'watchers'))
// bot.addCommandDir(path.join(__dirname, 'subcommands'))


bot.on('postready',() => {
  bot.beam = {}
  bot.fed = function(){return bot.guilds.get(bot.config.guild.id)}
  Object.defineProperty(bot, "fed", {
    get: function(message){return this.guilds.get(this.config.guild.id)}
  })
  bot.config.emojis.bot = util.guild.loadEmojis(bot.guilds.get(bot.config.guildBot.id));
  bot.config.emojis.fed = util.guild.loadEmojis(bot.guilds.get(bot.config.guild.id));
  // console.log(bot.owner);
  bot.replace = new util.string.ReplaceWithDictionaryAndLang([{
    bot_name : bot.user.username,
    bot_icon : bot.user.avatarURL,
    author_name : bot.owner.username,
    author_id : bot.owner.id,
    // role_admin : config.roles.admin,
    // role_pin : config.roles.pin,
    // role_aegis : config.roles.aegis,
    // channel_bugs : "<#" + config.guild.bugs + ">",
    // channel_biblioteca : "<#" + config.guild.biblioteca + ">",
    // channel_foso : "<#" + config.guild.id + ">",
    // server : bot.config.server,
    version : package.version,
    // update : bot.config.update
  }],true,lang);
  bot.replace.addDict(bot.config.emojis.fed,true,'emoji');
  bot.replace.addDict(bot.config.emojis.bot,true,'emoji_bot');
  bot.replace.addDict(bot.config.links,true,'links');

  bot.logger = new util.helper.Logger(
    bot.guilds.get(bot.config.guildBot.id).channels.get(bot.config.guildBot.logger),
    Object.assign({},{name : 'Mango', title : 'Notificaciones', color : bot.config.color},{events : CONFIG.logger}), 10);
  // bot.logger.log('memberin','Hi')
  // bot.logger.log('oderror','Bye')
  // bot.logger.log('oderror','Bye')
  // bot.logger.log('memberin','Hi')
  bot.db.child('bot').once('value').then(snap => {
    if(!snap.exists()){return}else{snap = snap.val()}
    bot.config.switches = snap.switches
    if(!bot.envprod){
      bot.config.switches.backupdb = false;
    }
    // console.log('ENV',bot.envprod,process.argv[2]);
    if(!bot.envprod && process.argv[2] === '--db'){
      bot.config.switches.backupdb = true;
      console.log('DEV - DB active');
    }
    bot.config.playing = snap.playing;
    bot.emit('afterload')
  }).catch(err => {console.log('FAIL to load bot',err);bot.emit('afterload')})
  // console.log(bot.replace);
})

bot.on('afterload', function(){
  bot.editStatus("online", {name : bot.config.playing, type : 0});
  // console.log('CONFIG',bot.config);
  // console.log(bot.config.switches);
  // bot.config.switches.backupdb = true
  if(bot.config.switches.backupdb){ //config.switches.backupdb
    util.firebase.backupDBfile(bot.db,bot,bot.config.ready.backupDB,{filenameprefix : 'mango_db_', messageprefix : '**Mango Backup DB**'}).then(snap => {
      // console.log('DB',bot.db);
      basic.updateProfiles(bot,snap.profiles)
      // bot.cache.servers = new FirebaseCache(bot.db.child('servers'),snap.servers);
      // bot.cache.profiles = new FirebaseCache(bot.db.child('profiles'),Object.keys(snap.profiles).map(profile => [profile,snap.profiles[profile].profile]),'profile');

      // console.log('CACHE DONE');
      // bot.cache.servers.modify('327603106257043456',{feeds : {enable : false}}).then((el) => console.log('MODIFIED',el))
      // console.log('leaderboard',bot.config.switches.leaderboardUpdate);
      // return;

      // bot.cache.profiles.modify('189996884322942976',{test : 'test'})
      console.log('CACHE LOADED');
    })
  }
})
// console.log(bot.commands);

// var profiles = firebase.database().ref('profiles');
bot.firebase = firebase;
bot.db = firebase.database().ref();

// bot.db.child('profiles').once('value').then(snap => {
//   if(!snap.exists()){return}
//   snap = snap.val()
//   // console.log(snap);
//   let profiles = Object.keys(snap).map(profile => Object.assign({},snap[profile],{_id : profile}))
//   profiles.forEach(profile => {
//     bot.db.child(`profiles/${profile._id}/profile`).update({dota : profile.profile.dotabuff})
//   })
// })


bot.connect();
