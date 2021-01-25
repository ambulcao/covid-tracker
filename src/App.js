import React, { useState, useEffect } from "react";
import './App.css';
import { MenuItem, FormControl, Select, Card, CardContent } from "@material-ui/core";
import InfoBox from './InfoBox';
import LineGraph from './LineGraph';
import Table from "./Table";
import { sortData, prettyPrintStat } from "./util";
import numeral from "numeral";
import Mapa from './Map';
import "leaflet/dist/leaflet.css";

const App = () => {
  const [country, setInputCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [countries, setCountries] = useState([]);
  const [mapCountries, setMapCountries] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [casesType, setCasesType] = useState("cases");
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
  const [mapZoom, setMapZoom] = useState(3);

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
    .then((response) => response.json())
    .then((data) => {
      setCountryInfo(data);
    });
  }, []);

  useEffect(() => {
    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
      .then((response) => response.json())          
      .then((data) => {
        const countries = data.map((country) => ({
          name: country.country,
          value: country.countryInfo.iso2, 
        }));
        let sortedData = sortData(data); 
        setCountries(countries);
        setMapCountries(data);
        setTableData(sortedData); // ou setTableData(data);
      });
    };

    getCountriesData();
  }, []);

    const onCountryChange = async (e) => {
    const countryCode = e.target.value;

    const url = countryCode === "worldwide" ? 
    "https://disease.sh/v3/covid-19/all" : 
    `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    await fetch(url)
    .then((response) => response.json())
    .then((data) => {
      setInputCountry(countryCode);
      setCountryInfo(data);
      setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
      setMapZoom(4);
      //setCountry(countryCode);
    });
  };

  return (
    <div className="app">
      <div className="app_left">
      <div className="app_header">
        <h1>COVID TRACKER</h1>
        <FormControl className="app_dropdown">
          <Select variant="outlined" value={country} onChange={onCountryChange}>
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
};

export default App;