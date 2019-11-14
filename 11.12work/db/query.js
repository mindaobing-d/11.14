const connection = require('./db');

module.exports = (sql,params=[]) =>{
    return new Promise((reslove,reject)=>{
        connection.query(sql,params,(error,data)=>{
            if(error){
                reject({message:"error",error})
            }else{
                reslove({message:"success",data})
            }
        })
    })
}