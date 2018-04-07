const { Watcher } = require('aghanim')
const util = require('erisjs-utils')
const lang  = require('../lang.json')

module.exports = new Watcher('','guildMemberAdd',{}, function(msg,args,command){
  // const self = this
  if(guild.id !== this.config.guild.id){return};
  this.logger.add('memberin',`**${member.username}**`,true);
  if(this.config.switches.welcome){
    //console.log('Mention Admin', mentionAdmin,mentionAdmin.name);
    this.createMessage(guild.id,this.replace.do(this.config.newMember.msgnoadminmention,{member : member.mention,rules : '<#' + this.config.guild.text.normas + '>'},true))
    // const mentionAdmin = util.guild.getRole(guild,settings.roles.admin);
    // if(mentionAdmin){
    //   bot.createMessage(guild.id,replace.do(settings.newMember.msg,{member : member.mention, admin : '<@&' + mentionAdmin[0].id + '>',rules : '<#' + settings.guild.text.normas + '>'},true))
    // }
  }
  if(this.config.switches.giveRoleNewMember){
    var roles = util.guild.getRole(guild,this.config.roles.federado);
    if(roles){
      member.addRole(roles[0].id,lang.reasonWelcomeToServer);
    }
  }
  basic.profileCheck(member.id,this);
})
