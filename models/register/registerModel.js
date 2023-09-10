let authCustomerInstance = null;

class registerCustomer{

    static getAuthCustomerInstance(){
        return authCustomerInstance ? authCustomerInstance : new registerCustomer();
    }

    async register(email,password,connection) {
        console.log(email+"here");
        return new Promise(function(resolve, reject){

            connection.query("INSERT INTO loginuser(user_name, user_pass,role_name) VALUES ? ",[[[email,password,"Customer"]]],function(error,results,fields){
                if (error) {
                    reject(error);
                }
                else{
                    console.log(results+"new row inserted")
                    resolve(results) ;
                }
            });

        })  
    }

    async registerCustomerDetails(name,address,phone,username,customerType,connection) {
        console.log(name+address+"here");
        return new Promise(function(resolve, reject){

            connection.query("INSERT INTO customer(name, address,phone,email,customer_type) VALUES ? ",[[[name,address,phone,username,customerType]]],function(error,results,fields){
                if (error) {
                    reject(error);
                }
                else{
                    console.log(results+"new row inserted")
                    resolve(results) ;
                }
            });

        })  
    }
}
module.exports = registerCustomer;


