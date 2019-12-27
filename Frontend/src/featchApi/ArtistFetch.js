import config from '../config.json'


export class ArtistFetch {


    async saveArtist(obj) {
        let result = null;
        await fetch(`${config.apiRoot}/api/artist`, {
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

    async getArtists() {

        let result = []

        await fetch(`${config.apiRoot}/api/artist`, {
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
    async getArtist(id) {

        let result = []

        await fetch(`${config.apiRoot}/api/artist/${id}`, {
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