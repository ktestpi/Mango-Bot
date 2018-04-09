const { Command } = require('aghanim')
// const basic = require('../helpers/basic')
const util = require('erisjs-utils')
const lang = require('../lang.json')
const basic = require('../helpers/basic')

module.exports = new Command('leyend',{
  subcommandFrom : "oracle",
  category : 'Admin', help : 'Ve la leyenda del comando', args : '', rolesCanUse : basic.adminRole, require : basic.guildFEDCommand},
  function(msg, args, command){
    let self = this
    msg.author.getDMChannel().then(channel => {
      channel.createMessage(this.replace.do('TheOracleLeyendDescription',{
        _emoji_start : this.config.vote.emojis.start,
        _emoji_close : this.config.vote.emojis.close,
        _emoji_finish : this.config.vote.emojis.finish,
        _emoji_winner : this.config.vote.emojis.winner.join(','),
        _emoji_options : this.config.vote.emojis.options.join(',')},true))
    })
  })
