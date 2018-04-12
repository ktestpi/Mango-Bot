const { Watcher } = require('aghanim')
// const util = require('erisjs-utils')

module.exports = new Watcher('','guildMemberRemove',{}, function(guild,member){
  // const self = this
  if(guild.id !== this.config.guild.id){return};
  this.logger.add('memberout',`**${member.username}**`,true);
})
