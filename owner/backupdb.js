const { Command } = require('aghanim')
const basic = require('../helpers/basic')
const util = require('erisjs-utils')
const lang = require('../lang.json')

module.exports = new Command('backupdb',{
  subcommandFrom : 'bot',
  category : 'Owner', help : 'Realiza una copia de seguridad de la DB', args : '', require : basic.isOwner},
  function(msg, args, command){
    // this.db.once('value').then(snap => {
    //   if(!snap.exists()){return};
    //   snap = snap.val();
    //   let buffer = new Buffer(JSON.stringify(snap));
    //   let filename = `mango_backup_${util.date('hms/DMY')}.txt`.replace(/ /g,"_");
    //   this.createMessage(this.config.ready.backupDB,{content : `DB Backup - Mango \`${util.date('hms/DMY')}\``},{file : buffer, name : filename})
    // })
    util.firebase.backupDBfile(this.db,this,this.config.ready.backupDB,{filenameprefix : 'mango_db_', messageprefix : '**Mango Backup DB**'})
  })
