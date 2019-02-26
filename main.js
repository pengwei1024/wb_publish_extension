document.addEventListener('DOMContentLoaded', function () {
    refresh();
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    let req = JSON.stringify(request);
    switch (req) {
        case '"refresh"':
            let data = refresh();
            sendResponse(data.title + "<br/><img src='https://wx1.sinaimg.cn/mw690/"+data.images[0]+".jpg' />");
            break;
        case '"cookie"':
            if (window.beauty_data && Array.isArray(window.beauty_data.data)) {
                let item = window.beauty_data.data[0];
                sendWB('小姐姐分享 @' + item.name, item.images);
            } else {
                alert('参数错误');
            }
            break;
        default:
            break;
    }
    console.log('finish');
    // sendResponse('我是popup，我已收到你的消息：' + req);
});

/**
 * 从服务器获取图片和标题等信息
 * @param callback
 * @returns {*}
 */
function refresh(callback) {
    $.ajax({
        url: 'http://localhost/BeautifulGirl/index.php/local/get',
        async:false,
        success: (data) => {
            if (typeof data === "string") {
                data = JSON.parse(data);
            }
            console.log(data);
            if (data.code === 200) {
                window.beauty_data = data;
                if (callback) {
                    callback(data.data[0]);
                }
            } else {
                alert(data.msg);
            }
        },
        error: (xhr, status, error) => {
            console.error(xhr, status, error);
        }
    });
    console.log('window.beauty_data', window.beauty_data);
    return window.beauty_data.data[0];
}

/**
 * 发送微博
 * @param title 标题
 * @param imageArray 图片id数组  // ['006cZ2iWgy1fp9a4cgiyrj30rs19g7wh','006cZ2iWgy1fp9a4bakqwj30oy0hfk3p','006cZ2iWgy1fp9a4bzd9aj30rq0rrqnz']
 */
function sendWB(title, imageArray) {
    let image = imageArray.join('|');
    $.ajax({
        url: 'https://weibo.com/aj/mblog/add?ajwvr=6&__rnd=1536327309563',
        type: 'POST',
        data: `location=v6_content_home&text=${title}&appkey=&style_type=1&pic_id=${image}&tid=&pdetail=&mid=&isReEdit=false&gif_ids=&rank=0&rankid=&module=stissue&pub_source=main_&updata_img_num=${imageArray.length}&pub_type=dialog&isPri=null&_t=0`,
        complete: function (data) {
            alert(JSON.stringify(data));
        },
    })
}