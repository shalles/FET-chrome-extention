'use strict';

chrome.runtime.onInstalled.addListener(function (details) {
    console.log('previousVersion', details.previousVersion);
});

var curentTab = 0;
function setIcon(platform){
    var iconPath;
    if (!platform || platform === 'reset') {
        iconPath = 'src/img/icon.png'
    } else {
        iconPath = 'src/img/icon.work.png'
    }
    chrome.browserAction.setIcon({
        // tabId: curentTab,
        path: iconPath
    }, function(){
        // console.log('icon:');
    });
}

function sendMessage(port, msg){
    chrome.tabs.get(port.sender.tab.id, function(tab){
        // console.log('get tab:', tab);
        if(tab.selected){
            port.postMessage(msg);
            setIcon(msg.platform);
        }
    });
}

chrome.runtime.onConnect.addListener(function(port) {
    if(port.name === 'content') {
        function contentMessage(msg){
            // console.log(msg, port); // console.log(chrome);
            localStorage.platform = msg;
            
            sendMessage(port, {
                platform: msg,
                tabId: curentTab
            })
        }
        port.onDisconnect.addListener(function(){
            console.log(port.sender.url, ' disconnect');
            if(chrome.runtime.onMessage.hasListener(contentMessage)){
                chrome.runtime.onMessage.removeListener(contentMessage);
                // console.log('remove old contentMessage Listener');
            }
        });
        // if(!chrome.runtime.onMessage.hasListener(contentMessage)){
        chrome.runtime.onMessage.addListener(contentMessage);
        console.log('new connecter: ', port.sender.url);
        // }

        if(localStorage.platform !== 'reset'){
            sendMessage(port, {
                platform: localStorage.platform,
                tabId: curentTab
            })
        }

    }
});

chrome.tabs.onSelectionChanged.addListener(function(tab) {
    curentTab = tab;
});