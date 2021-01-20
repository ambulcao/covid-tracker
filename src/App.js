import React, { useState, useEffect } from "react";
import { MenuItem, FormControl, Select, Card, CardContent } from "@material-ui/core";
import InfoBox from './InfoBox';
import Map from './Map';
import './App.css';
import Table from "./Table";
import { sortData } from "./util";
import LineGraph from './LineGraph';

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);

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
    .then(response => response.json())
    .then(data => {
      setCountry(countryCode);
      setCountryInfo(data);
    })
  };

  console.log("COUNTRY INFO >>>>", countryInfo);

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
        <InfoBox title="Coronavirus Casos" cases={countryInfo.todayCases} total={countryInfo.cases} />
        <InfoBox title="Recuperados" cases={countryInfo.todayRecovered} total={countryInfo.recovered} />
        <InfoBox title="Mortes" cases={countryInfo.todayDeaths} total={countryInfo.deaths} />
      </div>

      <Map />
      </div>
      <Card className="app_right">
        <CardContent>
          <h3>Casos vivos por país</h3>
          <Table  countries={tableData} />
          <h3>Novos casos mundiais</h3>
          <LineGraph />
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
