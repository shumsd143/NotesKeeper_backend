const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const methodOverride = require('method-override');
const cors=require('cors')
const app = express();
const schematic=require('./profiling')
const notespost=require('./notespost')

app.use(bodyParser.json());
app.use(methodOverride('_method'));
app.use(cors())

const mongoURI = 'mongodb+srv://shumsd145:shubhamsh@cluster0-zsxx7.mongodb.net/test?retryWrites=true&w=majority';
const conn = mongoose.createConnection(mongoURI);

let gfs;

conn.once('open', () => {
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection('uploads');
});

const storage = new GridFsStorage({
    url: mongoURI,
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            const filename = file.originalname;
            const fileInfo = {
                filename: filename,
                bucketName: 'uploads'
            };
            resolve(fileInfo);
        });
    }
});

const upload = multer({ storage });

app.post('/image/upload', upload.single('file'), (req, res) => {
    res.send({'done':'success'});   
});

app.get('/files/:filename', (req, res) => {
    gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
        if (!file || file.length === 0) {
            return res.status(404).json({
                err: 'No file exists'
            });
        }
        const readstream = gfs.createReadStream(file.filename);
        return readstream.pipe(res);
    });  
});
//user registration
app.post('/user',(req,res)=>{
    let senderbody={
        name:req.body.name,
        email:req.body.email,
        password:req.body.password
    }
    schematic.user_register(senderbody,res)
})
//user login
app.post('/user/login',(req,res)=>{
    let email=req.body.email
    let password=req.body.password
    console.log(email,password)
    schematic.user_login(email,password,res)
})
app.get('/user/validity/:email',(req,res)=>{
    schematic.user_presence(req.params.email,res)
})
//adding notes
app.post('/user/data',(req,res)=>{
    let senderbody={
        title:req.body.title,
        text:req.body.text,
        email:req.body.email,
        image:req.body.image,
        link:req.body.link,
        checkbox:req.body.checkbox
    }
    notespost.notes_post(senderbody,res)
})
//getting notes from specific email
app.get('/user/data/note/:email',(req,res)=>{
    notespost.notes_get(req.params.email,res)
})
app.post('/user/data/checkbox',(req,res)=>{
    notespost.check_box(req.body.title,req.body.checkbox,req.body.email,res)
})

const PORT =process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));