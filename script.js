// Variable global codis
var codis = [{ "codi": "81033447" }, { "codi": "81033448" }, { "codi": "81033449" }, { "codi": "81033450" }, { "codi": "81033451" }, { "codi": "81033452" }, { "codi": "81033453" }, { "codi": "81033454" }, { "codi": "81033455" }, { "codi": "81033456" }, { "codi": "81033457" }, { "codi": "81033458" }, { "codi": "81033459" }, { "codi": "81033460" }, { "codi": "81033461" }, { "codi": "81033462" }, { "codi": "81033463" }, { "codi": "81033464" }, { "codi": "81033465" }, { "codi": "81033466" }, { "codi": "81033467" }, { "codi": "81033468" }, { "codi": "81033469" }, { "codi": "81033470" }, { "codi": "81033471" }, { "codi": "81033472" }, { "codi": "81033473" }, { "codi": "80001307" }, { "codi": "80001308" }, { "codi": "80001309" }, { "codi": "80001310" }, { "codi": "80001311" }, { "codi": "80001312" }, { "codi": "80001313" }, { "codi": "80001314" }, { "codi": "80001315" }, { "codi": "80001316" }, { "codi": "80001317" }, { "codi": "80001318" }, { "codi": "80001319" }, { "codi": "80001320" }, { "codi": "80001321" }, { "codi": "80001322" }, { "codi": "80001323" }, { "codi": "80001324" }, { "codi": "80001325" }, { "codi": "80001326" }, { "codi": "80001327" }, { "codi": "80001328" }, { "codi": "80001329" }, { "codi": "80001330" }, { "codi": "80001331" }, { "codi": "80001332" }, { "codi": "70176016" }, { "codi": "70176017" }, { "codi": "70176018" }, { "codi": "70176019" }, { "codi": "70176020" }, { "codi": "70176021" }, { "codi": "70176022" }, { "codi": "70176023" }, { "codi": "70176024" }, { "codi": "70176025" }, { "codi": "70176026" }, { "codi": "70176027" }, { "codi": "70176028" }, { "codi": "70176029" }, { "codi": "70176030" }, { "codi": "70176031" }, { "codi": "70176032" }, { "codi": "70176033" }, { "codi": "70176034" }, { "codi": "70176035" }, { "codi": "70176036" }, { "codi": "70176037" }, { "codi": "70176038" }, { "codi": "70176039" }, { "codi": "70176040" }, { "codi": "70176041" }, { "codi": "70149050" }, { "codi": "70149051" }, { "codi": "70149052" }, { "codi": "70149053" }, { "codi": "70149054" }, { "codi": "70149055" }, { "codi": "70149056" }, { "codi": "70149057" }, { "codi": "70149058" }, { "codi": "70149059" }, { "codi": "70149060" }, { "codi": "70149061" }, { "codi": "70149062" }, { "codi": "70149063" }, { "codi": "70149064" }, { "codi": "70149065" }, { "codi": "70149066" }, { "codi": "70149067" }, { "codi": "70149068" }, { "codi": "70149069" }, { "codi": "70149070" }, { "codi": "70149071" }, { "codi": "70149072" }, { "codi": "70149073" }, { "codi": "70149074" }, { "codi": "70149075" }, { "codi": "70244169" }, { "codi": "70244170" }, { "codi": "70244171" }, { "codi": "70244172" }, { "codi": "70244173" }, { "codi": "70244174" }, { "codi": "70244175" }, { "codi": "70244176" }, { "codi": "70244177" }, { "codi": "70244178" }, { "codi": "70244179" }, { "codi": "70244180" }, { "codi": "70244181" }, { "codi": "70244182" }, { "codi": "70244183" }, { "codi": "70244184" }, { "codi": "70244185" }, { "codi": "70244186" }, { "codi": "70244187" }, { "codi": "70244188" }, { "codi": "70244189" }, { "codi": "70244190" }, { "codi": "70244191" }, { "codi": "70244192" }, { "codi": "70244193" }, { "codi": "70244194" }, { "codi": "60032294" }, { "codi": "18171022" }, { "codi": "70196252" }, { "codi": "660954" }, { "codi": "60022398" }];

// Variable global d'audio
var audio;

