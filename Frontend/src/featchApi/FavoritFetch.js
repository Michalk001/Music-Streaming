import config from '../config.json'
import Cookies from 'js-cookie';


export class FavoritFetch {

    async getFavorit() {

        let result = []

        await fetch(`${config.apiRoot}/api/favorit`, {
            method: "get",
            headers: {
                "Content-type": "application/json; charset=UTF-8",
                'Authorization': 'Bearer ' + Cookies.get('token'),
            }
        })
            .then(res => res.json())
            .then(res => {
                result = res;


            })
        return result
    }

    async addFavorit(id) {
        let result = []
        await fetch(`${config.apiRoot}/api/favorit/${id}`, {
            method: "put",
            headers: {
                "Content-type": "application/json; charset=UTF-8",
                'Authorization': 'Bearer ' + Cookies.get('token'),
            }
        })
            .then(res => res.json())
            .then(res => {
                
                result = res;

            })
        return result
    }

    async removeFavorit(id) {
        let result = []
        await fetch(`${config.apiRoot}/api/favorit/${id}`, {
            method: "delete",
            headers: {
                "Content-type": "application/json; charset=UTF-8",
                'Authorization': 'Bearer ' + Cookies.get('token'),
            }
        })
            .then(res => res.json())
            .then(res => {
                result = res;

            })
        return result
    }
}