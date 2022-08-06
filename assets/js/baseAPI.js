// 每次调用$.get $.post $.ajax 
// 都会先调用 ajaxPrefilter 函数
// 在这个函数中可以拿到ajax提供的配置对象
$.ajaxPrefilter(function(options){
    if(options.url.indexOf('/my')!==-1){
        // 统一为有权限的接口，设置headers请求头
        options.headers ={
            Authorization: localStorage.getItem('token') || ''
        }
    }
     // 无论请求成功or失败 都会调用这个回调函数
     options.complete =function(res){
        console.log(res);
        if(res.responseJSON.status ===1 && res.responseJSON.message === '身份认证失败！'){
            //强制清空token
            // 强制跳转
            localStorage.removeItem('token')
            // location.href='/login.html'
        }
    }
    
})