const { Command } = require('aghanim')
const basic = require('../helpers/basic')
const util = require('erisjs-utils')
const lang = require('../lang.json')

module.exports = new Command('events',{
  subcommandFrom : "admin",
  category : 'Admin', help : 'Overview de los eventos', args : '', check : basic.guildFEDAdmin},
  function(msg, args, command){
    this.logger.overview(msg)
  })
