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


/* //some routes
app.use('/',require('./routes/dashboard'))
app.use('/members',require('./routes/members'))
app.use('/contributions',require('./routes/contributions'))
app.use('/loans',require('./routes/loans'))
 */



app.listen(port,()=>{
    console.log(`App is listening on ${port}`);
    
})