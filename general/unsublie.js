const { Command } = require('aghanim')
const basic = require('../helpers/basic')
const util = require('erisjs-utils')
const lang = require('../lang.json')

module.exports = new Command('unsublie',{
  category : 'Perfil', help : 'Calendario', args : ''},
  function(msg, args, command){
    let self = this
    const member = basic.getMemberByID(msg.author.id,this.config,this);
    if(!util.member.hasRole(member,this.config.roles.lie)){msg.reply(lang.errorLIENoSuscribed);return}
    let role = util.guild.getRole(this.guilds.find(g => g.id === this.config.guild.id),this.config.roles.lie);
    if(role){
      for(var i = 0; i < role.length; i++) {
        member.removeRole(role[i].id,lang.reasonLIEUnSub);
      }
      msg.addReaction(this.config.emojis.default.accept);
    }
  })
