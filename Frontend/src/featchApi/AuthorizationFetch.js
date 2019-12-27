import config from '../config.json'


export class AuthorizationFetch {

    async SingIn(login,password){
       
        let result = []
        const obj = {
            UserName: login,
            Password: password
        }
        await fetch(`${config.apiRoot}/api/account/Login`, {
            method: "post",
            headers: {
                "Content-type": "application/json; charset=UTF-8",
            },
            body: JSON.stringify(obj)
        })
            .then(res => res.json())
            .then(res => {
                result = res;
               
               
            })
        return result
    }
}