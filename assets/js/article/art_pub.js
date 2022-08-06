$(function(){
    let layer = layui.layer
    let root = 'http://www.liulongbin.top:3007'
    let form = layui.form
    let laypage = layui.laypage
    let art_state = '已发布'
    initCate()
    // 初始化富文本编辑器
    initEditor()
    //定义加载文章分类的方法
    function initCate(){
        $.ajax({
            method: 'GET',
            url: root+'/my/article/cates',
            success:function(res){
                if(res.status!==0) return layer.msg('请求加载文章分类失败！')
                layer.msg('加载成功！')
                // 调用模板引擎 渲染下拉菜单
                let htmlStr = template('tpl-cate',res)
                $('[name=cate_id]').html(htmlStr)
                // 一定要记得调用form.render() 不然是没有效果的
                form.render()
            }
        })
    }
    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)


    // 为选择封面的按钮，绑定点击事件
    $('#btnChooseImage').on('click',function(){
        $('#coverFile').click()
    })
    // 监听coverFile的change事件，获取用户选择的文件列表
    $('#coverFile').on('change',function(e){
        let files = e.target.files[0]
        console.log(files);
        // 用户没有选择文件
        if(files.length ===0)   return 
        let newImgURL = URL.createObjectURL(files)
        // 先销毁旧的裁剪区域，再重新设置图片路径，之后再创建新的裁剪区域
        $image
        .cropper('destroy')      // 销毁旧的裁剪区域
        .attr('src', newImgURL)  // 重新设置图片路径
        .cropper(options)        // 重新初始化裁剪区域
    })
    // 点击草稿按钮
    $('#btnSave2').on('click',function(){
        art_state ='草稿'
    })
    // 为表单绑定submit事件
    $('#form-pub').on('submit',function(e){
        e.preventDefault()
        // 基于form表单快速创建formdata对象
        let fd = new FormData($(this)[0])
        fd.append('state',art_state)
        //  将封面裁剪后的图片输出为文件
        $image
        .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
            width: 400,
            height: 280
        })
        .toBlob(function(blob) {       // 将 Canvas 画布上的内容，转化为文件对象
            // 得到文件对象后，进行后续的操作
            fd.append('cover_img',blob)
        })
        console.log(fd);
        // 发起发布文章的请求
        publishArticle(fd)
    })
    // 发布文章的方法
    function publishArticle(fd){
        $.ajax({
            method: 'POST',
            url: root+ '/my/article/add',
            data:fd,
            // 注意如果对服务器提交的是formdata的格式
            // 必须添加如下
            contentType:false,
            processData:false,
            success: function(res){
                if(res.status !==0) return layer.msg('发布文章失败！')
                layer.msg('发布文章成功!')
                location.href='/article/art_list.html'
            }
        })
    }
})