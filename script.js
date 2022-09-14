fetch("https://raw.githubusercontent.com/pelcatala/titolscat/main/titolsext.json")
  .then((response) => response.json())
  .then((data) => {

    // Variable global codis
    var codis = data;

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
                let primer = 1;
                const adreca = basedades[0].audio;
                const desf = parseFloat(basedades[0].desf);
                const videoPlayer = netflix.appContext.state.playerApp.getAPI().videoPlayer;
                const player = videoPlayer.getVideoPlayerBySessionId(videoPlayer.getAllPlayerSessionIds()[0]);
                player.pause();
                audio = new Audio(adreca);
                audio.preload="none";

                // Reproducció i pausa segures
                var promesa;
                function repro() {
                  if (primer != 1) {
                    promesa = audio.play();
                  };
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
                player.addEventListener("playingchanged", () => { if (player.isPaused()) pausase(); else if (player.isMuted()) { primer = 0; repro() } });
                player.addEventListener("mutedchanged", () => { if (player.isMuted()) { audio = new Audio(adreca); if (!player.isPaused()) { repro() } } else pausase() });


                // Mutejar a l'iniciar
                if (player.isMuted()) {
                  //promesa = audio.play();
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
                    else if (idioma < trackList.length - 1) {
                      idioma = idioma + 1;
                      posarvo();
                    }
                  }
                  posarvo();
                }, ((Math.random() * 10) + 5) * 100);
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
          if (typeof player === "undefined") {
            acert = 0;
          } else {
            acert = 1;
          }
          player.play();
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
    } else {
      titolscat();
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
          } catch (error) { } finally {
            titolscat();
          }
        }
      }
    }, 1000);

    // Funció que afegeix al catàleg l'indicador de contingut en català
    function titolscat() {
      let url = 'https://raw.githubusercontent.com/pelcatala/titolscat/main/titolscat.json';
      var tagradaria = document.createElement("img")
      tagradaria.src = "https://raw.githubusercontent.com/pelcatala/titolscat/main/indicador.png";
      tagradaria.setAttribute("height", "48px")
      tagradaria.setAttribute("class", "imgdisp")
      tagradaria.style.position = "absolute";
      tagradaria.style.top = "0px";
      tagradaria.style.right = "0px";

      fetch(url)
        .then(res => res.json())
        .then(out => {
          var codis = out;

          function runFunction() {
            var encatala = document.getElementsByClassName("slider-refocus")

            for (let disp in encatala) {
              if (encatala[disp].childNodes?.length) {
                for (var i = 0; i < encatala[disp].childNodes.length; i++) {
                  if (encatala[disp].childNodes[i].className == "imgdisp") {
                    break;
                  } else if (i == encatala[disp].childNodes.length - 1) {
                    var codi = encatala[disp].pathname.match(/^[^\d]*(\d+)/)[1]
                    let disponible = codis.find(el => el.codi === codi.toString());
                    if (disponible != null) {
                      encatala[disp].appendChild(tagradaria.cloneNode(true));
                    }
                  }
                }
              }
            }
          }
          var t = setInterval(runFunction, 1000);
        });
    };
  });