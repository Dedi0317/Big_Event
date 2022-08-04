$(function(){
    let root ='http://www.liulongbin.top:3007'
    // 点击去注册账号的链接
    $('#link_reg').on('click',function(){
        $('.login-box').hide()
        $('.reg-box').show()
    })
    // 点击“去登陆”的链接
    $('#link_login').on('click',function(){
        $('.login-box').show()
        $('.reg-box').hide()
    })
    // 从layui中获取form对象
    let form = layui.form
    let layer = layui.layer
    // 自定义校验规则
    form.verify({
        pwd: [/^[\S]{6,12}$/,'密码必须6到12位，且不能出现空格'] ,
        repwd: function(value){
            //通过形参拿到的是确认密码框中的内容
            //需要再比较一遍
            let pwd = $('.reg-box [name=password]').val()

            if(pwd !==value){
                return '两次密码不一致'
            }
        }
    })
    // 监听注册表单的提交事件
    $('#form-reg').on('submit',function(e){
        // 阻止默认行为
        e.preventDefault()
        // 发起post请求 提交表单
        let data ={username: $('#form-reg [name=username]').val(),password:$('#form-reg [name=password]').val()}
        $.post(root+'/api/reguser',data,function(res){
            if(res.status !==0) return layer.msg(res.message)
            layer.msg("注册成功！")
            // 模拟点击进入登录界面
            $('#link_login').click()
        })
    })
    // 监听登录表单的提交
    $('#form-login').on('submit',function(e){
        e.preventDefault()
        $.ajax({
            url:  root+'/api/login',
            method: 'POST',
            // 快速获取表单中的数据
            data: $(this).serialize(),
            success: function(res){
                if(res.status !==0) return layer.msg('登录失败！')
                layer.msg('登录成功！')
                // 将得到的token保存到缓存
                localStorage.setItem('token',res.token)
                console.log(res.token);
                // 跳转到后台主页
                location.href = '/index.html'
            }
        })
    })

})