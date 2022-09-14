// Comprovar si s'instal·la per primer cop
chrome.runtime.onInstalled.addListener(function(details){
    if(details.reason == "install"){
        chrome.tabs.create({url: "https://pelcatala.notion.site/Benvingut-0b44adac3ff54838b825eb2cc4e6b7ab"});
    }
});