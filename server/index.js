const express=require('express');
const { json } = require('express');
const app=express();
const port=9000;
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(require('cors')()); 

   
    const {MongoClient,ObjectId} =require("mongodb");
    let url="mongodb://localhost:27017/";

    app.get('/',(req,res)=>{

   
        MongoClient.connect(url,(err,db)=>{
            if(err) res.send(null);
            else{
                let dbo=db.db("db1");
                dbo.collection("users").find({}).toArray((err,result)=>{
                    if(err){
                        res.send(null);
                    }
                    else{

                        res.send(result);
                        db.close();
                    }  
                         
                })
 
            }
        })
   
    })   

    app.post('/',(req,res)=>{
    
        MongoClient.connect(url,(err,db)=>{

                let db1=db.db("db1");
                let obj=req.body;   
                    db1.collection("users").insertOne(obj,(err,result)=>{
                        if(err){
                            db.close(); 
                            res.send(`insertion failed...`);
                        }
                    
                        else{
                            db.close(); 
                            res.send(`inserted successfully ...`)
                        }
            });
                    
        })    
                
          
    })
    
  

    app.delete('/',(req,res)=>{
 
        MongoClient.connect(url,(err,db)=>{
            

                let myQuery={
                    '_id':ObjectId(req.headers._id) 
                }
                let db1=db.db("db1"); 
                  db1.collection("users").deleteOne(myQuery,(err,result)=>{
                        if(err){
                            db.close(); 
                            res.send(`deletion failed...`);
                        }
                        else{
                            db.close(); 
                            res.send(`deleted successfully ...`)
                        }
                    });
            
        })
    
    })  

     app.put('/',(req,res)=>{

        MongoClient.connect(url,(err,db)=>{
            if(err){

            }else{
                 let dbo=db.db("db1");
                 let myQuery={
                    '_id':ObjectId(req.headers._id)
                }
                
                 let updateQuery={$set:req.body} 

                 dbo.collection("users").updateOne(myQuery,updateQuery,(err)=>{
                     if(err){
                         res.send('error in query')
                     }else{
                         res.send('updated successfully...')
                     }
                 }) 


            }
     })

    })





app.listen(port,()=>{
    console.info("server started at 9000..........");
})




