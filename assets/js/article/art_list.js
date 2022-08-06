$(function(){
    let layer = layui.layer
    let root = 'http://www.liulongbin.top:3007'
    let form = layui.form
    let laypage = layui.laypage
    // 查询的参数对象 
    let q = {
        pagenum: 1, //页码值
        pagesize: 2, //每页显示多少条数据
        cate_id: '',
        state: ''
    }
    // 定义美化事件的过滤器
    template.defaults.imports.dateFormat =function(date){
        const dt =new Date(date)
        let y =dt.getFullYear()
        let m =(dt.getMonth()+1) >9 ? (dt.getMonth()+1):'0' +(dt.getMonth()+1)
        let d =dt.getDate() >9 ? dt.getDate() :'0' +dt.getDate() 
        let hh =dt.getHours() > 9 ? dt.getHours():'0' +dt.getHours()
        let mm =dt.getMinutes() >9 ? dt.getMinutes():'0' +dt.getMinutes()
        let ss =dt.getSeconds() >9 ? dt.getSeconds():'0' +dt.getSeconds()
        return y+'-'+ m +'-' + d + ' ' + hh +':' + mm +':' + ss
    }
    initTable()
    // 获取文章列表数据
    function initTable(){
        $.ajax({
            method: 'GET',
            url: root +'/my/article/list',
            data: q,
            success: function(res){
                console.log(res);
                if(res.status !==0) return layer.msg('获取文章失败！')
                layer.msg('获取文章成功！')
                // 使用模板引擎渲染页面
                let htmlStr = template('tpl-table',res)
                $('tbody').html(htmlStr)
                // 渲染完了要继续渲染分页
                renderPage(res.total)
            }
        })
    }
    initCate()
    //初始化文章分类下拉菜单
    function initCate(){
        $.ajax({
            method:'GET',
            url: root + '/my/article/cates',
            success: function(res){
                console.log(res);
                if(res.status !== 0) return layer.msg('获取文章分类失败！')
                layer.msg('获取分类成功！')
                // 调用模板引擎渲染分类下拉菜单
                let htmlStr = template('tpl-cate',res)
                console.log(htmlStr);
                $('[name=cate_id]').html(htmlStr)
                // 因为layui的渲染机制 这里改了数据 
                // 但是不会重新渲染 要手动调用
                form.render()
            }
        })
    }
    //监听筛选表单
    $('#form-search').on('submit',function(e){
        e.preventDefault()
        console.log('okk');
        // 获取表单中选中项的值
        let cate_id = $('[name=cate_id]').val()
        let state = $('[name=state]').val()
        // 为查询参数对象 q 赋值
        q.cate_id = cate_id
        q.state = state
        // 根据最新的筛选条件 重新渲染表格的数据
        initTable()
    }) 
    // 渲染分页器
    function renderPage(total){
        console.log(total+'!');
        // 渲染分页
        laypage.render({
            elem: 'pageBox' //分页的容器
            ,count: total  //总数据条数
            ,limit: q.pagesize //设置   每一页显示多少条数据
            ,curr: q.pagenum
            ,layout: ['count','limit','prev','page','next','skip']
            ,limits: [2,3,5,10]
            // 分页发生切换的时候触发 
            // 触发jump的方式  1.单击页面值  2.调用laypage.render（）
            // 第一种方式触发 first===true
            // 第二种方式触发 first===false
            ,jump: function(obj,first){
                console.log(obj.curr);
                q.pagenum =obj.curr
                // 把最新的条目数得到
                q.pagesize = obj.limit
                // initTable() 不可以直接调用 不然会死循环
                if(!first) initTable()
                
            }
        })
        console.log('渲染分页成功！');
    }
    // 通过代理的形式为删除文章按钮绑定点击事件
    $('body').on('click','.btn-delete',function(e){
        // 获取该文章的id
        let id =$(this)[0].dataset.id
        //  获取有多少个删除按钮，也就是这个页码多少篇文章
        let len =$('.btn-delete').len
        console.log('还有删除按钮'+ len);
        //  确认删除
        layer.confirm('确认删除?', {icon: 3, title:'提示'}, 
        function(index){
            //do something
           
            // 调用删除文章
            $,ajax({
                method: 'GET',
                url: root+ '/my/article/delete/'+ id,
                success:function(res){
                    if(res.status!==0) return layer.msg('删除文章失败！')
                    layer.msg('删除文章成功！')
                    // 如果某一页删光了 他渲染的还是该页的数据 会导致空
                    // 要判断是否还有剩余的数据 如果没有了 则让页码值-1
                    if(len ===1){
                        // 如果len===1 说明页面没有数据了
                        q.pagenum ===1?q.pagenum:q.pagenum-1
                    }
                    initTable()
                }
            })
            layer.close(index);
        });
    })
})