const { Command } = require('aghanim')
const basic = require('../helpers/basic')
const util = require('erisjs-utils')
const lang = require('../lang.json')

module.exports = new Command('bot',{
  category : 'Owner', help : 'Comandos de admin', args : '', require : basic.isOwner},
  function(msg, args, command){

  })
