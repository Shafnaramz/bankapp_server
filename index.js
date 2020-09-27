const express =require('express')
const dataService =require('./services/data.service')
const session=require('express-session')

const cors=require('cors');
const app =express();
app.use(cors({
   origin:'http://localhost:4200',
   credentials:true
}))

app.use(session({
secret:'randomsecurestring',
resave:false,
saveUninitialized:false
}));

app.use(express.json());



 const logMiddleware=(req,res,next)=>{
    console.log(req.body);
    next();
 };

 //app.use(logMiddleware);


 const authMiddleware= (req,res,next)=> {
   if(! req.session.currentUser){
      return res.status(401).json({
      status:false,
      statusCode:401,
      message:'please login'
   });
}
 else{
    next();
 }
 };

app.get('/',(req,res)=>{
   res.status(200).send ("Hello World");
})
app.post('/register',(req,res)=>{
   dataService.register(req.body.name,req.body.acno,req.body.pin,req.body.password)
  .then(result=>{
 // res.status(200).send("success");
    res.status (result.statusCode).json(result);
 })
})
 app.post('/login',(req,res)=>{
    dataService.login(req,req.body.acno,req.body.password)
    .then(result=>{
   res.status (result.statusCode).json(result);
    
 })
})
 app.post('/deposit', authMiddleware, (req,res)=>{
    //console.log( req.session.currentUser)
    dataService.deposit(req.body.acno1,req.body.pinno,req.body.amt)
    .then(result=>{  
   res.status (result.statusCode).json(result);
})  
 })

 app.post('/withdraw', authMiddleware,(req,res)=>{
    dataService. withdraw(req.body.acno1,req.body.pinno,req.body.amt)
    .then(result=>{ 
   res.status (result.statusCode).json(result);
}); 
 })
 app.get('/getTransactions', authMiddleware, (req,res)=>{
    dataService. getTransactions(req)
    .then(result=>{
   res.status (200).json(result);
})
})
app.delete('/getTransactions/:id',(req,res)=>{
   dataService.deleteTransaction(req,req.params.id)
   .then(result=>{
   res.status(200).json(result);
});
})
 app.patch('/',(req,res)=>{
    res.send ("patch method")
    
 })
 app.put('/',(req,res)=>{
    
    res.send ("put method")
 })
 
app.listen(3000,()=>{
  console .log("Server started at port 3000") 
})

