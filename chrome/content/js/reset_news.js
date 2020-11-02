if(!everyeyeNWReset) {

var everyeyeNWReset = {

  // ATTIVA BOTTONE RESET
  attivaBottone: function(atv) {       
    var bottone = document.getElementById('reset_alert');
    var idcheck = document.getElementById('check_reset');
    
    if(atv) 
      {
       bottone.disabled = false;
       idcheck.oncommand = function() { everyeyeNWReset.attivaBottone(false); };
      }
    else
      {
       bottone.disabled = true;
       idcheck.oncommand = function() { everyeyeNWReset.attivaBottone(true); };
      }          
  },
  // --------------------------------------------------------
  
  

  // ELIMINA TUTTE LE NEWS
	deleteNews: function(resetAlert) {
    var prefs = everyeyeNWCommon.getPrefs();
    var win = everyeyeNWCommon.getMainWin();
    
    var answer = (resetAlert) ? confirm('Vuoi resettare tutti gli Alerts di Everyeye?') : confirm('Vuoi cancellare gli Alerts non letti di Everyeye?'); 
      
    if(answer)
      {
      if(resetAlert) 
        {
        var msg = 'Reset completato';
        this.resetNews(true,false);
        document.getElementById('check_reset').checked = false; 
        }
      else
        {
        var msg = 'Tutti gli alerts sono stati eliminati';
        this.resetNews(false,false);
        }
      
      var image = 'chrome://forumeye/skin/forumeye.png';  			
      var titolo = 'Pulitura completata';
      everyeyeNWNews.checkButtonElimina(resetAlert);
      everyeyeNWCommon.showAlert(image,titolo,msg);
      }       
  },
	// ---------------------------------------------------------
	
	

  // Ripulice la cache dalle news lette
	resetNews: function(flagP,flagLette) { // flagP indica la cancellazione manuale (R) o periodica (R e NR)
    var prefs = everyeyeNWCommon.getPrefs();
    var flag = false;
    var ultimoR = everyeyeNWCommon.gestioneData();    
    var lette = (flagLette) ? 'R' : 'NR';

    for(var i = 1; i <= 3; i++)
      {
      var lista_news = prefs.getCharPref('news'+lette+i);
  
      if(lista_news.match(',') != null)
        {
        var lista = lista_news.split(',');
        var listaL = lista.length;
        
        for(var n = 0; n < listaL; n++)
          {
          if(!flagP && !flagLette) { this.creaLista(lista[n],i); } // Se sto eliminando manualmente
          this.cancellaBranch(lista[n]);
          }
        flag = true;
        }
      else if(lista_news != '')
        {
        if(!flagP && !flagLette) { this.creaLista(lista_news,i); } // Se sto eliminando manualmente      
        this.cancellaBranch(lista_news);  
        flag = true;
        }
      if(flagP && flagLette) prefs.setCharPref('newsR'+i,'');
      if(!flagLette) prefs.setCharPref('newsNR'+i,'');
      }
    
    if(!flagLette)
      {
      prefs.setIntPref('game_tot',0);
  	  prefs.setIntPref('contest_tot',0);
  	  prefs.setIntPref('torn_tot',0);
  	  prefs.setIntPref('dataReset',0);
      }
    
    everyeyeNWNews.cacheNews(1);
    everyeyeNWNews.cacheNews(2);
    everyeyeNWNews.cacheNews(3);
    
    if(flag) prefs.setIntPref('dataReset', (ultimoR/1000)); 
    },
  // ---------------------------------------------------------  
  
  
  
  // Ricrea la lista
  creaLista: function(id,tipo) {
    var prefs = everyeyeNWCommon.getPrefs();
    var nuova_lista;
    var newsR = prefs.getCharPref('newsR'+tipo); 
    if(newsR.match(id) == null) 
      {
      nuova_lista = everyeyeNWNews.concatLista(newsR,id);
      prefs.setCharPref('newsR'+tipo,nuova_lista);
      }
  },
  // ---------------------------------------------------------
  
  
  
  cancellaBranch: function(lista) {
    var prefs = everyeyeNWCommon.getPrefs();
    prefs.deleteBranch('news_nome'+lista);
    prefs.deleteBranch('news_addr'+lista);
    prefs.deleteBranch('news_tipo'+lista); 
  }
}
}