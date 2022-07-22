// Variable global d'audio
var audio;

function injecta() {
  var identificador=location.href.match(/^\d+|\d+\b|\d+(?=\w)/g)[0];
    
    let req = new XMLHttpRequest();
    
    var basedades;
    
    req.onreadystatechange = () => {
      if (req.readyState == XMLHttpRequest.DONE) {

        basedades=req.responseText;
        basedades=JSON.parse(basedades);
        var trobat=1;
        try {
          const adreca = basedades[0].audio;
        }
        catch (error) {
          trobat=0;
          console.log("contingut no trobat a la base de dades");
        }
        finally{
          if (trobat==1){
            console.log("contingut sí trobat a la base de dades");

            // Carregar dades
            const adreca = basedades[0].audio;
            const desf=parseFloat(basedades[0].desf);
            const videoPlayer = netflix.appContext.state.playerApp.getAPI().videoPlayer;
            const player = videoPlayer.getVideoPlayerBySessionId(videoPlayer.getAllPlayerSessionIds()[0]);
            audio = new Audio(adreca);

            // Reproducció i pausa segures
            var promesa;
            function repro(){
              promesa = audio.play();
            };
            function pausase(){
              if (promesa !== undefined) {
                promesa.then(_ => {
                  audio.pause();
                })
              }
            }

            // Events
            player.addEventListener("currenttimechanged", () => {if (Math.abs(audio.currentTime - (player.getCurrentTime()/1000 + desf)) > 0.2) audio.currentTime = player.getCurrentTime()/1000 + desf});
            player.addEventListener("playingchanged", () => {if (player.isPaused()) pausase(); else if(player.isMuted()){repro()}});
            player.addEventListener("mutedchanged", () => {if (player.isMuted()) {audio=new Audio(adreca); if(!player.isPaused()){repro()}} else pausase()});
            
            // Mutejar a l'iniciar
            if (player.isMuted()){
              promesa = audio.play();
            } else{
              player.setMuted(1);
            }

            // Posar V.O.
            setTimeout(function(){
              const trackList = player.getAudioTrackList();
              var idioma=0;
              function posarvo(){
                if (trackList[idioma].isNative){
                  player.setAudioTrack(trackList[idioma]);
                }
                else{
                  idioma=idioma+1;
                  posarvo();
                }
              }
              posarvo();
            }, 1000);
          }
        }
      }
    };
    
    // Consultar base de dades
    req.open("GET", "https://api.jsonbin.io/v3/b/62ab4c675c2a444a2d8c7303/latest", true);
    req.setRequestHeader("X-Access-Key", "$2b$10$V5KbCVo8rGFLobLQauuOQuqxzKW9vFzYW4fWNyjMQ0Drna3.udebW");
    req.setRequestHeader("X-JSON-Path", "$..[?(@.codi==" + identificador + ")]");
    req.setRequestHeader("X-Bin-Meta", "false");
    req.send();
}

// Ordre de buscar doblatge en català
function intenta() {
  var acert=1;
  try {
    const videoPlayer = netflix.appContext.state.playerApp.getAPI().videoPlayer;
    const player = videoPlayer.getVideoPlayerBySessionId(videoPlayer.getAllPlayerSessionIds()[0]);
  } catch (error) {
    acert=0;
  } finally {
    if (acert==0){
      intenta();
    } else {
      injecta();
    }
  }
}

// Si s'obre una pàgina d'inici es busca doblatge immediatament
var expressio = /\bnetflix.com\/watch\/\b/g
if (window.location.href.match(expressio)=="netflix.com/watch/"){
  intenta();
};

// Cada segon consulta si s'ha canviat de pàgina
var anterior=window.location.href;
setInterval(function(){
  if(anterior!=window.location.href){
    anterior = window.location.href;
    if (window.location.href.match(expressio)=="netflix.com/watch/"){
      try {
        audio.pause();
      } catch (error) {} finally {
        intenta();
      }
    } else {
      try {
        audio.pause();
      } catch (error) {}
    }
  }
}, 1000);