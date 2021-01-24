import React from "react";
import numeral from "numeral";
import { Circle, Popup } from "react-leaflet";

const casesTypeColors = {
    cases: {
        hex: "#CC1034",
        multiplier: 400,
    },
    recovered: {
        hex: "#7dd71d",
        multiplier: 800,
    },
    deaths: {
        hex: "fb4443",
        multiplier: 1600,
    },
};

export const sortData = (data) => {
    const sortedData = [...data];

    return sortedData.sort((a, b) => (a.cases > b.cases ? -1 : 1));
};

//Desenhos de círculos no mapa com ferramenta interativa.

export const showDataOnMap = (data, casesType="cases") => 
    data.map((country) => (
        <Circle
            center={[country.countryInfo.lat, country.countryInfo.long]}
            fillOpacity={0.4}
            color={casesTypeColors[casesType].hex}
            fillColor={casesTypeColors[casesType].hex}
            radius={
                Math.sqrt(country[casesType]) * casesTypeColors[casesType].multiplier
            }
        >
            <Popup>
                <div className="info-container">
                    <div 
                        className="info-flag"
                        style={{ backgroundImage: `url(${country.countryInfo.flag})` }}
                    />
                    <div className="info-name">{country.country}</div>
                    <div className="info-confirmed">Casos Confirmados: {numeral(country.cases).format("0.0")}</div>
                    <div className="info-recovered">Recuperados: {numeral(country.recovered).format("0.0")}</div>
                    <div className="info-deaths">Mortes: {numeral(country.deaths).format("0.0")}</div>
                </div>    
            </Popup>
        </Circle>    
    ));