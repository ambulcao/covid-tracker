import React, { useState } from "react";
import { MenuItem, FormControl, Select, } from "@material-ui/core";
import './App.css';

function App() {
  const [countries, setCountries] = useState(['USA', 'UK', 'INDIA']);


  return (
    <div className="app">
      <div className="app_header">
        <h1>COVID TRACKER</h1>

        <FormControl className="app_dropdown">
          <Select variant="outlined" value="abc">
            {/* Loop through all the countries and show a drop down list of the options */}

            {
              countries.map(country => (
                <MenuItem value={country}>{country}</MenuItem>
              ))
            }

            {/* <MenuItem value="worldwide">Worldwide</MenuItem>
            <MenuItem value="worldwide">Option 2</MenuItem>
            <MenuItem value="worldwide">Option 3</MenuItem>
  <MenuItem value="worldwide">Option 4</MenuItem> */}
          </Select>
        </FormControl>

      </div>

      { /* Header */}
      {/* Title + Select input dropdown field */}

      {/* InfoBoxs */}
      {/* InfoBoxs */}
      {/* InfoBoxs */}

      {/* Table */}
      {/* Graph */}

      {/* Map */}
    </div>
  );
}

export default App;
