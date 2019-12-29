import config from '../config.json'


export class AlbumFetch {



    async saveAlbum(obj) {
        let result = null;
        await fetch(`${config.apiRoot}/api/album`, {
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

    async getAlbum(id){
       
        let result = []
       
        await fetch(`${config.apiRoot}/api/album/${id}`, {
            method: "get",
            headers: {
                "Content-type": "application/json; charset=UTF-8",
            }
        })
            .then(res => res.json())
            .then(res => {
                result = res;
            
               
            })
        return result
    }
}