const { Command } = require('aghanim')
// const basic = require('../helpers/basic')
const util = require('erisjs-utils')
const lang = require('../lang.json')

module.exports = new Command('thenational',{
  category : 'General', help : 'Enlace a The National', args : ''},
  function(msg, args, command){
    let self = this
    msg.reply(this.replace.do('thenationalLink'))
  })
