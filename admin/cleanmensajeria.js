const { Command } = require('aghanim')
// const basic = require('../helpers/basic')
const util = require('erisjs-utils')
const lang = require('../lang.json')
const basic = require('../helpers/basic')

module.exports = new Command('cleanmensajeria',{
  category : 'Admin', help : 'Elimina a todos los usuarios con el rol de **Mensajería**', args : '', check : basic.guildFEDAdmin},
  function(msg, args, command){
    let self = this
    const guild = this.fed;
    const [mensajeriaRole] = util.guild.getRole(guild,this.config.roles.mensajeria);
    if(!mensajeriaRole){return};
    const members = guild.members.filter(member => member.roles.includes(mensajeriaRole.id));
    if(!members){return};
    let counter = 0;
    members.forEach(member => {
      member.removeRole(mensajeriaRole.id, lang.reasonRemoveMensajeriaRoleMembers).then(() => {
        counter++
        if(members.length === counter){
          msg.addReaction(this.config.emojis.default.accept)
        }
      })
    })
  })
