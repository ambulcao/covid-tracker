import React, { useState, useEffect } from "react";
import { MenuItem, FormControl, Select, Card, CardContent } from "@material-ui/core";
import InfoBox from './InfoBox';
import Map from './Map';
import './App.css';

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState('worldwide');

  useEffect(() => {
    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
      .then((response) => response.json())          
      .then((data) => {
        const countries = data.map((country) => ({
          name: country.country,  //United States, United Kingdom
          value: country.countryInfo.iso2, //Uk, USA, FR
        }));

        setCountries(countries);
      });
    };

    getCountriesData();
  }, []);

  const onCountryChange = async (event) => {
    const countryCode = event.target.value;
    setCountry(countryCode);
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
        <InfoBox title="Coronavirus Casos" cases={123} total={2000} />
        <InfoBox title="Recuperados" cases={1234} total={3000} />
        <InfoBox title="Mortes" cases={12345} total={4000} />
      </div>

      <Map />
      </div>
      <Card className="app_right">
        <CardContent>
          <h3>Casos vivos por país</h3>
          {/* Table */}
          <h3>Novos casos mundiais</h3>
          {/* Graph */}
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
