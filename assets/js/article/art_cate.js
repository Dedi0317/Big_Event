$(function(){
    let layer = layui.layer
    let root = 'http://www.liulongbin.top:3007'
    let form = layui.form
    initArtCateList()
    // 获取文章分类的列表
    function initArtCateList(){
        $.ajax({
            method: 'GET',
            url: root +'/my/article/cates',
            success: function(res){
                console.log(res);
                let htmlStr = template('tpl-table',res)
                $('tbody').html(htmlStr)
            }
        })
    }
    let indexAdd =null
    // 为添加类别按钮绑定事件
    $('#btnAddCate').on('click',function(){
        indexAdd = layer.open({
            type: 1
            ,area: ['500px','250px']
            ,title: '添加文章分类'
            ,content: `
            <form class="layui-form" action="" id="form-add">
                <div class="layui-form-item">
                <label class="layui-form-label">分类名称</label>
                <div class="layui-input-block">
                    <input type="text" name="name" required  lay-verify="required" placeholder="请输入分类名称" autocomplete="off" class="layui-input">
                </div>
                </div>
                <div class="layui-form-item">
                    <label class="layui-form-label">分类别名</label>
                    <div class="layui-input-block">
                    <input type="text" name="alias" required  lay-verify="required" placeholder="请输入分类别名" autocomplete="off" class="layui-input">
                    </div>
                </div>
                <div class="layui-form-item">
                    <div class="layui-input-block">
                    <button class="layui-btn" lay-submit lay-filter="formDemo">确认添加</button>
                    <button type="reset" class="layui-btn layui-btn-primary">重置</button>
                    </div>
                </div>
            </form>
            `
          });  
    })
    // 通过代理的形式 为 formp-add表单绑定submit事件 因为这个添加弹出层是点了按钮才动态加载的
    // 如果直接绑定 是找不到元素的
    $('body').on('submit','#form-add',function(e){
        e.preventDefault()
        console.log('debug');
        // 发起添加文章类别请求
        $.ajax({
            method: 'POST',
            url: root+'/my/article/addcates',
            data: $(this).serialize(),
            success: function(res){
                console.log(res);
                if(res.status !==0) return layer.msg("添加文章类别失败！")
                layer.msg("添加文章类别成功！")
                initArtCateList()
                layer.close(indexAdd)
            }
        })
    })
    let indexEdit =null
    // 通过代理为编辑绑定事件
    $('tbody').on('click','.btn-edit',function(){
        console.log('ok');
        // 弹出修改文章分类信息的层
        indexEdit = layer.open({
            type: 1
            ,area: ['500px','250px']
            ,title: '修改文章分类'
            ,content: `
            <form class="layui-form" action="" id="form-edit" lay-filter="form-edit">
                <!-- 隐藏域保存ID的值 -->
                <input type="hidden" name="Id">
                <div class="layui-form-item">
                    <label class="layui-form-label">分类名称</label>
                    <div class="layui-input-block">
                    <input type="text" name="name" required  lay-verify="required" placeholder="请输入分类名称" autocomplete="off" class="layui-input">
                    </div>
                </div>
                <div class="layui-form-item">
                    <label class="layui-form-label">分类别名</label>
                    <div class="layui-input-block">
                        <input type="text" name="alias" required  lay-verify="required" placeholder="请输入分类别名" autocomplete="off" class="layui-input">
                    </div>
                </div>
                <div class="layui-form-item">
                    <div class="layui-input-block">
                        <button class="layui-btn" lay-submit lay-filter="formDemo">确认修改</button>
                    </div>
                </div>
            </form>
            `
        });  
        console.log($(this)[0].dataset.id);
        let id = $(this)[0].dataset.id
        // 发请求获取该id的数据
        $.ajax({
            method: 'GET',
            url: root + '/my/article/cates/' +id,
            success: function(res){
                console.log(res);
                // 快速填充数据到表单里面
                form.val('form-edit',res.data)
            }
        })
    })
    // 通过代理的形式，为修改分类的表单 确认修改按钮绑定submit事件
    $('body').on('submit','#form-edit',function(e){
        e.preventDefault()
        console.log('ok');
        $.ajax({
            method: 'POST',
            url: root + '/my/article/updatecate',
            data: $(this).serialize,
            success: function(res){
                console.log(res);
                if(res.status !==0) return layer.msg('更新数据失败！')
                layer.msg('更新数据成功！')
                layer.close(indexEdit)
                initArtCateList()
            }
        })
    })
    // 通过代理为删除绑定事件
    $('tbody').on('click','.btn-delete',function(){
        let id = $(this)[0].dataset
        console.log(id);
        // 提示用户是否要删除
        layer.confirm('确认删除?', {icon: 3, title:'提示'}, 
        function(index){
            //do something
            // 发请求 删数据
            $.ajax({
                method: 'GET',
                url: root +'/my/article/deletecate/'+id,
                success:function(res){
                    console.log(res);
                    if(res.status!==0) return layer.msg('删除失败！')
                    layer.msg('删除成功！')
                    layer.close(index);
                    initArtCateList()
                }
            })
            
        });
    })
})