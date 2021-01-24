import React, { useState, useEffect } from "react";
import { MenuItem, FormControl, Select, Card, CardContent } from "@material-ui/core";
import InfoBox from './InfoBox';
import Mapa from './Map';
import './App.css';
import Table from "./Table";
import { sortData, prettyPrintStat } from "./util";
import numeral from "numeral";
import LineGraph from './LineGraph';
import "leaflet/dist/leaflet.css";

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setCasesType] = useState("cases");

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
    .then(response => response.json())
    .then(data => {
      setCountryInfo(data);
    });
  }, []);

  useEffect(() => {
    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
      .then((response) => response.json())          
      .then((data) => {
        const countries = data.map((country) => ({
          name: country.country,  //United States, United Kingdom
          value: country.countryInfo.iso2, //Uk, USA, FR
        }));
        const sortedData = sortData(data); 
        setTableData(sortedData); // ou setTableData(data);
        setMapCountries(data);
        setCountries(countries);
      });
    };

    getCountriesData();
  }, []);

    const onCountryChange = async (event) => {
    const countryCode = event.target.value;
    setCountry(countryCode);

    const url = countryCode === "worldwide" ? 
    "https://disease.sh/v3/covid-19/all" : 
    `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    await fetch(url)
    .then((response) => response.json())
    .then((data) => {
      setCountry(countryCode);
      setCountryInfo(data);

      setMapCenter([data.countryInfo.lat, data.countryInfo.lng]);
      setMapZoom(4);
    })
  };

  return (
    <div className="app">
      <div className="app_left">
      <div className="app_header">
        <h1>COVID TRACKER</h1>

        <FormControl className="app_dropdown">
          <Select variant="outlined" onChange={onCountryChange} value={country} >
            <MenuItem value="worldwide">No Mundo Todo</MenuItem>
            {countries.map((country) => (
                <MenuItem value={country.value}>{country.name}</MenuItem>
              ))}
          </Select>
        </FormControl>

      </div>

      <div className="app_stats">
        <InfoBox 
          onClick={(e) => setCasesType("cases")}
          title="Casos Confirmados"
          isRed
          active={casesType === "cases"}
          cases={prettyPrintStat(countryInfo.todayCases)}
          total={numeral(countryInfo.cases).format("0.0a")}
        />
        <InfoBox 
          onClick={(e) => setCasesType("recovered")}
          title="Recuperados"
          active={casesType === "recovered"}
          cases={prettyPrintStat(countryInfo.todayRecovered)}
          total={numeral(countryInfo.recovered).format("0.0a")}
        />
        <InfoBox 
          onClick={(e) => setCasesType("deaths")}
          title="Mortes"
          isRed
          active={casesType === "deaths"}
          cases={prettyPrintStat(countryInfo.todayDeaths)}
          total={numeral(countryInfo.deaths).format("0.0a")}
        />
      </div>

      <Mapa
        countries={mapCountries} 
        casesType={casesType}
        center={mapCenter}
        zoom={mapZoom}
      />
      </div>
      <Card className="app_right">
        <CardContent>
          <div className="app__information">
            <h3>Casos vivos por país</h3>
            <Table countries={tableData} />
            <h3>Novos casos {casesType}</h3>
            <LineGraph casesType={casesType} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default App;