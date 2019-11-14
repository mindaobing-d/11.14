const Koa = require('koa');
const app = new Koa();

//1.配置静态资源
const static = require('koa-static');
const path =require('path');

//2.post请求配置
const bodyparser = require('koa-bodyparser');

//3.路由规则
const Router = require('koa-router');
const router = new Router();
const query = require('./db/query');

//静态资源和接口
app.use(static(path.join(process.cwd(),'static')))
app.use(bodyparser())
app.use(router.routes()).use(router.allowedMethods());

//查询数据库
router.get('/api/list',async (ctx)=>{
    let data = await query('select * from lists');
    ctx.body = data
})
router.get('/api/lists',async ctx => {

    let {page=1,pageSize=2}=ctx.request.query
    pageSize=pageSize*1
    page=(page*1-1)*pageSize
    let count=await query('select count(*) as count from lists');
    // ctx.body={
    //     count
    // }
    console.log(count)
    let data=await query(`select * from lists limit ${page},${pageSize}`)
    ctx.body={
        code:1,
        data,
        count
    }

})

//添加数据库
router.post('/api/add',async (ctx)=>{
    let {name,bool,time} = ctx.request.body;
    if(name&&bool&&time){
            let list = await query('insert into lists (name,bool,time) values (?,?,?)',[name,bool,time]);
            let data = await query('select * from lists');
                ctx.body = {
                    code: 1,
                    msg: "添加成功",
                    data
                }
            }

})

router.get('/api/del',async (ctx)=>{
    let {id} = ctx.request.query;
    let data = await query(`delete from lists where id=${id}`);
    ctx.body = data;
})

router.post('/api/updata',async (ctx)=>{
    let {id,name,bool,time} = ctx.request.body;
    if(name,bool,time){
        let data = await query('update lists set name=?,bool=?,time=? where id=?',[name,bool,time,id]);
        ctx.body={
            code:1,
            message:"修改成功"
        }
    }else{
        ctx.body={
            message:"修改失败"
        }
    }
            
            // if(data.message === "error"){
            //     ctx.body = {
            //         code:0,
            //         message:data.error
            //     }
            // }else{
            //     ctx.body = {
            //         code: 1,
            //         message: "成功"
            //     }
            // }
})

app.listen(7001,()=>{
    console.log('open server http://lcoalhost:7001')
})