var FlowerSoundPlayer=new Class({Implements:[Events,Options],options:{volume:100,debug:false,forceFlash:false,sm2LoadTimeout:1500,sm2Location:"/assets/scripts/lib/soundmanager2/soundmanager2.js",sm2swfLocation:"/assets/scripts/lib/soundmanager2/swf/"},initialize:function(a){this.setOptions(a);this.name="soundplayer";this.version=1;this.donotdebugoptions=false;this.sm2Loaded=false;this.currentSound=null;this.currentPlaylist=null;this.Playlists=new Hash();this.soundManager=null;this.sm2LoadTimer=null;this.sm2LoadTime=0;this.isReady=false;this.isAppleiDevice=false;if((navigator.userAgent.match(/iPad/i)!==null)||(navigator.userAgent.match(/iPhone/i)!==null)||(navigator.userAgent.match(/iPod/i)!==null)){this.isAppleiDevice=true}window.addEvent("domready",function(){window.SM2_DEFER=true;injected=new Element("script",{type:"text/javascript",src:this.options.sm2Location}).injectInside($$("head")[0]);this.sm2LoadTimer=(function(){if(typeof(soundManager)!="undefined"){this.initializeSM2();$clear(this.sm2LoadTimer)}else{this.sm2LoadTime+=50;if(this.sm2LoadTime>this.options.sm2LoadTimeout){this.onError("soundmanager2 could not be loaded/found.");$clear(this.sm2LoadTimer)}}}).periodical(50,this)}.bind(this))},initializeSM2:function(){window.soundManager=new SoundManager();soundManager.url=this.options.sm2swfLocation;soundManager.flashVersion=9;soundManager.useFlashBlock=false;if(!this.options.forceFlash){soundManager.useHTML5Audio=true}soundManager.flashLoadTimeout=this.options.sm2LoadTimeout;soundManager.debugMode=this.options.debug;soundManager.onready(function(){if(soundManager.supported()){this.soundManager=soundManager;this.onSM2Loaded()}else{this.onError("soundmanager2 loaded but is not supported")}}.bind(this));soundManager.beginDelayedInit()},attachToElement:function(d){if(!this.ismobile){if(d.get("tag")=="a"){var c=d.getProperty("rev"),a=d.getProperty("href");if(this.soundManager.canPlayURL(a)){var e=d.getProperty("html"),f=d.getProperty("title");d.store("isPlaying",false);d.store("prePlayTxt","");d.store("postPlayTxt",' <span class="flower_soundplayer_inlineplaypause">[play]</span>');d.store("prePauseTxt","");d.store("postPauseTxt",' <span class="flower_soundplayer_inlineplaypause">[pause]</span>');d.store("originalHTML",d.get("html"));this.loadPlaylist(e,[{url:a,title:f,artist:"Unknown"}]);if(c){d.store("postPlayTxt","");d.store("postPauseTxt","");$A(c.substring(12,c.length).split(",")).each(function(j){var i=j.split("=");switch(i[0]){case"playTextBefore":if(i[1]){d.store("prePlayTxt",i[1])}break;case"playTextAfter":if(i[1]){d.store("postPlayTxt",i[1])}break;case"pauseTextBefore":if(i[1]){d.store("prePauseTxt",i[1])}break;case"pauseTextAfter":if(i[1]){d.store("postPauseTxt",i[1])}break}}.bind(this))}}d.removeEvents("click");d.setStyle("cursor","pointer");d.set("html",d.retrieve("prePlayTxt")+d.retrieve("originalHTML")+d.retrieve("postPlayTxt"));d.addEvent("click",function(i){this.switchPlaylist(e);this.currentPlaylist.toggleCurrentSound();i.stop();if(d.retrieve("isPlaying")){d.set("html",d.retrieve("prePauseTxt")+d.retrieve("originalHTML")+d.retrieve("postPauseTxt"));d.store("isPlaying",true)}else{d.set("html",d.retrieve("prePlayTxt")+d.retrieve("originalHTML")+d.retrieve("postPlayTxt"));d.store("isPlaying",false)}}.bind(this));this.addEvent("play",function(){if(this.currentPlaylist.name==e){d.set("html",d.retrieve("prePauseTxt")+d.retrieve("originalHTML")+d.retrieve("postPauseTxt"));d.store("isPlaying",true)}}.bind(this));this.addEvent("resume",function(){if(this.currentPlaylist.name==e){d.set("html",d.retrieve("prePauseTxt")+d.retrieve("originalHTML")+d.retrieve("postPauseTxt"));d.store("isPlaying",true)}}.bind(this));this.addEvent("pause",function(){if(this.currentPlaylist.name==e){d.set("html",d.retrieve("prePlayTxt")+d.retrieve("originalHTML")+d.retrieve("postPlayTxt"));d.store("isPlaying",false)}}.bind(this));this.addEvent("stop",function(){if(this.currentPlaylist.name==e){d.set("html",d.retrieve("prePlayTxt")+d.retrieve("originalHTML")+d.retrieve("postPlayTxt"));d.store("isPlaying",false)}}.bind(this))}else{if(d.get("tag")=="div"){var b=d.get("id"),g=[],e,h;if(b){e=b}else{e=$random(10000,99999)}d.getElements("a").each(function(i){var j=i.getProperty("href"),k=i.getProperty("title");if(this.soundManager.canPlayURL(j)){g.push({url:j,title:k,artist:"Unknown"})}}.bind(this));if(g.length>0){document.id(b).set("html","");this.loadPlaylist(e,g);h=new defaultSoundPlayerUI(this.currentPlaylist,b);h.drawUI()}}}}},debugMessage:function(a){if(typeof(console)=="object"&&this.options.debug){console.log(a)}},loadPlaylist:function(b,a){if(!this.sm2Loaded){this.onError("flash object not yet loaded. please use the 'ready' event.")}else{this.currentPlaylist=this.Playlists.get(b);if(this.currentPlaylist===null){this.Playlists.set(b,new SoundPlaylist(b));this.currentPlaylist=this.Playlists.get(b)}this.currentPlaylist.setSoundPlayer(this);a.each(function(c){this.currentPlaylist.loadSound(c)},this)}return this},switchPlaylist:function(a){if(this.Playlists.get(a)!==null&&this.currentPlaylist.name!=a){if(this.currentPlaylist.currentSound){this.pauseCurrentSound()}this.currentPlaylist=this.Playlists.get(a)}},playCurrentSound:function(){if(this.currentPlaylist===null){this.onError("there are no playlists loaded.")}else{this.currentPlaylist.playCurrentSound()}},stopCurrentSound:function(){if(this.currentPlaylist===null){this.onError("there are no playlists loaded.")}else{this.currentPlaylist.stopCurrentSound()}},resumeCurrentSound:function(){if(this.currentPlaylist===null){this.onError("there are no playlists loaded.")}else{this.currentPlaylist.resumeCurrentSound()}},pauseCurrentSound:function(){if(this.currentPlaylist===null){this.onError("there are no playlists loaded.")}else{this.currentPlaylist.pauseCurrentSound()}},toggleCurrentSound:function(){if(this.currentPlaylist===null){this.onError("there are no playlists loaded.")}else{this.currentPlaylist.toggleCurrentSound()}},jumpCurrentSoundTo:function(a){if(this.currentPlaylist===null){this.onError("there are no playlists loaded.")}else{this.currentPlaylist.jumpCurrentSoundTo(a)}},setVolume:function(a){this.swf.setVolume(a);this.options.volume=a;return this},getVolume:function(){return this.options.volume},onSM2Loaded:function(){if(!this.isReady){this.sm2Loaded=true;this.soundManager.defaultOptions.volume=this.options.volume;this.fireEvent("ready");this.isReady=true}},onError:function(a){this.debugMessage("flower soundplayer error: "+a);this.fireEvent("error")}});var SoundPlaylist=new Class({Implements:[Events],options:{loopPlaylist:false},initialize:function(a){this.SoundPlayer=null;this.sounds=new Hash();this.currentSound=null;this.currentKey=-1;this.usingHTML5=false;this.name=a},setSoundPlayer:function(a){this.SoundPlayer=a;return this},loadSound:function(b){var a=b;if(typeof(b)=="string"){a={url:b,title:false,artist:false}}this.sounds.set(a.url,{sound:this.SoundPlayer.soundManager.createSound({id:a.url,url:a.url,onfinish:function(){this.SoundPlayer.fireEvent("stop");this.playSound("next")}.bind(this),whileplaying:function(){if(!this.currentSound.sound.loaded){currentDuration=this.currentSound.sound.durationEstimate}else{currentDuration=this.currentSound.sound.duration}approximatePosition=this.currentSound.sound.position/currentDuration;this.SoundPlayer.fireEvent("position",[approximatePosition,this.currentSound.sound.url]);currentDuration=Math.round(currentDuration/1000);figureSeconds=Math.floor(currentDuration%60);figureSeconds=(String(figureSeconds).length<2)?figureSeconds=String("0"+figureSeconds):figureSeconds=String(figureSeconds);currentDuration=Math.floor(currentDuration/60)+":"+figureSeconds;currentPosition=Math.round(this.currentSound.sound.position/1000);figureSeconds=Math.floor(currentPosition%60);figureSeconds=(String(figureSeconds).length<2)?figureSeconds=String("0"+figureSeconds):figureSeconds=String(figureSeconds);currentPosition=Math.floor(currentPosition/60)+":"+figureSeconds;this.SoundPlayer.fireEvent("positiontime",[currentPosition+" / "+currentDuration,this.currentSound.sound.url]);if(this.usingHTML5){loadPercentage=this.currentSound.sound.bytesLoaded/this.currentSound.sound.bytesTotal;this.SoundPlayer.fireEvent("progress",loadPercentage)}}.bind(this),whileloading:function(){if(!this.usingHTML5){loadPercentage=this.currentSound.sound.bytesLoaded/this.currentSound.sound.bytesTotal;this.SoundPlayer.fireEvent("progress",loadPercentage)}}.bind(this),}),title:a.title,artist:a.artist});if(this.sounds.get(a.url).sound.isHTML5){this.usingHTML5=true}return this},playSound:function(c){this.makeCurrent();var e,b,d=false,a=this.sounds.getKeys();if(c=="next"){if(this.currentKey==(a.length-1)&&this.options.loopPlaylist){d=0}else{if(this.currentKey==(a.length-1)&&!this.options.loopPlaylist){d=false}else{d=this.currentKey+1}}}else{if(c=="forcenext"){if(this.currentKey==(a.length-1)){d=0}else{d=this.currentKey+1}}else{if(c=="previous"){if(this.currentSound!=null){if(this.currentKey==0){d=a.length-1}else{d=this.currentKey-1}}}else{if(c=="random"){d=Math.floor(Math.random()*a.length)}else{if(c=="first"){d=0}}}}}if(this.currentSound){this.currentSound.sound.setPosition(0);this.stopCurrentSound()}if(d!==false){b=a[d];e=this.sounds.get(b);this.currentKey=d;this.currentSound=e;this.playCurrentSound()}},resumeCurrentSound:function(){this.makeCurrent();if(this.currentSound.sound.paused){this.currentSound.sound.resume();this.SoundPlayer.fireEvent("resume")}},playCurrentSound:function(){this.makeCurrent();if(this.currentSound.sound.paused){this.currentSound.sound.setPosition(0);this.currentSound.sound.resume()}else{this.currentSound.sound.play()}this.SoundPlayer.fireEvent("play",[this.currentSound.sound.url,this.currentSound.title,this.currentSound.artist])},pauseCurrentSound:function(){this.makeCurrent();if(this.currentSound.sound.playState==1){this.currentSound.sound.pause();this.SoundPlayer.fireEvent("pause")}},stopCurrentSound:function(){this.makeCurrent();if(this.currentSound.sound.playState!=0){this.currentSound.sound.stop();this.SoundPlayer.fireEvent("stop")}},toggleCurrentSound:function(){this.makeCurrent();if(this.currentSound){if(this.currentSound.sound.playState==0){this.playCurrentSound()}else{if(this.currentSound.sound.paused){this.resumeCurrentSound()}else{this.pauseCurrentSound()}}}else{this.playSound("first")}},jumpCurrentSoundTo:function(a){this.makeCurrent();this.currentSound.sound.setPosition(a);if(this.currentSound.sound.paused){this.resumeCurrentSound()}this.SoundPlayer.fireEvent("play",[this.currentSound.sound.url,this.currentSound.title,this.currentSound.artist])},makeCurrent:function(){if(this.SoundPlayer.currentPlaylist!=this){this.SoundPlayer.switchPlaylist(this.name)}}});var SoundPlayerUI=new Class({Implements:[Options,Events],options:{debug:false},initialize:function(c,b,a){this.setOptions(a);if(this.options.playlist!=false){this.supportsAppleiDevices=true;this.targetElement=b;this.playlist=c;this.isAppleiDevice=this.playlist.SoundPlayer.isAppleiDevice;this.allSoundKeys=this.playlist.sounds.getKeys()}else{if(this.options.debug){this.debugMessage("No playlist specified, cannot draw UI.")}}},debugMessage:function(a){if(typeof(console)=="object"&&this.options.debug){console.log(a)}}});var defaultSoundPlayerUI=new Class({Extends:SoundPlayerUI,Implements:[Options,Events],options:{debug:false,forceAppleiDevice:false,assetPath:""},initialize:function(d,b,a){this.parent(d,b,a);this.setOptions(a);var c=this.playlist.SoundPlayer.options.sm2swfLocation.replace("/lib/soundmanager2/swf/","");this.controlImages={previous:c+"/assets/defaultSoundPlayerUI/images/previous.png",next:c+"/assets/defaultSoundPlayerUI/images/next.png",play:c+"/assets/defaultSoundPlayerUI/images/play.png",pause:c+"/assets/defaultSoundPlayerUI/images/pause.png"};if(this.options.forceAppleiDevice){this.isAppleiDevice=true}this.allPlaylistLi=new Hash();this.notesSpan=new Element("span",{text:"(tap to stop)",styles:{display:"none",color:"#111","padding-left":"1em"}});this.elementStyles=new Hash({seekbarSpc:{position:"relative","background-color":"#666",height:"9px",width:"100%","margin-top":"4px",overflow:"hidden"},seekbar:{position:"absolute","background-color":"#c00",height:"9px",width:"0%",cursor:"pointer","z-index":"10"},position:{position:"absolute",left:"0%",width:"3px",height:"9px","background-color":"#000","z-index":"15"},controls:{"margin-top":"8px","text-align":"right"},iDeviceLiStyles:{background:"-webkit-gradient(linear, left top, left bottom, from(#666), to(#222))",color:"#fff"},iDeviceLiStylesClicked:{background:"-webkit-gradient(linear, left top, left bottom, from(#00acf1), to(#002939))",color:"#ed028d"},controlImageStyles:{"margin-left":"4px",cursor:"pointer"}})},clearAllPlaylistLi:function(){this.notesSpan.setStyle("display","none");this.allPlaylistLi.each(function(a){a.get("li").setStyles(this.elementStyles.get("iDeviceLiStyles"));a.get("titlespan").setStyle("color","#fff");a.get("timespan").set("html","")}.bind(this))},handlePlaylistLiClick:function(a){var b=this.playlist.sounds.get(a);var c=false;if(this.playlist.currentSound){if(this.playlist.currentSound.sound.playState==0&&this.playlist.currentKey==this.allSoundKeys.indexOf(a)){c=true}}if(this.playlist.currentKey!=this.allSoundKeys.indexOf(a)||c){if(this.playlist.currentSound){this.playlist.currentSound.sound.setPosition(0);this.playlist.stopCurrentSound()}this.playlist.currentKey=this.allSoundKeys.indexOf(a);this.playlist.currentSound=b;this.playlist.playCurrentSound();this.highlightPlayingLi(a)}else{this.playlist.stopCurrentSound();this.clearAllPlaylistLi()}},highlightPlayingLi:function(b){this.clearAllPlaylistLi();var d=this.allPlaylistLi.get(b);var e=d.get("timespan");var c=d.get("titlespan");var a=d.get("li");if(e.get("html")==""){e.set("html","loading...")}a.setStyles(this.elementStyles.get("iDeviceLiStylesClicked"));c.setStyle("color","#000");this.notesSpan.inject(a);this.notesSpan.setStyle("display","inline")},addPlaylistElements:function(){if(!this.isAppleiDevice){var a=1;this.mainPlaylistUl=new Element("ol",{styles:{"font-size":"0.85em",padding:0,margin:0,"list-style-type":"decimal-leading-zero"}});this.playlist.sounds.each(function(c,d){var b=new Element("li",{styles:{"list-style-position":"inside"}}).inject(this.mainPlaylistUl);if(a%2==0){b.addClass("flower_soundplaylist_altli")}a+=1;var e=new Element("span",{text:c.title,styles:{cursor:"pointer"},events:{click:function(){this.playlist.SoundPlayer.switchPlaylist(this.playlist.name);sound=this.playlist.sounds.get(c.sound.url);if(this.playlist.currentSound){this.playlist.currentSound.sound.setPosition(0);this.playlist.stopCurrentSound()}this.playlist.currentKey=this.allSoundKeys.indexOf(c.sound.url);this.playlist.currentSound=sound;this.playlist.playCurrentSound()}.bind(this)}}).inject(b)},this);this.mainPlaylistUl.inject(document.id(this.targetElement))}else{this.mainPlaylistUl=new Element("ol",{styles:{"font-size":"0.85em",padding:0,margin:0,"list-style-type":"decimal-leading-zero"}});this.playlist.sounds.each(function(c,d){var b=new Element("li",{styles:{"list-style-position":"inside",background:"-webkit-gradient(linear, left top, left bottom, from(#666), to(#222))",border:"1px solid #777","-webkit-border-radius":"3px","margin-bottom":"4px",padding:"3px",height:"4em",cursor:"pointer",color:"#fff"}}).inject(this.mainPlaylistUl);var e=new Element("span",{text:c.title,styles:{"font-size":"1.5em","line-height":"1em","font-weight":"bold",display:"block"}}).inject(b);var f=new Element("span",{styles:{"padding-left":"1.95em",color:"#fff"}}).inject(b);b.addEvent("click",function(){this.handlePlaylistLiClick(c.sound.url)}.bind(this));this.allPlaylistLi.set(c.sound.url,new Hash({li:b,titlespan:e,timespan:f}))},this);this.mainPlaylistUl.inject(document.id(this.targetElement))}},addPlaylistEvents:function(){if(!this.isAppleiDevice){}else{this.playlist.SoundPlayer.addEvent("play",function(a){if(this.playlist.SoundPlayer.currentPlaylist==this.playlist){this.highlightPlayingLi(a)}}.bind(this));this.playlist.SoundPlayer.addEvent("positiontime",function(b,a){if(this.playlist.SoundPlayer.currentPlaylist==this.playlist){this.allPlaylistLi.get(a).get("timespan").set("html",b)}}.bind(this))}},drawPlaylist:function(){this.addPlaylistElements();this.addPlaylistEvents()},addControllerElements:function(){this.playerSpc=new Element("div",{"class":"flower_soundplayer"});this.soundtitle=new Element("div",{"class":"flower_soundplayer_title",html:"Press Play"}).inject(this.playerSpc);this.soundtime=new Element("div",{"class":"flower_soundplayer_time",html:"&nbsp;"}).inject(this.playerSpc);this.seekbarSpc=new Element("div",{"class":"flower_soundplayer_seekbarcontainer",styles:this.elementStyles.get("seekbarSpc")}).inject(this.playerSpc);this.seekbar=new Element("div",{"class":"flower_soundplayer_seekbar",styles:this.elementStyles.get("seekbar")}).inject(this.seekbarSpc);this.position=new Element("div",{"class":"flower_soundplayer_positionmarker",styles:this.elementStyles.get("position")}).inject(this.seekbarSpc);this.controls=new Element("div",{"class":"flower_soundplayer_controls",styles:this.elementStyles.get("controls")}).inject(this.playerSpc);this.previousEl=new Element("img",{"class":"prev",alt:"prev",id:"prev",src:this.controlImages.previous,styles:this.elementStyles.get("controlImageStyles"),events:{click:function(){this.playlist.playSound("previous")}.bind(this)}}).inject(this.controls);this.playPauseEl=new Element("img",{"class":"play",alt:"play",id:"play",src:this.controlImages.play,styles:this.elementStyles.get("controlImageStyles"),events:{click:function(){this.playlist.toggleCurrentSound()}.bind(this)}}).inject(this.controls);this.nextEl=new Element("img",{"class":"next",alt:"next",id:"next",src:this.controlImages.next,styles:this.elementStyles.get("controlImageStyles"),events:{click:function(){this.playlist.playSound("forcenext")}.bind(this)}}).inject(this.controls);this.playerSpc.inject(document.id(this.targetElement))},addControllerEvents:function(){this.seekbar.addEvent("click",function(d){if(this.playlist.SoundPlayer.currentPlaylist!=this.playlist){this.playlist.SoundPlayer.switchPlaylist(this.playlist.name)}var b;if(!this.playlist.currentSound.sound.loaded){b=this.playlist.currentSound.sound.durationEstimate}else{b=this.playlist.currentSound.sound.duration}var g=this.seekbarSpc.getCoordinates();var f=this.seekbar.getCoordinates();var c=(d.page.x-f.left)/g.width;var a=c*b;this.playlist.jumpCurrentSoundTo(a)}.bind(this));this.playlist.SoundPlayer.addEvent("play",function(b,c,a){if(this.playlist.SoundPlayer.currentPlaylist==this.playlist){if(c){this.soundtitle.set("text",c)}else{this.soundtitle.set("text",b)}}}.bind(this));this.playlist.SoundPlayer.addEvent("progress",function(b){if(this.playlist.SoundPlayer.currentPlaylist==this.playlist){if(b<0.95){var a=this.seekbarSpc.getSize().x;this.seekbar.setStyle("width",Math.round(a*b))}else{this.seekbar.setStyle("width","100%")}}}.bind(this));this.playlist.SoundPlayer.addEvent("position",function(c,a){if(this.playlist.SoundPlayer.currentPlaylist==this.playlist&&this.playlist.currentSound.sound.url==a){var b=this.seekbarSpc.getSize().x;this.position.setStyle("left",Math.round(b*c))}}.bind(this));this.playlist.SoundPlayer.addEvent("positiontime",function(b,a){if(this.playlist.SoundPlayer.currentPlaylist==this.playlist&&this.playlist.currentSound.sound.url==a){this.soundtime.set("html",b)}}.bind(this));this.playlist.SoundPlayer.addEvent("play",function(){if(this.playlist.SoundPlayer.currentPlaylist==this.playlist){this.playPauseEl.set("src",this.controlImages.pause)}}.bind(this));this.playlist.SoundPlayer.addEvent("resume",function(){if(this.playlist.SoundPlayer.currentPlaylist==this.playlist){this.playPauseEl.set("src",this.controlImages.pause)}}.bind(this));this.playlist.SoundPlayer.addEvent("pause",function(){if(this.playlist.SoundPlayer.currentPlaylist==this.playlist){this.playPauseEl.set("src",this.controlImages.play)}}.bind(this));this.playlist.SoundPlayer.addEvent("stop",function(){if(this.playlist.SoundPlayer.currentPlaylist==this.playlist){this.playPauseEl.set("src",this.controlImages.play)}}.bind(this))},drawController:function(){this.addControllerElements();this.addControllerEvents()},drawUI:function(){if(this.isAppleiDevice){this.drawPlaylist()}else{this.drawController();this.drawPlaylist()}}});window.addEvent("domready",function(){if(typeof(flowerUID)=="object"){flowerUID.setModuleOptions("soundplayer",{sm2Location:flowerUID.libpath+"soundplayer/lib/soundmanager2/soundmanager2.js",sm2swfLocation:flowerUID.libpath+"soundplayer/lib/soundmanager2/swf/"});var a=flowerUID.registerModule(FlowerSoundPlayer,"soundplayer",true);a.addEvent("ready",function(){flowerUID.moduleCallback(a)})}else{}});