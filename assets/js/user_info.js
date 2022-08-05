$(function(){
    let form =layui.form
    let root ='http://www.liulongbin.top:3007'
    form.verify({
        nickname: function(value){
            if(value.length >6) return '昵称长度必须在1~6个字符之间'
        }
    })
    initUserInfo()
    // 初始化用户的基本信息
    function initUserInfo(){
        $.ajax({
            method: 'GET',
            url: root+'/my/userinfo',
            success: function(res){
                if(res.status!==0) return layui.layer.msg('获取用户信息失败！')
                layui.layer.msg('获取用户信息成功！')
                // 调用form.val（）快速给表单赋值取值
                // 前提是需要给form 加lay-filter属性
                console.log(res);
                form.val('formUserInfo',res.data)
            }
        })
    }
    // 重置表单数据
    $('#btnReset').on('click',function(e){
        // 默认重置会把表单内容清空
        e.preventDefault()
        initUserInfo()
    })
    // 监听提交更新
    $('.layui-form').on('submit',function(e){
        // 阻止表单默认提交
        e.preventDefault()
        // 发起更新请求
        $.ajax({
            method: 'POST',
            url: root +'/my/userinfo',
            data:$(this).serialize(),
            success: function(res){
                if(res.status !==0) return layui.layer.msg('更新用户的信息失败！')
                layui.layer.msg('更新信息成功！')
                // 调用父页面index中的方法 重新渲染头像和信息
                window.parent.getUserInfo()
            }
        })
    })
})