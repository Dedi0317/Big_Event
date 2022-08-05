$(function(){

    let root = 'http://www.liulongbin.top:3007'
    // 1.1 获取裁剪区域的 DOM 元素
    let $image = $('#image')
    // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }

    // 1.3 创建裁剪区域
    $image.cropper(options)

    //上传图片事件
    $('#btnChooseImage').on('click',function(){
        console.log('debug');
        $('#file').click()
    })
    // 点击确定上传
    $('#btnUpload').on('click',function(){
        console.log('debug');
        // 1.拿到用户裁剪之后的头像
        let dataURL = $image.cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
        width: 100,
        height: 100
      }).toDataURL('image/png')       // 将 Canvas 画布上的内容，转化为 base64 格式的字符串
        // 2.调用请求更换头像
        $.ajax({
            method: 'POST',
            url: root + '/my/update/avatar',
            data: {
                avatar: dataURL
            },
            success: function(res){
                if(res.status !==0) return layui.layer.msg('更换头像失败！')
                layui.layer.msg('更新头像成功!')
                // 更换成功了就要改头像了
                window.parent.getUserInfo()
            }
        })
    })
})