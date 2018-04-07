const { Command } = require('aghanim')
// const basic = require('../helpers/basic')
const util = require('erisjs-utils')
const lang = require('../lang.json')
const basic = require('../helpers/basic')

module.exports = new Command('oracle',{
  category : 'General', help : 'Crea una predicción del Oráculo', args : '', rolesCanUse : basic.adminRole, require : basic.guildFEDCommand},
  function(msg, args, command){
    let self = this
    basic.createVote.call(this,msg,args,command,true)
  })
