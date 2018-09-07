document.addEventListener('DOMContentLoaded', function () {
    // 从服务器获取图片和标题等信息
    $.ajax({
        url: 'http://localhost/BeautifulGirl/index.php/local/get',
        success: (data) => {
            if (data.code === 200) {
                window.beauty_data = data;
            } else {
                alert(data.msg);
            }
        },
        error: (error) => {
            alert(error);
        }
    });
});


chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    let req = JSON.stringify(request);
    switch (req) {
        case '"cookie"':
            if (window.beauty_data && Array.isArray(window.beauty_data.data)) {
                let item = window.beauty_data.data[0];
                alert(JSON.stringify(item));
                sendWB('小姐姐分享 @' + item.name, item.images);
            } else {
                alert('参数错误');
            }
            break;
        default:
            break;
    }
    // sendResponse('我是popup，我已收到你的消息：' + req);
});

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