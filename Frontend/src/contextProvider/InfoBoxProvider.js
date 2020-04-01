import React, { useState, useEffect, useRef, state, useContext, useReducer } from "react";
import { InfoBoxContext } from '../context/InfoBoxContext';

export const InfoBoxProvider = (props) => {

    const [isActive, setIsActive] = useState(false);
    const [informationList, setInformationList] = useState([]);


    const addInfo = (text) => {
        if (!isActive)
            setIsActive(true);
        setInformationList([...informationList, { text: text, type: 1 }]);
    }

    const removeInformation = () => {

        if (informationList.length <= 1) {
            setIsActive(false);
            setTimeout(removeLastInformtion, 1000)
            return
        }
        const tmpList = [];
        informationList.map((x, index) => {
            if (index != 0)
                tmpList.push(x);
        })

        setInformationList(tmpList);
    }

    const removeLastInformtion = () => {
        setInformationList([]);
    }



    const renderBox = (info) => {
        if (info)
            return (


                <div onClick={() => { removeInformation() }} className={`messsage-box--wrap `}>
                    {info.text}
                </div>

            )
    }

    useEffect(() => {

    }, [])

    useEffect(() => {

    }, [informationList])

    return (

        <InfoBoxContext.Provider
            value={
                {
                    addInfo,
                }
            }>
            <>
                <div className={`messsage-box ${isActive && "messsage-box--active"}`}  >
                    {informationList && renderBox(informationList[0])}
                </div>
                {props.children}

            </>
        </InfoBoxContext.Provider>

    )

}