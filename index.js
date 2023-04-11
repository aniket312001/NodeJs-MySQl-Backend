const express = require('express');
const app = express();
const cors = require('cors')
let mysql = require('mysql');
const port = 3000;


app.use(cors())

app.use(express.json())


let connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'employee'
});

connection.connect(function(err) {
    if (err) {
      return console.error('error: ' + err.message);
    }
  
    console.log('Connected to the MySQL server.');
  });




app.get('/',(req,res)=>{
	console.log('get Request')
})


app.post('/login',(req,res)=>{
    connection.query(`SELECT * FROM login WHERE userId='${req.body.userId}' and password='${req.body.password}'`, function (err, result) {  
        if (err) throw err;  
            // console.log(result); 
            if(result.length != 0){
                res.json(result[0])
            } else {
                res.json({"errorMessage":"Invalid User","errorCode":"0001"})
            }

        });  
})


// Get All Data  with limit 10
app.post('/getAllEmployee',(req,res)=>{
    var total;
    connection.query(` SELECT *  FROM EmployeeMaster `, function (err, result) {  
        if (err) throw err;  
            // console.log(result); 
            if(result.length != 0){
                // res.json(result)
                total = result.length;

                connection.query(` SELECT EmployeeMaster.*, DesignationMaster.Designation FROM DesignationMaster INNER JOIN EmployeeMaster ON (DesignationMaster.DesignationId=EmployeeMaster.DesignationId) LIMIT ${(req.body.currentPage-1)*10},10 ;`, function (err2, result2) {  
                    if (err2) throw err2;  
                        // console.log(result); 
                        if(result2.length != 0){
                            res.json({"data": result2, "total":total})
                        } else {
                            res.json({"errorMessage":"No Record Found","errorCode":"0001"})
                        }
                    }); 




            } else {
                res.json({"errorMessage":"No Record Found","errorCode":"0001"})
            }
        });  


    
})


// Get Specific Data 
app.get('/employee/:id',(req,res)=>{
    connection.query(` SELECT EmployeeMaster.*, DesignationMaster.Designation FROM DesignationMaster INNER JOIN EmployeeMaster ON (DesignationMaster.DesignationId=EmployeeMaster.DesignationId) where EmployeeId=${req.params.id}`, function (err, result) {  
        if (err) throw err;  
            // console.log(result); 
            if(result.length != 0){
                res.json(result[0])
            } else {
                res.json({"errorMessage":"No Record Found","errorCode":"0001"})
            }
        });  
})




app.post('/employee',(req,res)=>{
    connection.query(` insert into EmployeeMaster(firstName,lastName,DateOfJoining,Salary,DesignationId) values("${req.body.firstName}","${req.body.lastName}","${req.body.DateOfJoining}",${req.body.Salary},${req.body.DesignationId}); `, function (err, result) {  
        if (err) throw err;  
            // console.log(result); 
            if(result.length != 0){
                res.json({"errorMessage":"Created Successfully ","errorCode":"0000"})
            } else {
                res.json({"errorMessage":"No Record Found","errorCode":"0001"})
            }
        });  
})


app.put('/employee',(req,res)=>{
    connection.query(`UPDATE EmployeeMaster  SET firstName = '${req.body.firstName}' , lastName = '${req.body.lastName}' ,DateOfJoining = '${req.body.DateOfJoining}' , Salary=${req.body.Salary}, DesignationId='${req.body.DesignationId}'  WHERE EmployeeId = '${req.body.EmployeeId}';`, function (err, result) {  
        if (err) throw err;  
            // console.log(result); 
            if(result.length != 0){
                res.json({"errorMessage":"Updated Successfully ","errorCode":"0000"})
            } else {
                res.json({"errorMessage":"No Record Found","errorCode":"0001"})
            }
        });  
})


app.delete('/employee/:id',(req,res)=>{
    connection.query(`DELETE FROM EmployeeMaster WHERE EmployeeId=${req.params.id};`, function (err, result) {  
        if (err) throw err;  
            // console.log(result); 
            if(result.length != 0){
                res.json({"errorMessage":"Delete Successfully","errorCode":"0000"})
            } else {
                res.json({"errorMessage":"No Record Found","errorCode":"0001"})
            }
        });  
})



app.get('/designation',(req,res)=>{
    connection.query(`SELECT * FROM DesignationMaster`, function (err, result) {  
        if (err) throw err;  
            // console.log(result); 
            if(result.length != 0){
                res.json(result)
            } else {
                res.json({"errorMessage":"No Record Found","errorCode":"0001"})
            }
        });  
})





app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});