if (!everyeyeNWEvento) {

var everyeyeNWEvento = {
	
	// ------ CONTROLLO TEMPO -------
  checkDate: function() {
  	var prefs = everyeyeNWCommon.getPrefs();
  	var win = everyeyeNWCommon.getMainWin();
   	var data_attuale = everyeyeNWCommon.gestioneData();   	
    
		var ultima_dataE = prefs.getIntPref('data_evento')*1000;
		var tempo_evento = data_attuale - ultima_dataE;
		if(tempo_evento > (3600*1000))
		  {
		  var image = 'chrome://forumeye/skin/forumeye.png';
		  var titolo = 'Aggiornamento "Ultimi Eventi"';
  		var msg = 'Menu eventi aggiornato con successo'; 
      everyeyeNWCommon.chiamaServer('http://www.everyeye.it/xml/evento.xml',0,image,titolo,msg);
      }		  
		else
		  {
		  var menu = win.document.getElementById('eenw-evento-popup');
		  var tot = prefs.getIntPref('evento_tot');
		  everyeyeNWEvento.cacheEvento(menu,tot); // Carica i dati dalla cache e crea il menu
		  }
	},
	// ------------------------------------------------------------
	
	
	
	// ----- Carica i dati dalla cache eventi -----
	cacheEvento: function (menu,tot) {
    var prefs = everyeyeNWCommon.getPrefs();
    
	  if(tot > 0) // Se ci sono degli eventi memorizzati
	  	{
      everyeyeNWCommon.rem_item(menu);
      
  		for(var i = 0; i < tot; i++)
  		  {
    		var nome = prefs.getCharPref('evento_nome'+i);
    		var addr = prefs.getCharPref('evento_addr'+i);
  			
  		  everyeyeNWCommon.crea_menuitem(menu,0,nome,addr,0,i,0);
  		  } // for
	   } // tot > 0
	}, 
	// ------------------------------------------------------------
	
	
	
	// ------ MODIFICA MENU EVENTO -------
  aggiungiEvento: function (nome_evento) {
    var prefs = everyeyeNWCommon.getPrefs();
    var win = everyeyeNWCommon.getMainWin();
  	var menu = win.document.getElementById('eenw-evento-popup');
  	var nodi = nome_evento.getElementsByTagName('evento');
  	var tot = nodi.length;
  	var id = 0;
  	
  	everyeyeNWCommon.rem_item(menu); // Rimuovo i nodi figli
  	
  	for(var i = 0 ; i < tot; i++)
  		{
  		var nome = nodi.item(i).getElementsByTagName('nome').item(0).firstChild.data;
  		var addr = nodi.item(i).getElementsByTagName('indirizzo').item(0).firstChild.data;
  		
  		prefs.setCharPref('evento_nome'+i,nome);
  		prefs.setCharPref('evento_addr'+i,addr);
  		
  		everyeyeNWCommon.crea_menuitem(menu,id,nome,addr,0,i,0);
  		} // for
  	
  	prefs.setIntPref('evento_tot',tot);
	}
  // ------------------------------------------------------------
};
}