import React, { useState, useEffect, state, useContext, useReducer } from "react";
import Select from 'react-select';
import { ArtistFetch } from '../../../featchApi/ArtistFetch'
import { AlbumFetch } from '../../../featchApi/AlbumFetch'
import FileBase64 from '../../../FileToBase64'
import config from '../../../config.json'

export const EditorAlbumAdmin = (props) => {

    const artistF = new ArtistFetch();
    const albumF = new AlbumFetch();


    const [artistList, setArtistList] = useState([]);
    const [artistValue, setArtistValue] = useState(null);
    const [albumName, setAlbumName] = useState(null);
    const [coverFile, setCoverFile] = useState(null);
    const [trackFileList, setTrackFileList] = useState([])
    const [album, setAlbum] = useState(null)

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
    const ArtistSelect = (idArtists) => {


        const resfind = artistList.find(x => {

            return x.value == idArtists;
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
    const SaveTrack = (obj) => {

        if (!obj.name)
            return
        const type = obj.type.slice(0, 5)

        if (type != "audio")
            return
        const track = {
            Base64: obj.base64,
            Name: obj.name,
            Type: obj.type
        }

        setTrackFileList([...trackFileList, { ...track }]);

    }


    const Submit = () => {

        let obj = {
            name: albumName,
            ArtistIdString: artistValue.value,
            Cover: coverFile,
            Songs: trackFileList
        }
        albumF.saveAlbum(obj)
    }

    const Update = () => {
        let obj = album;
        obj.songs = trackFileList
        if (coverFile) {
            obj.cover = coverFile
        }
        if (albumName) {
            obj.name = albumName
        }
        albumF.updateAlbum(obj);
        console.log(obj);
    }


    const ChangeTrackName = (id, name) => {
        const tmpTracks = trackFileList;
        tmpTracks[id].Name = name
        setTrackFileList([...tmpTracks])

    }

    const RemoveTrack = (id) => {
        let tmpTracks = trackFileList;
        tmpTracks.splice(id, 1)
        setTrackFileList([...tmpTracks])
    }

    const GetAlbum = async () => {
        const id = props.match.params.id;
      
        if (id == undefined)
            return
        const res = await albumF.getAlbum(id)
        console.log(res)
        setAlbum(res.playlist)
        setAlbumName(res.playlist.name)

        let tmpTracks = [];
        if (res.playlist.songs) {
            res.playlist.songs.map((x) => {
                tmpTracks.push({ Name: x.name, idString: x.idString })
            })
        }
        setTrackFileList([...tmpTracks])

    }

    useEffect(() => {
        GetArtistList()
        GetAlbum()


    }, []);
    useEffect(() => {
        if (album)
            ArtistSelect(album.artistIdString)

    }, [artistList, album]);
    useEffect(() => {

    }, [trackFileList, artistList, artistValue]);

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
                    <input type="text" value={albumName ? albumName : ''} name="name" className="admin-box__input" onChange={x => setAlbumName(x.currentTarget.value)} />
                </div>

                <div>
                    <div className="admin-box__text">Okładka:</div>

                    <div className="admin-box__row">
                        <FileBase64
                            multiple={false}
                            onDone={x => SaveCover(x)}
                            id="uploadCover"
                            className="admin-box__hidden-element"
                        />


                        <label className="admin-box__button admin-box__button--upload-cover" htmlFor="uploadCover" >Dodaj Okładkę</label>

                        <div>
                            {coverFile && <img className="admin-box__cover-image" src={coverFile.Base64} />}
                            {!coverFile && album && album.cover && album.cover.path && <img className="admin-box__cover-image" src={config.apiRoot + '/' + album.cover.path} />}
                        </div>
                    </div>

                </div>
                <div>
                    <div className="admin-box__text">Utwory:</div>

                    <div>

                        {trackFileList.length <= 0 && <div className="admin-box__text">Brak utworów</div>}
                        {trackFileList.length > 0 &&
                            trackFileList.map((item, index) => (
                                <div key={index} className="admin-box__row">
                                    <div className="admin-box__text">{index + 1}</div>
                                    <input onChange={x => ChangeTrackName(index, x.currentTarget.value)} value={item.Name} type="text" name="track" className="admin-box__input" />
                                    <div onClick={() => RemoveTrack(index)} className="admin-box__ico admin-box__ico--remove-track "> <i className="fa fa-window-close" aria-hidden="true"></i></div>
                                </div>
                            ))
                        }
                    </div>

                    <div className="admin-box__row">
                        <FileBase64
                            className="admin-box__hidden-element"
                            multiple={false}
                            onDone={x => SaveTrack(x)}
                            id="uploadTrack"

                        />

                        <label className="admin-box__button admin-box__button--upload-cover" htmlFor="uploadTrack" >Dodaj Utwór</label>
                    </div>
                    {!album && <div className="admin-box__button" onClick={() => Submit()}>Zapisz</div>}
                    {album && <div className="admin-box__button" onClick={() => Update()}>Zaktualizuj</div>}
                </div>
            </div>
        </div >
    )


}