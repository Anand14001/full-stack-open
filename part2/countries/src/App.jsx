import axios from "axios"
import { useEffect, useState } from "react"
import CountryFilter from "./components/countryFilter";
import Content from "./components/content";
import getCountries from "./services/countries";

function App() {
  const [allCountries, setAllCountries] = useState([])
  const [countries, setCountries] = useState([])
  const [filter, setFilter] = useState('');

  useEffect(() => {
    console.log("fetching country data...")
    axios
      getCountries()
      .then((res) => {
        setAllCountries(res)
      })
      .catch((err) => console.error("Failed to fetch countries:", err));
  }, [])
  
const handleFilterChange = (event) => {
  const newFilter = event.target.value;
  setFilter(newFilter);
  const filteredCountries = allCountries.filter((country) =>
    country.name.common.toLowerCase().includes(newFilter.toLowerCase())
  );
  setCountries(filteredCountries);
};



  console.log("filtered countries:", countries)


  const handleSelectCountry = (country) => {
    setCountries([country])
  }

  return (
      <div>
          <CountryFilter filter={filter} filterChange={handleFilterChange} />
          <Content countries={countries} setCountries={setCountries} showCountry={handleSelectCountry} />
      </div>
 
  )
}

export default App
