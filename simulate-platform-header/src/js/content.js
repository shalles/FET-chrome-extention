// console.log("come in content js");
// debugger


// console.log('content chrome', chrome);
;(function(){

// TODO: option操作动态增删改查header
var headHeightMap = {
    app: 44
};

var port = chrome.runtime.connect({name: 'content'});
port.onMessage.addListener(function(response) {
    var platform = response.platform;

    if(platform === 'reset'){
        location.reload();
        return;
    }
    // console.log(chrome.extension.getViews( { "type" : "tab" } ));
    if(/Mobile/.test(navigator.userAgent)){
        var head, body = document.body;
        var html = document.documentElement;
        var title = document.title;

        if(!(head = body.querySelector('.extention-simulate-head'))){
            head = document.createElement('div');
            head.className = 'extention-simulate-head';
            html.classList.add('extention-simulate');
            body.insertBefore(head, body.firstElementChild);
            head.addEventListener('click', function(e){
                if (e.x < 44){
                    history.back();
                } else if (e.x > (innerWidth - 48)){
                    location.reload();
                }
            })
        }

        if(platform === 'full'){
            html.classList.remove('extention-simulate');
            body.removeChild(head);
            html.style.marginTop = 0;
            html.style.height = body.style.height = innerHeight + 'px';
            return;
        }

        head.innerHTML = (title.length > 14 ? title.slice(0,12) + '...' : title) || '微信head模拟';
        head.classList.remove('weixin', 'qq', 'app', 'alipay');
        head.classList.add(platform);

        var headHeight = headHeightMap[platform] || 48;
        html.style.marginTop = headHeight + 'px';
        html.style.height = body.style.height = innerHeight - headHeight + 'px';
    }
});

})();