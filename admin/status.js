const { Command } = require('aghanim')
const basic = require('../helpers/basic')
const util = require('erisjs-utils')
const lang = require('../lang.json')

module.exports = new Command('status',{
  subcommandFrom : "admin",
  category : 'Admin', help : 'Coloca el estado del bot', args : '', require : basic.guildFEDAdmin},
  function(msg, args, command){
    let self = this
    if(['online','idle','dnd','invisible'].indexOf(args[2]) > -1){
      //bot.editStatus(command[2],{name : '', type : 0});
      this.editStatus(args[2],{})
      msg.addReaction(this.config.emojis.default.accept)
    }
  })
