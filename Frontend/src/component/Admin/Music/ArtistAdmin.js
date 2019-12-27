import React, { useState, useEffect, state, useContext, useReducer } from "react";
import { Link } from 'react-router-dom';
import Select from 'react-select';
import { ArtistFetch } from '../../../featchApi/ArtistFetch'
import config from '../../../config.json'


export const ArtistAdmin = () => {

    const artistF = new ArtistFetch();

    const [artistList, setArtistList] = useState([]);
    const [artistInfo, setArtistInfo] = useState(null);
    const [newArtist, setNewArtist] = useState(null);

    const UpdateNewArtist = e => {
        setNewArtist({ ...newArtist, [e.name]: e.value })
    }


    const GetArtistList = async () => {
        const res = await artistF.getArtists();

        if (!res.succeeded)
            return

        let artistTMP = []
        res.artists.length > 0 && res.artists.map(x => {
            artistTMP.push({ value: x.idString, label: x.name, name: "artistList", })
        })
        setArtistList(artistTMP);
    }

    const GetArtist = async (id) => {
        const res = await artistF.getArtist(id)
        console.log(res);
        if (!res.succeeded)
            return
        let albums = [];
        res.artist.albums.length > 0 && res.artist.albums.map(x => {
            albums.push({ name: x.name, idString: x.idString, cover: x.cover.path, countSongs: x.songs.length })
        })
        setArtistInfo({
            albums,
            name: res.artist.name,
            idString: res.artist.idString
        })
    }

    const SaveArtist = async (event) => {
        event.preventDefault();
        const res = await artistF.saveArtist(newArtist);
        console.log(res)
        
    }

    useEffect(() => {
        GetArtistList();
    }, []);
    useEffect(() => {

    }, [artistInfo])
    return (
        <div className="user__view">

            <div className="admin-box">
                <div className="admin-box__top">
                    <div>Dodaj Artystę</div>
                    <form onSubmit={x=> SaveArtist(x)}>
                        <input type="text" name="name" onChange={x => UpdateNewArtist(x.target)} />
                        <input type="submit" value="Dodaj" />
                    </form>
                </div>

            </div>
            <div className="admin-box">
                <div className="admin-box__top">
                    <div className="admin-box__select-position">
                        <Select
                            className="admin-box__select "
                            options={artistList}
                            onChange={x => GetArtist(x.value)}
                        />
                    </div>
                    <div className="admin-box__button-section">
                        <div className="admin-cover__button"> Dodaj Album </div>
                        <div className="admin-cover__button"> Edytuj Artystę </div>
                    </div>
                </div>
                <div className="admin-box__content">
                    {artistInfo && <>
                        <div>
                            {artistInfo.albums.length > 0 && artistInfo.albums.map(x => (
                                <div key={x.idString} className="admin-cover">

                                    <div className="admin-cover__element"> {x.cover && <img className="admin-cover__image" src={config.apiRoot + "/" + x.cover} />}</div>
                                    <div className="admin-cover__element">
                                        <div>Nazwa</div>
                                        <div> {x.name}</div>
                                    </div>
                                    <div className="admin-cover__element">
                                        <div>Ilość utworów</div>
                                        <div> {x.countSongs}</div>
                                    </div>
                                    <div className="admin-cover__button"> Edytuj</div>
                                    <div className="admin-cover__button"> Dodaj utwór</div>
                                    <div className="admin-cover__button admin-cover__button--remove"> Usuń</div>
                                </div>
                            ))}
                        </div>

                    </>}
                </div>
            </div>
        </div>
    )

}