function injecta() {

  // Buscar si està disponible
  var identificador = location.href.match(/^\d+|\d+\b|\d+(?=\w)/g)[0];
  let disponible = codis.find(el => el.codi === identificador.toString());
  if (disponible == null) {
    console.log("contingut no disponible")
  } else {
    // Sol·licitud servidor
    let req = new XMLHttpRequest();
    var basedades;
    req.onreadystatechange = () => {
      if (req.readyState == 4) {

        // Interpretar resposta
        basedades = req.responseText;
        basedades = JSON.parse(basedades);
        var trobat = 1;
        try {
          const adreca = basedades[0].audio;
        }
        catch (error) {
          trobat = 0;
          console.log("contingut no trobat a la base de dades");
        }
        finally {
          if (trobat == 1) {
            console.log("contingut sí trobat a la base de dades");

            // Carregar dades
            const adreca = basedades[0].audio;
            const desf = parseFloat(basedades[0].desf);
            const videoPlayer = netflix.appContext.state.playerApp.getAPI().videoPlayer;
            const player = videoPlayer.getVideoPlayerBySessionId(videoPlayer.getAllPlayerSessionIds()[0]);
            audio = new Audio(adreca);

            // Reproducció i pausa segures
            var promesa;
            function repro() {
              promesa = audio.play();
            };
            function pausase() {
              if (promesa !== undefined) {
                promesa.then(_ => {
                  audio.pause();
                })
              }
            }

            // Events
            player.addEventListener("currenttimechanged", () => { if (Math.abs(audio.currentTime - (player.getCurrentTime() / 1000 + desf)) > 0.2) audio.currentTime = player.getCurrentTime() / 1000 + desf });
            player.addEventListener("playingchanged", () => { if (player.isPaused()) pausase(); else if (player.isMuted()) { repro() } });
            player.addEventListener("mutedchanged", () => { if (player.isMuted()) { audio = new Audio(adreca); if (!player.isPaused()) { repro() } } else pausase() });


            // Mutejar a l'iniciar
            if (player.isMuted()) {
              promesa = audio.play();
            } else {
              player.setMuted(1);
            }

            // Posar V.O.
            setTimeout(function () {
              const trackList = player.getAudioTrackList();
              var idioma = 0;
              function posarvo() {
                if (trackList[idioma].isNative) {
                  player.setAudioTrack(trackList[idioma]);
                }
                else {
                  idioma = idioma + 1;
                  posarvo();
                }
              }
              posarvo();
            }, 1000);
          }
        }
      }
    }

    // Consultar base de dades
    req.open("GET", "https://www.hybrid-ware.com/netflix", true);
    req.setRequestHeader("X-Access-Key", "$2b$10$V5KbCVo8rGFLobLQauuOQuqxzKW9vFzYW4fWNyjMQ0Drna3.udebW");
    req.setRequestHeader("X-JSON-Path", identificador);
    req.setRequestHeader("X-Bin-Meta", "false");
    req.send();
  }
}

// Ordre de buscar doblatge en català
function intenta() {
  setTimeout(function () {
    var acert = 0;
    try {
      const videoPlayer = netflix.appContext.state.playerApp.getAPI().videoPlayer;
      const player = videoPlayer.getVideoPlayerBySessionId(videoPlayer.getAllPlayerSessionIds()[0]);
      if (player.isReady) { acert = 1 };
    } catch (error) {
      acert = 0;
    } finally {
      if (acert == 0) {
        intenta();
      } else {
        injecta();
      }
    }
  }, 100);
}

// Si s'obre una pàgina d'inici es busca doblatge immediatament
var expressio = /\bnetflix.com\/watch\/\b/g
if (window.location.href.match(expressio) == "netflix.com/watch/") {
  intenta();
};

// Cada segon consulta si s'ha canviat de pàgina
var anterior = window.location.href;
setInterval(function () {
  if (anterior != window.location.href) {
    anterior = window.location.href;
    if (window.location.href.match(expressio) == "netflix.com/watch/") {
      try {
        audio.pause();
      } catch (error) { } finally {
        intenta();
      }
    } else {
      try {
        audio.pause();
      } catch (error) { }
    }
  }
}, 1000);