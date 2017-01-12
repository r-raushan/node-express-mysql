var express = require('express');
var router = express.Router();
var url = require('url');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express Tech Geek KD' });
});

module.exports = router;

/* Create Employee Service. */
router.post('/techgeek/v1/createEmployee', function(req,res,next){
try{
	var reqObj = req.body;	
	console.log(reqObj);
	req.getConnection(function(err, conn){
		if(err)
		{
			console.error('SQL Connection error: ', err);
			return next(err);
		}
		else
		{
			var insertSql = "INSERT INTO employee SET ?";
			var insertValues = {
			"Emp_Name" : reqObj.empName,
			"Role_Id" : reqObj.roleId
			};
			var query = conn.query(insertSql, insertValues, function (err, result){
				if(err){
				console.error('SQL error: ', err);
				return next(err);
				}
				console.log(result);
				var Employee_Id = result.insertId;
				res.json({"Emp_id":Employee_Id});
			});
		}
		});
	}
	catch(ex){
	console.error("Internal error:"+ex);
	return next(ex);
	}
});

/* Get Employee Service. */
router.get('/techgeek/v1/getEmployeeDetails', function(req, res, next) {
    try {
    	/*var roleId = req.param('roleId');
  		var deptId = req.param('deptId');*/
  		var query = url.parse(req.url,true).query;
  		console.log(query);
        var roleId = query.roleId;
        console.log(roleId);
        req.getConnection(function(err, conn) {
            if (err) {
                console.error('SQL Connection error: ', err);
                return next(err);
            } else {
                conn.query('select E.Emp_Name, Date_Format(E.Doj,"%d-%m-%Y") AS DOJ, R.Role_Name from employee E, role R where E.Role_Id = R.Role_Id and E.Role_Id = ? order by DOJ', [roleId], function(err, rows, fields) {
                    if (err) {
                        console.error('SQL error: ', err);
                        return next(err);
                    }
                    var resEmp = [];
                    for (var empIndex in rows) {
                        var empObj = rows[empIndex];
                        resEmp.push(empObj);
                    }
                    res.json(resEmp);
                });
            }
        });
    } catch (ex) {
        console.error("Internal error:" + ex);
        return next(ex);
    }
});
