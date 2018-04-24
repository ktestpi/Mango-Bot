const { Command } = require('aghanim')
// const basic = require('../helpers/basic')
const util = require('erisjs-utils')
const lang = require('../lang.json')
const basic = require('../helpers/basic')

module.exports = new Command('vote',{
  category : 'Admin', help : 'crea una votación', args : '"Pregunta" "opción 1,opción 2,..."', rolesCanUse : basic.adminRole, check : basic.guildFEDCommand},
  function(msg, args, command){
    let self = this
    basic.createVote.call(this,msg,args,command,false)
  })
