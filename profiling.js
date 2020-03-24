const mongodb=require('mongodb')
const mongoURI = 'mongodb+srv://shumsd145:shubhamsh@cluster0-zsxx7.mongodb.net/test?retryWrites=true&w=majority';

function user_login(email,password,res){
    mongodb.MongoClient.connect(mongoURI,(err,dbclient)=>{
        if(err){
            console.log('connsection failed')
        }
        dbclient.db('test').collection('profilestore').find({'email':email}).toArray().then(data=>{
            if(data.length===0){
                res.send({'status':'failed'})
            }
            else{
                if(data[0].password===password){
                    res.send({'status':'passed','name':data[0].name,'email':data[0].email})
                }
                else{
                    res.send({'status':'failed'})
                }
            }
        })
    })
}
function user_register(obj,res){
    mongodb.MongoClient.connect(mongoURI,(err,dbclient)=>{
        if(err){
            console.log('connsection failed')
        }
        dbclient.db('test').collection('profilestore').insertOne(obj,(error,response)=>{
            if(error){
                console.log('post failed',error)
            }
            res.send('success')
        })
    })
}
function user_presence(email,res){
    mongodb.MongoClient.connect(mongoURI,(err,dbclient)=>{
        if(err){
            console.log('connsection failed')
        }
        dbclient.db('test').collection('profilestore').find({'email':email}).toArray().then(data=>{
            if(data.length===0){
                res.send({'presence':false})
            }
            else{
                res.send({'presence':true})
            }
        })
    })
}
module.exports.user_login =user_login
module.exports.user_register=user_register
module.exports.user_presence=user_presence