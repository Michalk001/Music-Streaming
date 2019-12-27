import React, { useState, useEffect, state, useContext, useReducer } from "react";
import Select from 'react-select';
import { ArtistFetch } from '../../../featchApi/ArtistFetch'
import { AlbumFetch } from '../../../featchApi/AlbumFetch'
import FileBase64 from '../../../FileToBase64'


export const NewAlbumAdmin = (props) => {

    const artistF = new ArtistFetch();
    const albumF = new AlbumFetch();


    const [artistList, setArtistList] = useState([]);
    const [artistValue, setArtistValue] = useState(null);
    const [uploadMusicList, setUploadMusicList] = useState([]);
    const [albumName, setAlbumName] = useState(null);
    const [coverFile, setCoverFile] = useState(null);
    const GetArtistList = async () => {

        const res = await artistF.getArtists();
        if (!res.succeeded)
            return

        let artistTMP = []
        res.artists.length > 0 && res.artists.map(x => {
            artistTMP.push({ value: x.idString, label: x.name })
        })
        setArtistList(artistTMP);
        return artistTMP
    }
    const DefaultValueList = (artists) => {
        const id = props.match.params.id;
        if (artists.length <= 0)
            return
        const resfind = artists.find(x => {

            return x.value == id;
        })
        setArtistValue(resfind);

    }
    const SaveCover = (obj) => {
     
        if (!obj.name)
            return
        const type = obj.type.slice(0, 5)

        if (type != "image")
            return
        const cover = {
            Base64: obj.base64,
            Name: obj.name,
            Type: obj.type
        }
        setCoverFile(cover)

    }

    const SaveUploadMusic = (obj) => {
        console.log(obj.type.slice(0, 5));
    }

    const Submit = () => {
        console.log(albumName);
        let obj = {
            name: albumName,
            ArtistIdString: artistValue.value,
            Cover: coverFile

        }
        console.log(obj)
        albumF.saveAlbum(obj)
    }


    useEffect(() => {
        GetArtistList()
            .then(res => DefaultValueList(res))


    }, []);
    useEffect(() => {

    }, [artistValue])

    return (
        <div className="user__view">
            <div className="admin-box admin-box--editor">
                <div className="admin-box__row">
                    <div className="admin-box__text" >Artysta</div>
                    <Select
                        className="admin-box__select "
                        options={artistList}
                        value={artistValue}
                        onChange={x => setArtistValue(x)}
                    />
                    <div className="admin-box__text"> Nazwa albumu:</div>
                    <input type="text" name="name"  className="admin-box__input" onChange={x => setAlbumName(x.currentTarget.value)} />
                </div>

                <div>
                    <div className="admin-box__text">Okładka:</div>
                    <div className="admin-box__row">
                        <div class="admin-box__hidden-element">
                            <FileBase64
                                multiple={false}
                                onDone={x => SaveCover(x)}
                                id="uploadCover"

                            />
                        </div>
                        
                            <label className="admin-box__button admin-box__button--upload-cover" htmlFor="uploadCover" >Dodaj Okładkę</label>
            
                        <div>
                            {coverFile && <img className="admin-box__cover-image" src={coverFile.Base64} />}
                        </div>
                    </div>

                </div>
                <div className="admin-box__button" onClick={() => Submit()}>Zapisz</div>
            </div>

        </div >
    )


}