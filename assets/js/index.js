
$(function(){
    // 获取用户基本信息
    getUserInfo()
    // 绑定退出的点击事件
    $('#btnLogout').on('click',function(){
        console.log('ok');
        // 弹出确认退出吗
        layer.confirm('确定退出登录？', {icon: 3, title:'提示'}, 
        function(index){
            //do something
            console.log('ok');
            // 1.清空本地存储中的token 2.跳转到登录页
            localStorage.removeItem('token')
            location.href='./login.html' 
            //  关闭询问框
            layer.close(index);
        });
    })
})

// 获取用户的基本信息
function getUserInfo(){
    let root ='http://www.liulongbin.top:3007'
    $.ajax({
        method: 'GET',
        url: root+'/my/userinfo',
        // 请求头
        // headers: {
        // Authorization: localStorage.getItem('token') || ''
        // },
        success: function(res){
            if(res.status !==0) {
                return  layui.layer.msg('获取用户信息失败！')
            }
            console.log(res);
            layui.layer.msg('获取信息成功！')
            // 渲染用户头像
            renderAvatar(res.data)
        },
        // 无论请求成功or失败 都会调用这个回调函数
        // complete: function(res){
        //     console.log(res);
        //     if(res.responseJSON.status ===1 && res.responseJSON.message === '身份认证失败！'){
        //         //强制清空token
        //         // 强制跳转
        //         localStorage.removeItem('token')
        //         location.href='/login.html'
        //     }
        // }
    })
}
// 渲染用户头像
function renderAvatar(user){
    // 1.用户有nickname 就用nickname 
    let name =user.nickname ||user.username
    // 2.设置欢迎的文本
    $('#welcome').html(`欢迎  ${name}`)
    // 3.按需渲染头像
    if(user.user_pic !==null){
        // 3.1 渲染图片头像
        $('.layui-nav-img').attr('src',user.user_pic).show()
        $('.text-avatar').hide()
   }else{
        // 3.2渲染文字头像
        $('.layui-nav-img').hide()
        let first =name[0].toUpperCase()
        $('.text-avatar').html(first).show()
    }
}