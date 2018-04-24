const { Watcher } = require('aghanim')
const util = require('erisjs-utils')

module.exports = new Watcher('','messageCreate',{}, function(msg,args,command){
  if(msg.channel.id !== this.config.guild.text.reclutamiento){return}
  const self = this
  util.fn.messageFollowTemplate(msg,this.config.reclutamiento.template,function(){
    self.logger.add('errorrecluta',`**${msg.author.username}** está en reclutamiento`,true)
    msg.delete()
    msg.author.getDMChannel().then(
      channel => channel.createMessage(self.replace.do(self.config.reclutamiento.msgError)).then(n => {
        setTimeout(function(){n.delete()},self.config.reclutamiento.waitTimeError*1000)
      })
    ).catch(err => {
      msg.reply(self.replace.do(self.config.reclutamiento.msgError)).then(n =>{
        setTimeout(function(){n.delete()},self.config.reclutamiento.waitTimeError*1000)}
      )})
    })
    // msg.reply(self.replace.do(self.config.reclutamiento.msgError)).then(n =>{
    //   setTimeout(function(){n.delete()},self.config.reclutamiento.waitTimeError*1000)}
    // )}
})
