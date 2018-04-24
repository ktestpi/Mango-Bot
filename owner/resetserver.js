const { Command } = require('aghanim')
const basic = require('../helpers/basic')
const util = require('erisjs-utils')
const lang = require('../lang.json')

module.exports = new Command('resetserver',{
  subcommandFrom : 'bot',
  category : 'Owner', help : 'Reinicia los perfiles de los miembros del servidor', args : '', check : basic.isOwner},
  function(msg, args, command){
    let members = this.fed.members.filter(member => !member.bot).map(member => {return {username : member.username, avatar : member.avatarURL, id : member.id}})
    let update = {};
    for (var i = 0; i < members.length; i++) {
      update[members[i].id] = basic.profileReset(members[i]);
    }
    settings.db.update({profiles : update});
    msg.addReaction(this.config.emojis.default.accept);
  })
