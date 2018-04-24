const { Command } = require('aghanim')
const basic = require('../helpers/basic')
const util = require('erisjs-utils')
const lang = require('../lang.json')

module.exports = new Command('tm',{
  subcommandFrom : "bot",
  category : 'Owner', help : 'Enlace al TM', args : '', check : basic.isOwner},
  function(msg, args, command){
    msg.reply(this.config.links.tm)
  })
