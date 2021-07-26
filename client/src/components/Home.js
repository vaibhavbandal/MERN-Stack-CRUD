
const { useState,useEffect, default: React } = require("react")


let Home=()=>{

    // for deal with single user
    const [user,setUser]=useState(
            {first_name:"",last_name:"",email:"",mobile:""}
            );
    // for all users         
    const [users,setUsers]=useState([]);
    // users list (table) hide and show state
    const [userTableDisplay,setUserTableDisplay]=useState(false);
    // by default setting submit btn as a true for inserting new users
    //  id this btn value will false the client can see the UPDATE button
    const [userSubmitBtn,setSubmitBtn]=useState(true);  
     
    useEffect(()=>{

        let fetchData=async()=>{
            let res=await fetch('http://localhost:9000/');
            let data=await res.json();
            setUsers(data) 

        }
        fetchData();
  
    },[user]);   
          


    let handleInput=(e)=>{
        user[e.target.name]=e.target.value;
        setUser({...user});     
    } 

    let validationForm=()=>{
        if(user.first_name.startsWith(' ')||user.last_name.startsWith(' ')||user.email.startsWith(' ')||user.mobile.startsWith(' ')){ 
            return false; 
        }
        if(user.first_name.length===0||user.last_name.length===0||user.email.length===0||user.mobile.length===0){
            return false; 
        }
        if(isNaN(user.mobile)||user.mobile.length!==10){
            return false;  
        }
 
        return true;
    }

// send data to express inserting new user 
    let sendData=async()=>{
        
        const params={
            method:"post",
            headers:{ 
                'Content-Type':'application/json'
            },
            body:JSON.stringify(user)
            
        }
        const url="http://localhost:9000/";
        let res=await fetch(url,params);
        let result=await res.text();
        return result;

    }

 
    let onInsert=(e)=>{
        e.preventDefault(); 
        if(!validationForm())  
                alert(`Check Input Fields...`);
        else{
            sendData().then((result)=>{
                setUser({first_name:"",last_name:"",email:"",mobile:""}); 
                alert(result)
            }).catch((err)=>{
                alert(err);
            })

        }        
    }


    let deleteUser=async(_id)=>{

        let params={
            method:"delete",
            headers:{
                '_id':_id
            }
        }  
        let url='http://localhost:9000/';
        let res=await fetch(url,params);
        return await res.text();

    }
    

    let onDeleteUser=(_id)=>{
             
        deleteUser(_id).then((res)=>{
            setUser({...user});  // for useEffect only (side effect only)
        })
    
    }
 

    // update field 
    let updateUser=async()=>{

        let temp={
            first_name:user.first_name,
            last_name:user.last_name,
            email:user.email,
            mobile:user.mobile
        }

            let params={
                method:"put",
                headers:{
                    'Content-Type':'application/json',
                    '_id':user._id
                },
                body:JSON.stringify(temp)
            }
              
            let url="http://localhost:9000/";
            let res=await fetch(url,params);
            return await res.text();


    }

    // final updation button click
    let onUpdateUser=()=>{

        if(!validationForm()){
            alert(`enter proper field..`) 
        }else{
           
            updateUser().then((res)=>{
                setUser({first_name:"",last_name:"",email:"",mobile:""})
                setSubmitBtn(true) 
            })
        }
    }
    

     let updateCurrent=(_id)=>{ 

        // getting current user data as a user for update....
        // filtering users and getting particular user for update...
        setUser(users.filter((user)=>user._id===_id)[0]);

        setSubmitBtn(false) // display UPDATE btn for client

      
        
    }

    let UsersList=({user,index})=>{ 
        
        return(
            <> 
                   <tr>
                         <td>{++index}</td>  
                         <td>{user.first_name}</td> 
                         <td>{user.last_name}</td> 
                         <td>{user.email}</td> 
                         <td>{user.mobile}</td> 
                         <td><button className="btn btn-outline-warning" onClick={()=>updateCurrent(user._id)}>Update</button></td> 
                         <td><button className="btn btn-outline-danger" onClick={()=>onDeleteUser(user._id)}>Delete</button></td> 
                   </tr> 
            </>
        )
    }



    let UsersTable=()=>{

        
        return(<>
                {/*  Table Users List */}
                <div className="container mt-2 ">

                <table className="table  table-bordered  table-hover text-center table-dark ">
                        <thead>
                            <tr>
                                <th>No</th>
                                <th>First Name</th>
                                <th>Last Name</th>
                                <th>Email</th>
                                <th>Mobile</th> 
                                <th>Update</th> 
                                <th>Delete</th> 
                            </tr>
                        </thead>
                        <tbody className=" table-info">   
                                        {
                                            users.map((user,index)=>{
                                               return <UsersList key={index} index={index} user={user}  />
                                            })
                                        }

                        </tbody>
                </table>
                </div>
        </>)
    }

        return (<>
            
            <div className=" container  ">
                    <div className=" d-flex     pt-auto ">
                            <h2 className="my-auto  ">MERN CRUD</h2> 
                            <h2 className="my-auto ms-auto ">
                            <button onClick={()=>{  
                                userTableDisplay? setUserTableDisplay(false): setUserTableDisplay(true)
                            }} className="btn btn-outline-info">Display Users</button>
                            </h2> 
                    </div>

                             {/* form div start  */}
                    <form >
                 <div className=" row mt-2  ">   
                <div className="col-12 col-sm-6 border-start    border-primary">
                        First Name
                        <input type="text" className="form-control" onChange={handleInput} name="first_name" value={user.first_name}/>
                    
                        Last Name
                        <input type="text" className="form-control" onChange={handleInput} name="last_name" value={user.last_name}/>
                </div>
                <div className="col-12 col-sm-6  border-start  border-primary ">
                        Email
                        <input type="text" className="form-control" onChange={handleInput} name="email" value={user.email}/>
                        Mobile
                        <input type="text" className="form-control" onChange={handleInput} name="mobile" value={user.mobile}/>
                </div> 
                </div>       
                        <div className="text-center pt-4">
                                 <button  onClick={userSubmitBtn? onInsert:onUpdateUser} className="btn btn-outline-success " type="button">

                                {userSubmitBtn? 'Submit':'Update'}

                                 </button>
                        </div>
                        
            </form>
            </div> 
            
                       {userTableDisplay ?  <UsersTable/> : null}

        </>);
}

export default Home;