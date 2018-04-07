const { Command } = require('aghanim')
const basic = require('../helpers/basic')
const util = require('erisjs-utils')
const lang = require('../lang.json')

module.exports = new Command('profileupdate',{
  subcommandFrom : "admin",
  category : 'Admin', help : 'Invitación de Twitter', args : '', require : basic.guildFEDAdmin},
  function(msg, args, command){
    let self = this
    if(!isNaN(args[2])){basic.profileCheck(args[2],this)};
  })
