$(function(){
    let form = layui.form
    let root = 'http://www.liulongbin.top:3007'
    // 自定义表单验证
    form.verify({
        pwd:[
            /^[\S]{6,12}$/
            ,'密码必须6到12位，且不能出现空格'
          ],
        // value 是文本框的值 给哪个文本框添加 value的值就是文本框的值
        samePwd:function(value){
            if(value ===$('[name=oldPwd]').val()){
                return '新旧密码不能相同'
            }
        },
        rePwd:function(value){
            if(value !== $('[name=newPwd]').val()){
                return '两次密码输入不一致'
            }
        }
    })
    $('.layui-form').on('submit',function(e){
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: root+'/my/updatepwd',
            data: $(this).serialize(),
            success: function(res){
                if(res.status !==0) return layui.layer.msg('更新密码失败！')
                layui.layer.msg('更新密码成功！')
                // 设置重置表单
                $('.layer-form')[0].reset()
            }
        })
    })

})