const { Command } = require('aghanim')
const basic = require('../helpers/basic')
const util = require('erisjs-utils')
const lang = require('../lang.json')

module.exports = new Command('profile',{
  category : 'Perfil', help : 'Perfil', args : ''},
  function(msg, args, command){
    let self = this
    // if(command[1] === settings.cmds.profile.s.dota.cmd){
    //   let parsed = parseProfile(command[2],'dota');
    //   if(!parsed){msg.reply(lang.errorUpdateProfile);return}
    //   settings.db.child('profiles/'+id).update({dotaID : parsed}).then(() => msg.addReaction(settings.emojis.default.accept))
    //   return}
    // else if(command[1] === settings.cmds.profile.s.steam.cmd){
    //   let parsed = parseProfile(command[2],'steam');
    //   if(!parsed){msg.reply(lang.errorUpdateProfile);return}
    //   settings.db.child('profiles/'+id).update({steamID : parsed}).then(() => msg.addReaction(settings.emojis.default.accept))
    //   return}
    let id = msg.author.id
    if(msg.mentions.length > 0){id = msg.mentions[0].id};
    var member = basic.getMemberByID(id,this);
    this.db.child('profiles/'+id).once('value').then((snap) => {
      if(!snap.exists()){msg.reply(this.replace.do('userNotRegistered',{username : member.username, cmd : this.defaultPrefix + command.name + ' update'},true));return};
      snap = snap.val();
      msg.reply({embed:{
        author: {name : snap.username, icon_url : snap.avatar},
        fields : [{name : lang.TheOracle , value : `${this.config.emojis.bot.oracle} ${snap.oracle}`, inline : true},
          {name: lang.ID, value : `${snap.dotaID !== '0' ? 'Dota 2: ' + basic.urlIDToLink(snap.dotaID,'dota'): ':x:'}\n${snap.steamID !== "0" ? 'Steam: ' + basic.urlIDToLink(snap.steamID,'steam') : ':x:'}`, inline : true}],
          color : this.config.color
        //footer : {text : member.username, icon_url : member.avatarURL}
      }})
    })
  })
