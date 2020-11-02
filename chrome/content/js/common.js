if (!everyeyeNWCommon) {

var everyeyeNWCommon = {

  // ------ GESTIONE LINK -------
  apri: function(url,flag) { // news sarebbe "this"
  var addr;
  var base_sito = 'http://www.everyeye.it/';
  var base_forum = 'http://forum.everyeye.it/invision/index.php?/forum/';
  var base_cp = base_forum+'?app=core&module=usercp&tab=';

	switch(flag) {
		case 0: // vuoto
		addr = ' ';
		break;
		
		case 1: // Menu Generale
		addr = base_sito+'multi/';
		break;
		
		case 2: // Homepage
		addr = base_sito;
		break;
		
		case 3: // Evereye TV
		addr = base_sito+'tv/default.asp?ordina_video=';
		break;
		
		case 4: // Movieye TV
		addr = base_sito+'trailers/default.asp?ordina=';
		break;

		case 5: // ForumEye index
		addr = 'http://forum.everyeye.it/invision/';
		break;
		
		case 6: // ForumEye ShowForum
		addr = base_forum;
		break;
		
		// Piattaforme
		case 7:
		addr = base_sito+'xbox360/';
		break;
		
		case 71:
		addr = base_sito+'xboxone/';
		break;
		
		case 8:
		addr = base_sito+'ps3/';
		break;
		
		case 81:
		addr = base_sito+'ps4/';
		break;
		
		case 9:
		addr = base_sito+'wiiu/';
		break;
		
		/* case 10:
		addr = base_sito+'ds/';
		break; */
		
		case 11:
		addr = base_sito+'android/';
		break;
		
		case 12:
		addr = base_sito+'pc/';
		break;
		
		case 13:
		addr = base_sito+'3ds/';
		break;
		
		case 15:
		addr = base_sito+'iphone/';
		break; 		
				
		case 16: 
		addr = base_sito+'cinema/';
		break;
		
		case 17:
		addr = base_sito+'dvd/';
		break;
		
		case 18:
		addr = base_sito+'serial/';
		break;
		
		case 19:
		addr = base_sito+'anime/';
		break;
		
		// Forumeye CP
		case 20:
		addr = base_cp+'members&area=';
		break;
		
		case 21:
		addr = base_cp+'forums&area=';
		break;
		
		case 22:
		addr = base_cp+'core&area=';
		break;		
		// End Forumeye CP
		
		case 23:
		addr = base_sito+'psvita/';
		break;
		
		case 24:
		addr = base_sito+'tech/';
		break;
		
		case 25:
		addr = base_sito+'indici.asp?tipo=articoli&filtro_1=tutti&sezione=';		
		break;
    
    case 31: // WEBTV è 3, quindi questo 31
    addr = base_sito+'tv/default.asp?ordina_video=4&sistema_video=';
    break; 
    
    case 32: // WEBTV è 3, quindi questo 31
    addr = base_sito+'tv/';
    break;		
		}
		 
	loadURI(addr+url); 
	},
	// ------------------------------------------------------------
	
	
	
	// EMETTE LA DATA ATTUALE IN MILLISECONDI
	gestioneData: function() {
    var data = new Date();
  	return data.getTime();
    },
  // ------------------------------------------------------------
  
	
		
	// ------ CHIAMATA AJAX -------
  chiamaServer: function(url,flagNews,image,titolo,msg) {
  	var httpRequest;
  
  	if (window.XMLHttpRequest) // Mozilla, Safari, ...
  		{ 
  		httpRequest = new XMLHttpRequest();
  		if (httpRequest.overrideMimeType)			
  			httpRequest.overrideMimeType('text/xml');
  		} 
  
  	if (!httpRequest) 
  		{
  		this.errore(flagNews);
  		return false;
  		}
  		
  	httpRequest.onreadystatechange = function() { everyeyeNWCommon.alertContents(httpRequest,flagNews,image,titolo,msg); };
  	httpRequest.open('GET', url, true);
  	httpRequest.send(' ');
  },  
  // ------------------------------------------------------------
  
  
  
  // ------ RISPOSTA AJAX -------
  alertContents: function(httpRequest,flagNews,image,titolo,msg) {
    var prefs = this.getPrefs();
  	if (httpRequest.readyState == 4) 
  		{
  		if (httpRequest.status == 200) 
  			{ // Poichè supera il limite degli interi riduco i millisecondi			  
			  var data_attuale = this.gestioneData()/1000;   	  	
			
			  if(flagNews == 0)
  				{
  				prefs.setIntPref('data_evento',data_attuale);  				  			  
  				everyeyeNWEvento.aggiungiEvento(httpRequest.responseXML);
  				this.showAlert(image,titolo,msg);
  				}
  			else
  				{
  				prefs.setIntPref('data_news',data_attuale);  		
  				if(everyeyeNWNews.aggiungiNews(httpRequest.responseXML))
  				  {
            this.showAlert(image,titolo,msg);
            // everyeyeNWNews.modClasse(true);
            }
  				}
  			}
       else this.errore(flagNews);
  		}
  	else if(flagNews == 1)
      everyeyeNWNews.fwdCacheNews();
    else
      {
      var win = this.getMainWin();   
      var menu = win.document.getElementById('eenw-evento-popup');
		  var tot = prefs.getIntPref('evento_tot');
		  everyeyeNWEvento.cacheEvento(menu,tot);
		  }
	},
  // ------------------------------------------------------------
  
  
  
  errore: function(flagNews) {
    var image = 'chrome://forumeye/skin/icone/alert/error.png';
  	var titolo = 'Errore di connessione';
  	var msg = "Ci sono stati problemi di connessione con il server";
  	this.showAlert(image,titolo,msg);
  	if(flagNews == 1)
      everyeyeNWNews.fwdCacheNews();
    else
      {   
      var win = this.getMainWin();   
      var menu = win.document.getElementById('eenw-evento-popup');
		  var tot = prefs.getIntPref('evento_tot');
		  everyeyeNWEvento.cacheEvento(menu,tot);
		  }
  },
  // --------------------------------------------------------------  
  
  
  
  /* Aggiunge la funzione "onpopupshowing"
  attivaMenu: function() {
    // var prefs = this.getPrefs();  
    var win = this.getMainWin();
      
    //everyeyeNWNews.checkButtonElimina();
    
    win.document.getElementById('eenw-evento-popup').setAttribute("onpopupshowing","everyeyeNWEvento.checkDate();");     
  },
  // ------------------------------------------------------------   */
    
    
  
  // ------ CREA MENUITEM -------
  crea_menuitem: function(menu,id,nome,addr,tipo,i,t) { // menu, nome, indirizzo, tipo menu, progressivo, tipo indirizzo
    var win = this.getMainWin();
    
  	var m_item = win.document.createElement('menuitem');
	  var base_classe = 'menuitem-iconic forumeye-';
	  
  	switch(tipo) {
  		case 0:
  		m_item.id = 'forumeye-evento'+i;
		  var classe = base_classe+'evento';
  		break;
  		
  		case 1:
  		m_item.id = 'eyenews-gameitem'+id;
		  var classe = base_classe+'gameitem';
  		break;
  		
  		case 2:
  		m_item.id = 'eyenews-contestitem'+id;
		  var classe = base_classe+'contestitem';
  		break;
  		
  		case 3:
  		m_item.id = 'eyenews-tornitem'+id;
		  var classe = base_classe+'tornitem';
  		break;
  		}
		
		m_item.className = classe;
  	m_item.setAttribute('label',nome);
	
	if(tipo > 0) 
  	{
     m_item.setAttribute('tooltiptext',nome);   
     m_item.setAttribute("oncommand","everyeyeNWNews.apriNews("+id+",this,"+tipo+",'"+addr+"',"+t+");");    
    }
  else
  	m_item.setAttribute("oncommand","everyeyeNWCommon.apri('"+addr+"',"+t+");");
  	
  menu.appendChild(m_item);
	},
	// ---------------------------------------------------------  
	
	
	
  // ELIMINA TUTTI I NODI FIGLI
  rem_item: function(menu) {
  	while(menu.hasChildNodes())
  		{
        menu.removeChild(menu.firstChild);
  		}
	},
	// --------------------------------------------------------- 
	
	
	
	// ------- CARICO LE PREFERENZE -------
  setTimer: function() {
		return Components.classes["@mozilla.org/timer;1"].createInstance(Components.interfaces.nsITimer);
	},
  // ------------------------------------------------------------ 
	
 
  
  // ------- CARICO LE PREFERENZE -------
  getPrefs: function() {
		return Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService).getBranch("extensions.everyeyeNW.");
	},
  // ------------------------------------------------------------ 
   
  
  
  // ------- FINESTRA PRINCIPALE -------
  getMainWin: function() {
		return Components.classes["@mozilla.org/appshell/window-mediator;1"].getService(Components.interfaces.nsIWindowMediator).getMostRecentWindow("navigator:browser");
	},
	// ---------------------------------------------------------
	
	
	
	// ------- GESTIONE ALERTS -------
  showAlert: function (image,titolo,msg) {
  	var alertsService = Components.classes["@mozilla.org/alerts-service;1"].
                        getService(Components.interfaces.nsIAlertsService);
  	alertsService.showAlertNotification(image,titolo, msg, false, "", null);
  },
  // --------------------------------------------------------- 
    
  
    
  // Avvia la funzione ciclica per l'update delle news dal server
  caricaAutoNews: function() {
    var prefs = this.getPrefs(); 
  	var intervalloUpdate = prefs.getIntPref('update_time')*1000; // default ogni ora
    var url = 'http://www.everyeye.it/engine2008/alert/news.asp';
    var image = 'chrome://forumeye/skin/alert/ok.png';
    var titolo = 'Aggiornamento Alerts';
		var msg = "Clicca sull'icona di Everyeye per visualizzarli";
    
    var funzione = { notify: function(everyeyeNWtimer) { everyeyeNWCommon.chiamaServer(url,1,image,titolo,msg); } }	
        
    everyeyeNWtimer.initWithCallback(
                    funzione,
                    intervalloUpdate,
                    Components.interfaces.nsITimer.TYPE_REPEATING_SLACK);
              
  },
  // ---------------------------------------------------------
  
    
  
  // ------- MODIFICA IN BASE ALLE PREFERENZE -------
	onLoad: function() {
		var prefs = this.getPrefs();
		var win = this.getMainWin();
		
    everyeyeNWNews.checkNews();
      
		var eyeclass_home = 'menu-iconic forumeye-home';
		var base_menu = 'menu-iconic forumeye-';
		var base_item = 'menuitem-iconic forumeye-';
		
		// CLASSI PIATTAFORME
		var eyeclass_360 = base_menu+'360';
		var eyeclass_pc = base_menu+'pc';
		var eyeclass_ps2 = base_menu+'ps2';		
		var eyeclass_ps3 = base_menu+'ps3';
		var eyeclass_ds = base_menu+'ds';
		var eyeclass_3ds = base_menu+'3ds';    		
		var eyeclass_iph = base_menu+'iphone';
		
		// CLASSI BASE FORUM
		var eyeclass_forum = base_menu+'forum';
		var eyeclass_f_home = base_item+'f_home';
		var eyeclass_f_menu_home = base_menu+'f_home';
		var eyeclass_f_giochi = base_menu+'f_giochi';
		var eyeclass_f_ps3 = base_menu+'f_ps3';
		var eyeclass_f_x360 = base_menu+'f_x360';
		var eyeclass_f_wii = base_menu+'f_wii';
		var eyeclass_f_hw = base_menu+'f_hw';		
		var eyeclass_f_vetrina = base_menu+'f_vetrina';			
		
		// MENU
		win.document.getElementById('eenw-games-menu').setAttribute('hidden', !prefs.getBoolPref('videogiochi'));
		win.document.getElementById('eenw-movieye-menu').setAttribute('hidden', !prefs.getBoolPref('movieye'));
		win.document.getElementById('eenw-serial-menu').setAttribute('hidden', !prefs.getBoolPref('serialeye'));
		win.document.getElementById('eenw-anime-menu').setAttribute('hidden', !prefs.getBoolPref('animeye'));
		win.document.getElementById('eenw-tech-menu').setAttribute('hidden', !prefs.getBoolPref('techeye'));		
		win.document.getElementById('eenw-eyech-menu').setAttribute('hidden', !prefs.getBoolPref('eyech'));
		win.document.getElementById('eenw-webtv-menu').setAttribute('hidden', !prefs.getBoolPref('webtv'));		
		win.document.getElementById('eenw-forum-menu').setAttribute('hidden', !prefs.getBoolPref('forumeye'));
		win.document.getElementById('eenw-evento-menu').setAttribute('hidden', !prefs.getBoolPref('evento_attuale'));
		win.document.getElementById('eenw-other-menu').setAttribute('hidden', !prefs.getBoolPref('altro'));
		
		if(prefs.getBoolPref('videogiochi'))
		  {
		  win.document.getElementById('eenw-gamespc-menu').setAttribute('hidden', !prefs.getBoolPref('pc'));	
  		win.document.getElementById('eenw-games360-menu').setAttribute('hidden', !prefs.getBoolPref('x360'));
  		win.document.getElementById('eenw-gamesxone-menu').setAttribute('hidden', !prefs.getBoolPref('xone'));  			
  		win.document.getElementById('eenw-gamesps3-menu').setAttribute('hidden', !prefs.getBoolPref('ps3'));
  		win.document.getElementById('eenw-gamesps4-menu').setAttribute('hidden', !prefs.getBoolPref('ps4'));
  		win.document.getElementById('eenw-gamespsvita-menu').setAttribute('hidden', !prefs.getBoolPref('psvita'));  		
  		win.document.getElementById('eenw-games3ds-menu').setAttribute('hidden', !prefs.getBoolPref('3ds'));   
      win.document.getElementById('eenw-gameswiiu-menu').setAttribute('hidden', !prefs.getBoolPref('wiiu')); 		
  		win.document.getElementById('eenw-gamesmob-menu').setAttribute('hidden', !prefs.getBoolPref('mobile'));
		  }
		
		if(prefs.getBoolPref('forumeye'))
		  {
  		// FORUMEYE GENERALE
  		win.document.getElementById('eenw-nextgen-menu').setAttribute('hidden', !prefs.getBoolPref('forum-nextgen'));
  		win.document.getElementById('eenw-general-menu').setAttribute('hidden', !prefs.getBoolPref('forum-general'));
  		win.document.getElementById('eenw-digital-menu').setAttribute('hidden', !prefs.getBoolPref('forum-digital'));
  		win.document.getElementById('eenw-rubriche-menu').setAttribute('hidden', !prefs.getBoolPref('forum-rubriche'));
  		win.document.getElementById('eenw-mag-menu').setAttribute('hidden', !prefs.getBoolPref('forum-magazine'));
  		win.document.getElementById('eenw-tornei-menu').setAttribute('hidden', !prefs.getBoolPref('forum-tornei'));		
  		win.document.getElementById('eenw-market-menu').setAttribute('hidden', !prefs.getBoolPref('forum-market'));		
  		win.document.getElementById('eenw-com-menu').setAttribute('hidden', !prefs.getBoolPref('forum-com'));
  		win.document.getElementById('eenw-staff-menu').setAttribute('hidden', !prefs.getBoolPref('forum-staff'));    			
  		// FINE FORUMEYE
  		}
		
		// SEPARATORI
		win.document.getElementById('eenw-games-sep').setAttribute('hidden', !prefs.getBoolPref('videogiochi'));
		win.document.getElementById('eenw-movieye-sep').setAttribute('hidden', !prefs.getBoolPref('movieye'));
		win.document.getElementById('eenw-serial-sep').setAttribute('hidden', !prefs.getBoolPref('serialeye'));		
		win.document.getElementById('eenw-anime-sep').setAttribute('hidden', !prefs.getBoolPref('animeye'));		
    win.document.getElementById('eenw-tech-sep').setAttribute('hidden', !prefs.getBoolPref('techeye'));
		win.document.getElementById('eenw-altro-sep').setAttribute('hidden', !prefs.getBoolPref('altro'));    		
    win.document.getElementById('eenw-eyech-sep').setAttribute('hidden', !prefs.getBoolPref('eyech'));		
		win.document.getElementById('eenw-webtv-sep').setAttribute('hidden', !prefs.getBoolPref('webtv'));		
		win.document.getElementById('eenw-forum-sep').setAttribute('hidden', !prefs.getBoolPref('forumeye'));			
		win.document.getElementById('eenw-evento-sep').setAttribute('hidden', !prefs.getBoolPref('evento_attuale'));		
	}
	// ------------------------------------------------------------
  
}; // chiusura classe generale everyeyeNWCommon
var everyeyeNWtimer = everyeyeNWCommon.setTimer();
}