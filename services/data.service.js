const db = require("../db");

let accountDetails = {
    1001: { name: "user1", acno: 1001, pin: 1234, password: "userone", balance: 30000, transactions:[] },
    1002: { name: "user2", acno: 1002, pin: 1334, password: "usertwo", balance: 40000, transactions:[] },
    1003: { name: "user3", acno: 1003, pin: 1034, password: "userthree", balance: 30000, transactions:[] },
    1004: { name: "user4", acno: 1004, pin: 1834, password: "userfour", balance: 70000, transactions:[] },
    1005: { name: "user5", acno: 1005, pin: 1934, password: "userfive", balance: 20000, transactions:[] },
}
let currentUser;
const register =(name,acno,pin,password)=>{
  return db.User.findOne({
    acno:acno
  })
  .then(user=>{
    if(user){
      return{
        status:false,
      statusCode:422,
      message:'Account already exists.please login'
      }

    }
 // });
//     if(acno in accountDetails){
      
//       return{
//       status:false,
//       statusCode:422,
//       message:'Account number already exists.please login'
      
//     }
    
// }
    //accountDetails[acno]={
      const NewUser = new db.User({
      name,
      acno,
      pin,
      password:password,
      balance:0,
      transactions:[]
      
    });
    //this.saveDetails();
    NewUser.save();
    return{
    status: true,
    statusCode:200,
    message:'Account created successfully. please login'
    };
});
}
 const login=(req,acno1,password)=>{
  var acno=parseInt(acno1);
  return db.User.findOne({
    acno:acno,
    password
  })
  // console.log(accountDetails);
  // var data=accountDetails;
  // if(acno in data){
  //   var pwd= data[acno].password
   
  //   if(pwd==password){
  //    req.session.currentUser=data[acno];
    // this. saveDetails();
    .then(user=>{
      if(user){
        req.session.currentUser=acno;
        return{
          status: true,
          statusCode:200,
          message:'logged in',
          name:user.name

          
          }
      
    
      }
    
//       return{
//       status: true,
//       statusCode:200,
//       message:'logged in'
//       }
//   }
// }
 
  return{
    status:false,
    statusCode:422,
    message:'Invalid Credentials '
  }
 
})
 }

 const deposit=(acno1,pinno,amt)=>{
  return db.User.findOne({
    acno:acno1,
    pin:pinno
  })
  .then(user=>{
    if(!user){
      return{
        status:false,
        statusCode:422,
        message:'Incorrect account details'
      }
    }
    user.balance+=parseInt(amt)
    user.transactions.push({
      amount:amt,
      typeOfTransaction:'credit',
      id:Math.floor(Math.random()*100000)
    });
    user.save();
    return{
      status: true,
      statusCode:200,
      message:'account has been credited',
      balance:user.balance
  }

  });
}
//   var acno = parseInt(acno1);
//       //var pin= pinno.value;
//       var amount = parseInt(amt);
//       var data = accountDetails;
//       if (acno in data) {
    
      
//           let mpin = data[acno].pin;
//           if (pinno == mpin) {
//               data[acno].balance += amount;
            
//               currentUser=data[acno];
//               (data[acno].balance)
//               data[acno].transactions.push({
//                 amount:amt,
//                 type:'credit',
//                 id:Math.floor(Math.random()*100000)
//               })
//              // this.saveDetails();
//               return{
//               status: true,
//               statusCode:200,
//               message:'account has been credited',
//               balance:data[acno1].balance
//           }
//       }
//     }
//     else{
//     return{
//       status:false,
//       statusCode:422,
//       message:'Incorrect account details'
//     }
//   }
// }
  const withdraw=(acno1,pinno,amt)=>{
    return db.User.findOne({
acno:acno1,
pin:pinno
})
.then(user=>{
  if(!user){
    return{
      status:false,
      statusCode:422,
      message:'Incorrect Account details'
    }
  }
  if(user.balance<parseInt(amt)){
    return{
      status:false,
              statusCode:422,
              message:'Insufficient balance',
              balance:user.balance
            }
    }
    user.balance -= parseInt(amt);
              
    user.transactions.push({
      amount:amt,
      typeOfTransaction:'debit',
      id:Math.floor(Math.random()*100000)
    });
    user.save();
    return{
          status:true,
              statusCode:200,
              message:'account has been debited' ,
             balance:user.balance
    }
})
  }
  //   var acno = parseInt(acno1);
  //     //var pinno = pinno.value;
  //     var amount = parseInt(amt);
  //     var data = accountDetails;
  //     if (acno in data) {
  //         let mpin = data[acno].pin;
  //         if(data[acno].balance<parseInt(amt)){
  //           return {
  //             status:false,
  //             statusCode:422,
  //             message:'Insufficient balance',
  //             balance:data[acno].balance
  //           }
  //         }
          
  //        else  if (pinno == mpin) {
  
  //             data[acno].balance -= parseInt(amt);
              
  //             data[acno].transactions.push({
  //               amount:amt,
  //               type:'debit',
  //               id:Math.floor(Math.random()*100000)
  //             })
  //            //this.saveDetails();
  //             currentUser=data[acno];
              
  //             return{
  
  //             status:true,
  //             statusCode:200,
  //             message:'account has been debited' ,
  //            balance:data[acno].balance
              
             
  //             }
  //         }
    
  //       }
  //       else{
  //     return{
  //       status:false,
  //       statusCode:422,
  //       message:'Incorrect Account details'
  //     }
  //   }
  // }
    const getTransactions= (req)=>{
return db.User.findOne({
  acno:req.session.currentUser
  
})
.then(user=>{
  if(user){
    return{
      status:true,
      statusCode:200,
      transactions:user.transactions
  }
}
  return{
    status:true,
    statusCode:200,
    transactions:[]
  }
})
      //return accountDetails[currentUser.acno].transactions;
    }

    const deleteTransaction = (req,id) =>{
      return db.User.findOne({
        acno:req.session.currentUser
      //let transactions= accountDetails[req.session.currentUser.acno].transactions
    })
      .then(user=>{
     user.transactions = user.transactions.filter(t=>{
        if(t._id==id){
          return false;
        }
        return true;
      })
     // accountDetails[req.session.currentUser.acno].transactions =transactions;
     user.save();
      return {
status:true,
statusCode:200,
message:'Transactin deleted successfully'
      }
    })
    }
  
  
  module.exports={
      register,
      login,
      deposit,
      withdraw,
       getTransactions,
       deleteTransaction
  }
     