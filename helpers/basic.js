const util = require('erisjs-utils')
const config = require('../config')

module.exports.ADMINROLE = config.roles.admin

module.exports.guildFEDCommand = function(msg,args,command){
  return msg.channel.guild && msg.channel.guild.id === this.config.guild.id
}


module.exports.guildFEDAdmin = function(msg,args,command){
  const guild = this.guilds.get(this.config.guild.id)
  const member = guild.members.get(msg.author.id)
  return member && util.member.hasRole(member,this.config.roles.admin)
}

module.exports.isOwner = function(msg,args,command){
  return msg.author.id === this.owner.id
}

module.exports.isMember = function(msg,args,command){
  return this.fed.members.get(msg.author.id)
}

module.exports.FEDGuild = function(msg,args,command){
  return bot.guilds.get(bot.config.guild.id)
}

module.exports.authorIsAdmin = function(msg,settings){
    return util.roleByName(msg.channel.guild.members.get(msg.author.id),settings.roles.admin)
}

module.exports.createVote = function(msg,args,command,oracle){
  let match = msg.content.match(/"[^"]+"/g);
  if(!match || match.length < 2){msg.reply(lang.errorVoteCmdStart);return};
  let question = match[0].slice(1,-1);
  let options = match[1].slice(1,-1).split(",");
  if(options > 9){msg.reply(this.replace.do('errorVoteCmdMaxOptions',{number : this.config.vote.maxoptions},true))}
  var text = (oracle ? this.config.emojis.bot.oracle + " " : "") + `${question}\n\n`;
  for (var i = 0; i < options.length; i++) {
    text += `${this.config.vote.optionsText[i]} ${options[i]}\n`
  }
  // msg.replyFn(text,function(m){m.addReaction(settings.emojis.default.accept);m.addReaction(settings.emojis.default.error);})
  msg.reply({content: text, disableEveryone : false}).then(m => {
    for (var i = 0; i < options.length; i++) {
      m.addReaction(this.config.vote.emojis.options[i]);
    }
      m.addReaction(this.config.vote.emojis.start).then(() => {
        if(oracle){m.addReaction(this.config.emojis.bot.oracle.slice(1,-1))}
      });
  })
  msg.delete();
}

module.exports.sortOracleRanking = function(a,b){
  let points = b.oracle - a.oracle;
  if(points !== 0){return points}
  else{
      if(a.username.toLowerCase() < b.username.toLowerCase()){return -1}else{return 1}
  }
}

module.exports.getMemberByID = function(id,bot){
  return bot.guilds.find(g => g.id === bot.config.guild.id).members.get(id);
}

module.exports.urlIDToLink = function(id,mode){
  let text = '',url = '';
  if(mode === 'dota'){
    url = 'https://www.dotabuff.com/players/' + id
  }else if(mode === 'steam'){
    url = (steamURLPI(id) ? 'http://steamcommunity.com/id/' : 'http://steamcommunity.com/profiles/') + id
  }
  text = `[${id}](${url})`
  return text
}

function steamURLPI(value){
  return value.match(new RegExp('[^0-9]')) ? true : false; //true = id, false = profiles
}

module.exports.parseProfile = function (url,mode){
  if(!url){return false}
  let data = url;
  if(mode === 'dota'){
    if(url.startsWith('https://www.dotabuff.com/players/')){
      data = url.match(new RegExp('https://www.dotabuff.com/players/(\\w*)'))[1]
    }else if(url.startsWith('https://es.dotabuff.com/players/')){
      data = url.match(new RegExp('https://es.dotabuff.com/players/(\\w*)'))[1]
    }
  }else if(mode === 'steam'){
    if(url.startsWith('http://steamcommunity.com/id/')){
      data = url.match(new RegExp('http://steamcommunity.com/id/(\\w*)'))[1]
    }else if(url.startsWith('http://steamcommunity.com/profiles/')){
      data = url.match(new RegExp('http://steamcommunity.com/profiles/(\\w*)'))[1]
    }
  }
  let check = data.match(new RegExp('(\\d*)'))[1];
  if(check.length != data.length){data = false};
  return data
}

module.exports.wrongCmd = function(msg,list,prefix){
  const options = Object.keys(list).sort()
  msg.author.getDMChannel().then(channel => channel.createMessage(`:x: **Opciones disponibles** para \`${prefix}\`\n\n|${options.filter(o => o).map(o => `\`${o}\``).join(', ')}|`))
}

module.exports.profileCheck = function(profile,bot){
  let member = bot.fed.members.get(profile);
  //console.log(member);
  if(!member){return};
  // console.log(member.id,member.username);
  bot.db.child('profiles/'+profile).once('value').then((snap) => {
    if(!snap.exists()){
      let update = {};
      update[profile] = module.exports.profileReset(member);
      bot.db.child('profiles').update(update);
    }else{
      snap = snap.val();
      var reset = module.exports.profileResetBase();
      // console.log(snap);
      // console.log(reset);
      for (var k in reset) {
        // console.log(k);
        if(snap[k] === undefined || ['username','avatar'].indexOf(k) !== -1){snap[k] = module.exports.profileReset(member)[k]}
      }
      let update = {};
      update = snap;
      bot.db.child('profiles/'+profile).update(update);
    }
  })
}

module.exports.updateProfiles = function(bot,dbloaded){
  let members = bot.fed.members;
  let profiles = Object.keys(dbloaded).map(p => {let profile = dbloaded[p];profile.discord_id = p;return profile})
  // console.log(profiles);
  // profiles.forEach(profile => settings.db.child('profiles/'+profile.discord_id).update({lie: {games : 0, wins : 0, mmr : 0}}))
  profiles.forEach(profile => {
    let player = members.find(m => m.id === profile.discord_id);
    if(player){
      // settings.db.child('profiles/'+profile.discord_id).update({avatar : player.avatarURL, username : player.nick ? player.nick : player.username})
      module.exports.profileCheck(player.id,bot)
    }
  })
}

module.exports.profileReset = function(member){
  return {username : member.nick ? member.nick : member.username, avatar : member.avatarURL, lie : {games : 0, wins : 0}, mangobets : 0, dotaID : "0", steamID : "0", oracle : 0, remember : {}}
}

module.exports.profileResetBase = function(){
  return {username : "", avatar : "", lie : "", mangobets : "", dotaID : "", steamID : "", oracle : "", remember : ""}
}

module.exports.playerNameLinkDBS = function(player){
  return `**${player.name}** ${util.md.link(util.dota.idToUrl(player._id,'dotabuff'),'DB')} ${util.steam.idToLink(player.steam,true,'S')}`
}

module.exports.teamManagerLink = function(bot,link){
  return link ? `[${link}](${bot.config.links.tm})` : bot.config.links.tm
}
