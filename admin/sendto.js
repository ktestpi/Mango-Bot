const { Command } = require('aghanim')
const basic = require('../helpers/basic')
const util = require('erisjs-utils')
const lang = require('../lang.json')

module.exports = new Command('sendto',{
  category : 'Admin', help : 'Envía un mensaje a los miembros con un rol', args : '<mención rol/es> "mensaje"', require : basic.guildFEDAdmin},
  function(msg, args, command){
    let self = this
    let content = msg.content.match(/"[^"]+"/g);
    if(!content){return};
    msg.content = msg.content.replace(content[0],"");
    let rolesFind = msg.content.match(/<@&[\d^>]+>/g);
    if(!rolesFind){return};
    rolesFind = rolesFind.map(role => role.slice(3,-1));
    content = content[0].slice(1,-1);
    // console.log(rolesFind);
    // console.log(content);
    const guild = this.fed
    let members = [];
    rolesFind.forEach(role => {
      // console.log('Rol',role);
      let memberWithRole = guild.members.find(member => member.roles.includes(role));
      // console.log(memberWithRole);
      if(!memberWithRole){return};
      if(!members.includes(memberWithRole.id)){members.push(memberWithRole.id)};
    })
    // console.log('Members',members);
    let messagesSent = 0;
    const messageToSend = {
      embed : {
        title : this.replace.do(lang.MangoCourier),
        description : content,
        footer : {text : lang.MangoCourierAutomaticMessage, icon_url : this.config.bot.icon},
        color : this.config.color}}
    members.forEach(member => {
      guild.members.get(member).user.getDMChannel().then(channel => channel.createMessage(messageToSend))
      messagesSent++
      if(members.length === messagesSent){
        msg.addReaction(this.config.emojis.default.envelopeIncoming);
        msg.reply(this.replace.do('MangoCourierMessagesSent',{messages : messagesSent},true));
        msg.reply(messageToSend);
      }
    })
  })
