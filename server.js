const express=require('express');
const path=require('path');
const mysql=require('mysql2');
const app=express();
const port=3000;

//setting the view engine and the static path 
app.set('view engine' ,'ejs') 
//combining teh views to static (the satc folders are accessible to views eg css ,html)

app.set('views',path.join(__dirname,'views'))

//setting the middleware
app.use(express.static(path.join(__dirname,'public')))
//allow us to get/readinformation from a form 
app.use(express.urlencoded({extended:true}))


//connect to our database using the createpool/createconnection 

const pool=mysql.createPool({
    host:'localhost',
    user:'root',
    password:'',
    database:'chama_manager',
    connectionLimit:10,
    waitForConnections:true,

})
//run a connection test to check if my db has been connected successfully[]
 //getConnection>>used to acquire and test a database connection
pool.getConnection((err,connection)=>{
    if(err){
        console.log('Database not connected',err.message);

        
    }
    else{
        console.log('Database connected successfully');
        
    }
    //once a connectin is innitated with a pool {
    //if a connection is succesful then there is no need for another 
    // connecting so we sen a release method to the connectin to not uild other connection }

    connection.release() //once a connection is successful to avoid other connections 
})
app.get('/signup',(req,res)=>{  //we are senfgnthe sign up .ejs file to the user 
    res.render('signup',{error:null})
})
//to send the user data once the sign up page has been populated by the user 
app.post('/signup',(req,res)=>{
    //we have retireved user data 
   const username=req.body.username
   const password=req.body.password

   if(!username && !password){
    return res.render('signup',{error:'please fill in all the details '})
   } 
   let hashedPassword=bcrypt.hash(password,10)

   //defining an sql staement that will insert into our users table 
   let sql=`INSERT INTO users (username,password) VALUES(?,?)`//ACCEPT THE REQ.BODY 

   //USE THE QUERY METHOD TO PUSH THE REQ.BODY OT OUR DB (WE INPUT THE HASHED PASSWORD IN THE ARRAY OBJECT )

   pool.query(sql,[username,hashedPassword],(error,result)=>{
    if(err){
        res.render('signup',{error:'username already taken '})
    }
   })

})

/* //some routes
app.use('/',require('./routes/dashboard'))
app.use('/members',require('./routes/members'))
app.use('/contributions',require('./routes/contributions'))
app.use('/loans',require('./routes/loans'))
 */



app.listen(port,()=>{
    console.log(`App is listening on ${port}`);
    
})