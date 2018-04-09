const { Command } = require('aghanim')
const basic = require('../helpers/basic')
const util = require('erisjs-utils')
const lang = require('../lang.json')
const reglamento = require('../containers/reglamento.json');

function loadReglamento(pathFile){
  const reglamento = require(pathFile).articles;
  return Object.keys(reglamento).map(article => {let art = reglamento[article]; art.id = article;return art})
}

function loadIndexReglamento(reglamento){
  let output = {};
  reglamento.forEach(article => {
    article.tags.forEach(tag => output[tag] = article.id)
  })
  return output
}

reglamento.articles = loadReglamento('../containers/reglamento.json');
const reglamentoIndexed = loadIndexReglamento(reglamento.articles);

module.exports = new Command('reglamento',{
  category : 'General', help : 'Invitación de Twitter', args : '<categría>'},
  function(msg, args, command){
    // let self = this
    const query = args.from(1).toLowerCase();
    if(!reglamentoIndexed[query]){
      basic.wrongCmd(msg,reglamentoIndexed,args.until(1));
      return;
    }
    const article = reglamento.articles.find(art => art.id === reglamentoIndexed[query]);
    msg.reply({embed : {
      title : this.replace.do('rgArticleTitle',{articleId : article.id, articleTitle : article.title},true),
      description : article.text,
      footer : {text : this.replace.do('rgArticleFooter',{updated : article.updated || reglamento.updated},true), icon_url : this.config.img.logofed},
      color : this.config.color}})
  })
