if (!everyeyeNWNews) {

var everyeyeNWNews = {

  // APRE I LINK DELLE NEWS
	apriNews: function(id, news, tipo, url, t) {
	
      var base_classe = 'menuitem-iconic forumeye-';
  		
  		switch(parseInt(tipo)) {
  			case 1:
  			news.className = base_classe+'gameread';
  			break;
  			
  			case 2:
  			news.className = base_classe+'contestread';
  			break;
  			
  			case 3:
  			news.className = base_classe+'tornread';
  			break;
  			}
  		
  		var addr = (t>0) ? 'http://www.everyeye.it/' : '';
  		
  		this.upListaNews(id,tipo);
  		
  	// Permette di aprire il link in una nuova o nella stessa finestra/scheda 
	  loadURI(addr+url);
  },
	// ------------------------------------------------------------
	
		

  // AVVIA IL SISTEMA DI NEWS E DOPO ATTIVA IL MENU
	checkNews: function() {
	    var prefs = everyeyeNWCommon.getPrefs();

	    if(prefs.getIntPref('game_tot') < 0) prefs.setIntPref('game_tot',0);       
      if(prefs.getIntPref('contest_tot') < 0) prefs.setIntPref('contest_tot',0);
      if(prefs.getIntPref('torn_tot') < 0) prefs.setIntPref('torn_tot',0);
	    
      this.checkDate();
      everyeyeNWCommon.caricaAutoNews();     
      // everyeyeNWCommon.attivaMenu();
    },
  // ------------------------------------------------------------
  
  
  
  // ------ CONTROLLO TEMPO -------
  checkDate: function() {
  	var prefs = everyeyeNWCommon.getPrefs();
  	var win = everyeyeNWCommon.getMainWin();
  	var ultimoReset = prefs.getIntPref('dataReset')*1000;
  	var intervalloReset = prefs.getIntPref('intervalloReset')*1000;
   	var data_attuale = everyeyeNWCommon.gestioneData();  	
  	
  	if(ultimoReset != 0)
  	   { // Se è passato il tempo necessario, svuota la variabile
       if((data_attuale - ultimoReset) > intervalloReset)
      	   everyeyeNWReset.resetNews(true,true);
       }
     else
       prefs.setIntPref('dataReset',data_attuale/1000);
  	
  		var ultima_dataN = prefs.getIntPref('data_news')*1000;
  		var update_time = prefs.getIntPref('update_time')*1000;
  		var tempo_news = data_attuale - ultima_dataN;
  		if(tempo_news > update_time)
  		  {
  		  var image = 'chrome://forumeye/skin/icone/alert/ok.png';
  			var titolo = 'Aggiornamento Alerts';
  			var msg = "Clicca sull'icona di Everyeye per visualizzarli";
        everyeyeNWCommon.chiamaServer('http://www.everyeye.it/engine2008/alert/news.asp',1,image,titolo,msg);          
        }
  		else		
  		  this.fwdCacheNews(); // Gestisce la cache per i diversi tipi di news
	},
	// ------------------------------------------------------------
	
  
  
  // Gestisce la cache per i diversi tipi di news
  fwdCacheNews: function() {
  	var prefs = everyeyeNWCommon.getPrefs();
  	
  	if(prefs.getIntPref('game_tot') > 0) this.cacheNews(1);       
    if(prefs.getIntPref('contest_tot') > 0) this.cacheNews(2);
    if(prefs.getIntPref('torn_tot') > 0) this.cacheNews(3);
    
    // this.updatePannello();
	},
	// ------------------------------------------------------------
	
  
  
  // GESTIONE CACHE NEWS
	cacheNews: function(tipo) {
    var prefs = everyeyeNWCommon.getPrefs();
    var win = everyeyeNWCommon.getMainWin();
    var lista = prefs.getCharPref('newsNR'+tipo);    
    
    switch(tipo) {
      case 1:
      var menu = win.document.getElementById('eyenews-gamepopup');
      var niente = 'Nessuna news';
      break;
      
      case 2:
      var menu = win.document.getElementById('eyenews-contestpopup');
      var niente = 'Nessun contest';
      break;
      
      case 3:
      var menu = win.document.getElementById('eyenews-tornpopup');
      var niente = 'Nessun torneo';
      break;
      } // switch   
    
    everyeyeNWCommon.rem_item(menu); 

    if(lista.match(',') != null)
      {
      var ids = lista.split(',');
      var idl = ids.length;
      
      for(var i = 0; i < idl; i++) // Inserisce solo le news non lette
  		  {
    		var nome = prefs.getCharPref('news_nome'+ids[i]);
    		var addr = prefs.getCharPref('news_addr'+ids[i]);
    		var tipo_addr = prefs.getIntPref('news_tipo'+ids[i]);
  			
  		  everyeyeNWCommon.crea_menuitem(menu,ids[i],nome,addr,tipo,i,tipo_addr);
  		  } // for  		
      }
    else if(lista != '')
      {
      var nome = prefs.getCharPref('news_nome'+lista);
    	var addr = prefs.getCharPref('news_addr'+lista);
    	var tipo_addr = prefs.getIntPref('news_tipo'+lista);
  			
  		everyeyeNWCommon.crea_menuitem(menu,lista,nome,addr,tipo,0,tipo_addr);
      }
    else
      { 			
  		everyeyeNWCommon.crea_menuitem(menu,0,niente,0,tipo,0,0);
      }
	}, 
  // ------------------------------------------------------------
  
  
  
  // ------ CONTROLLO PRESENZA ID -------
  checkID: function(id,tipo) {
    var prefs = everyeyeNWCommon.getPrefs();
    var listaNR = prefs.getCharPref('newsNR'+tipo);
    var listaR = prefs.getCharPref('newsR'+tipo);
    
    if(listaNR.match(id) != null || listaR.match(id) != null) return true; else return false;        
    },
  // -------------------------------------------------------------
  
  
  
  // ------ MODIFICA MENU NEWS -------
  aggiungiNews: function (nome_news) {
  	var prefs = everyeyeNWCommon.getPrefs();  	
  	var nodi = nome_news.getElementsByTagName('eyenews');  	
  	var tot = nodi.length;
  	var g, c, m, t, lista_g, lista_c, lista_m, lista_t, listaID, tipo_addr;
	
	  lista_g = lista_c = lista_m = lista_t = listaID = '';
	  g = c = m = t = tipo_addr = 0;
  	
  	for(var i = 0 ; i < tot; i++)
  		{
  		var id = nodi.item(i).getElementsByTagName('id').item(0).firstChild.data;
  		var tipo = nodi.item(i).getElementsByTagName('tipo').item(0).firstChild.data;  		
      		
      tipo = parseInt(tipo);
      
      if(!this.checkID(id,tipo)) // Se l'id non è presente tra le news non lette in cache
          {
    		  switch(tipo) {
    		  	case 1:
    		  	g++;
    		  	lista_g = this.concatLista(lista_g,id); 
      			break;
      			
      			case 2:
      			c++;
      			lista_c = this.concatLista(lista_c,id);             		  			
      			break;
      			
      			case 3:
      			t++;
      			lista_t = this.concatLista(lista_t,id);             		  			
      			break;
    			  } // switch
          } // checkID	      
		    else 
          continue;
  		
  		var nome = nodi.item(i).getElementsByTagName('nome').item(0).firstChild.data;
  		var addr = nodi.item(i).getElementsByTagName('indirizzo').item(0).firstChild.data;
  		
  		if(addr.match('http://www.everyeye.it/') != null)
  		  {
        addr = addr.replace('http://www.everyeye.it/','');
        tipo_addr = 1;
        }  		  
  		
  		prefs.setCharPref('news_nome'+id,nome);
  		prefs.setCharPref('news_addr'+id,addr);
  		prefs.setIntPref('news_tipo'+id,tipo_addr);
  		} // for
  		
  	if(g > 0)
  	  {
  	  var game_tot = prefs.getIntPref('game_tot')+g;
      prefs.setIntPref('game_tot',game_tot);
      this.memoLista(lista_g,1);
      }
           
  	if(c > 0)
      {
      var contest_tot = prefs.getIntPref('contest_tot')+c;
      prefs.setIntPref('contest_tot',contest_tot);
      this.memoLista(lista_c,2);      
      } 
      
    if(t > 0)
      {
      var torn_tot = prefs.getIntPref('torn_tot')+t;
      prefs.setIntPref('torn_tot',torn_tot);
      this.memoLista(lista_t,3);      
      }	
      
    this.fwdCacheNews();
  	
  if(g>0 || c>0 || t>0) return true;  else  return false;
	},
  // ------------------------------------------------------------
  
  
  
  // Aggiunge id alla lista specificata
  concatLista: function(lista,id) {        
    lista = (lista == '') ? id : lista+','+id;      
    return lista;
    },
  // ---------------------------------------------------------
  
  
  
  // Memorizza la lista aggiornata delle news non lette
  memoLista: function(lista,tipo) {
    var prefs = everyeyeNWCommon.getPrefs();
    if (lista != '')
      {
      var vecchia_lista = prefs.getCharPref('newsNR'+tipo);
      if(vecchia_lista != '')
        {
        var nuova_lista = vecchia_lista+','+lista;
        prefs.setCharPref('newsNR'+tipo,nuova_lista);  
        } 
      else
        prefs.setCharPref('newsNR'+tipo,lista);            
      }
    },
  // ---------------------------------------------------------
  
  
  
  // Aggiorna la lista news (lette e non) in cache
  upListaNews: function(id,tipo) {
    var prefs = everyeyeNWCommon.getPrefs();
    var listaNR = prefs.getCharPref('newsNR'+tipo);
    var listaR = prefs.getCharPref('newsR'+tipo);
    
    // se ci sono più elementi sostituisce l'id insieme al separatore
    if(listaNR.match(',') != null)
      {
      var cerca = new RegExp(","+id); 
      
      if(listaNR.match(cerca) != null)      
        listaNR = listaNR.replace(','+id,'');      
      else
        listaNR = listaNR.replace(id+',','');
      }
    else // altrimenti cancella solo l'id
      listaNR = listaNR.replace(id,'');            
    
    prefs.setCharPref('newsNR'+tipo,listaNR); // Rimemorizza le news non lette
    
    listaR = (listaR != '') ? listaR+','+id : id; // Aggiunge l'id alle news lette
    
    prefs.setCharPref('newsR'+tipo,listaR); // Rimemorizza le news lette
    
    switch(tipo){
      case 1:
      var game_tot = prefs.getIntPref('game_tot')-1;
      prefs.setIntPref('game_tot',game_tot);
      break;
      
      case 2:
      var contest_tot = prefs.getIntPref('contest_tot')-1;
      prefs.setIntPref('contest_tot',contest_tot);
      break;  
      
      case 3:
      var torn_tot = prefs.getIntPref('torn_tot')-1;
      prefs.setIntPref('torn_tot',torn_tot);
      break;    
      } 
    }
}
}
// window.addEventListener("load", function() { everyeyeNWCommon.onLoad(); }, false);