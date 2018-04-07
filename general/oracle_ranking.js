const { Command } = require('aghanim')
// const basic = require('../helpers/basic')
const util = require('erisjs-utils')
const lang = require('../lang.json')
const basic = require('../helpers/basic')

module.exports = new Command('ranking',{
  subcommandFrom : "oracle",
  category : 'Admin', help : 'Ve el ranking', args : '', rolesCanUse : basic.adminRole, require : basic.guildFEDCommand},
  function(msg, args, command){
    let self = this
    this.db.child('profiles').once('value').then((snap) => {
      if(!snap.exists()){return}
      snap = snap.val();
      snap = Object.keys(snap).map(profile_id => snap[profile_id]).filter(profile => profile.oracle > 0).sort(basic.sortOracleRanking);
      const limit = this.config.constants.oracleTop;
      snap = snap.slice(0,limit);
      let table = new util.table.new(['Pos', 'Nombre', 'PO'], ['3','25','2r']);
      const max = snap.length > limit ? limit : snap.length;
      if(max < 1 ){return};
      for (var i = 0; i < max; i++) {
        table.addRow([`#${i+1}`,snap[i].username,snap[i].oracle])
      };
      msg.delete();
      msg.reply({embed : {
        title : this.replace.do('TheOracleRankingTitle',{max},true),
        description : table.do(),
        color : this.config.color}})
    });
  })
