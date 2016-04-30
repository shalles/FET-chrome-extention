// console.log("come in content js");
// debugger


// console.log('content chrome', chrome);
;(function(){
// TODO: option操作动态增删改查header
var headHeightMap = {
    app: 44
};

var iosCom = {
    status_bar: 24,
    header: 40
};
var adrCom = {
    status_bar: 25,
    header: 48
};
var headmap = {
    ios: {
        weixin: iosCom,
        alipay: iosCom,
        qq: iosCom,
        app: iosCom
    },
    adr: {
        weixin: adrCom,
        alipay: adrCom,
        qq: adrCom,
        app: {
            status_bar: adrCom.status_bar,
            header: 40
        }
    }
}

var colorMap = {
    weixin: ['#373b3e', '#fff'],
    alipay: ['#373b3e', '#fff'],
    qq: ['#11b5f2', '#fff'],
    app: ['#fafafa', '#666']
}

function getTime(){
    function format(num){
        return num < 10 ? '0' + num : num;
    }
    var now = new Date(); 

    return format(now.getHours()) + ':' + format(now.getMinutes());
}

function getBytesLen(str) {
    return str ? str.length + str.replace(/[\u0000-\u00ff]/g, "").length : 0;
}

function clickHandler(e){
    // console.log(e.y)
    if(e.y < 24){
        if (e.x < 110){
            // location.href = ''
        }
    } else {
        if (e.x < 44){
            history.back();
        } else if (e.x > (innerWidth - 48)){
            location.reload();
        }
    }
}

var body = document.body;
var html = document.documentElement;
var title = document.title;

var port = chrome.runtime.connect({name: 'content'});

port.onMessage.addListener(function(response) {

    var platform = response.platform;

    if(!platform) return;

    if(platform === 'reset'){
        location.reload();
        return;
    }

    var ua = navigator.userAgent;
    var os = /(android)/i.test(ua) && 'adr' || /(iphone|ipod|ios|ipad)/i.test(ua) && 'ios' || /(windows phone)/i.test(ua) && 'wp' || 'adr'

    // console.log(chrome.extension.getViews( { "type" : "tab" } ));
    if(/Mobile/.test(ua)){

        var componentEle;

        if(componentEle = body.querySelector('.extention-simulate-head')){
            componentEle.removeEventListener('click', clickHandler, false);
            body.removeChild(componentEle);
        }

        if(platform === 'full'){
            html.classList.remove('extention-simulate');
            html.style.marginTop = 0;
            html.style.height = body.style.height = innerHeight + 'px';
            return;
        }

        var shadowRoot, headerEle, statusBarEle;
        var map = headmap[os][platform];
        var clrArr = colorMap[platform];
        var componentHeight = map.status_bar + map.header;

        componentEle = document.createElement('div');
        componentEle.className = 'extention-simulate-head';
        
        var comCss = 'position: absolute; top: 0; bottom: 0; margin: auto 0;'

        // status bar
        statusBarEle = document.createElement('div');
        statusBarEle.className = 'status-bar';
        statusBarEle.style.cssText = 'position: relative; height: '+ map.status_bar +'px; line-height: '+ map.status_bar +'px; font-size: 12px; overflow: hidden;text-align: center;'
        statusBarEle.innerHTML = 
            '<span class="back" style="float: left; width: 110px; margin-left: 6px; text-align: left;">\
                <i style="display: inline-block; margin: 0; width: 0; height: 0; margin-bottom: -1px; border: solid '+clrArr[1]+' 6px; border-left: 0; border-color: transparent '+clrArr[1]+' transparent transparent;"></i> Back to 滴滴出行\
            </span>\
            <span class="battery" style="float: right; width: 110px; text-align: right; margin-right: 8px;">\
                100% \
                <i style="display: inline-block; position: relative; top: -1px; width: 20px; height: 6px; margin: 0; background-color: '+clrArr[1]+';">\
                    <i style="' + comCss + ' left: -2px; width: 22px; height: 8px; border: solid 1px '+clrArr[1]+'; border-radius:1px;"></i>\
                    <i style="' + comCss + ' right: -4px; width: 2px; height: 4px; background-color: '+clrArr[1]+';"></i>\
                </i>\
            </span>\
            <div class="time">' +
                getTime() +
            '</div>';

        // header
        headerEle = document.createElement('div');
        headerEle.className = 'header';
        headerEle.style.cssText = 'position: relative; bottom: 0; height: '+ map.header +'px; line-height: '+ map.header +'px;';
        
        var backEle = document.createElement('a');
        backEle.style.cssText = comCss + ' left: 20px; width: 12px; height: 12px; border: solid '+clrArr[1]+' 0; border-width: 2px 0 0 2px; -webkit-transform: rotate(-45deg); transform: rotate(-45deg);';
        headerEle.appendChild(backEle);

        var shareEle = document.createElement('a');
        shareEle.style.cssText = comCss + ' right: 20px; width: 4px; height: 24px; background-size: 4px 8px; background-image: linear-gradient(transparent 50%, '+clrArr[1]+' 50%, '+clrArr[1]+'); background-position: center -1px;';
        headerEle.appendChild(shareEle);

        var titleEle = document.createElement('span');
        titleEle.className = 'title';
        titleEle.style.cssText = comCss + 'left:0; right: 0;'
        titleEle.innerHTML = (getBytesLen(title) > 18 ? title.slice(0,16) + '...' : title) || '微信header模拟';
        headerEle.appendChild(titleEle);

        componentEle.addEventListener('click', clickHandler);

        if (Element.prototype.createShadowRoot){
            shadowRoot = componentEle.createShadowRoot();
            shadowRoot.appendChild(statusBarEle);
            shadowRoot.appendChild(headerEle);
        } else {
            componentEle.appendChild(statusBarEle);
            componentEle.appendChild(headerEle);
        }

        html.classList.add('extention-simulate');
        body.insertBefore(componentEle, body.firstElementChild);
        // }

        // headerEle.style.cssText = 'position: relative; bottom: 0; height: '+ map.header +'px; line-height: '+ map.header +'px;';
        // statusBarEle.style.cssText = 'position: relative; height: '+ map.status_bar +'px; line-height: '+ map.status_bar +'px; font-size: 12px; overflow: hidden;text-align: center;'

        // titleEle.innerHTML = (getBytesLen(title) > 18 ? title.slice(0,16) + '...' : title) || '微信header模拟';

        componentEle.style.backgroundColor = clrArr[0];
        componentEle.style.color = clrArr[1];
        html.style.marginTop = componentHeight + 'px';
        html.style.height = body.style.height = innerHeight - componentHeight + 'px';
    }
});

})();