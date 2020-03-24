const mongodb=require('mongodb')
const mongoURI = 'mongodb+srv://shumsd145:shubhamsh@cluster0-zsxx7.mongodb.net/test?retryWrites=true&w=majority';

function notes_get(email,res){
    mongodb.MongoClient.connect(mongoURI,(err,dbclient)=>{
        if(err){
            console.log('connsection failed')
        }
        dbclient.db('test').collection('allnotes').find({'email':email}).toArray().then(data=>{
            res.send(data)
        })
    })
}
function notes_post(obj,res){
    mongodb.MongoClient.connect(mongoURI,(err,dbclient)=>{
        if(err){
            console.log('connsection failed')
        }
        dbclient.db('test').collection('allnotes').insertOne(obj,(error,response)=>{
            if(error){
                console.log('post failed',error)
            }
            res.send('success')
        })
    })
}
function check_box(title,box,email,res){
    mongodb.MongoClient.connect(mongoURI,(err,dbclient)=>{
        if(err){
            console.log('connsection failed')
        }
        dbclient.db('test').collection('allnotes').updateOne({'title':title,'email':email},{$set:{'checkbox':box}}).then(data=>{
            res.send(data)
        })
    })
}

module.exports.notes_get =notes_get
module.exports.notes_post=notes_post
module.exports.check_box=check_box