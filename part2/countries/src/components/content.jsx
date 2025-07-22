import CountriesList from "./Countries"
import Country from "./Country"

const Content = ({countries, showCountry}) => {
  if(countries.length > 10){
    return(
        <p>Too many matches, specify another filter</p>
    )
  }
  
  if (countries.length === 1){
    console.log(countries.length);
    console.log(countries[0].name.common);
    return <Country country={countries[0]}/>
  }
  
  if(countries.length >1 && countries.length <=10){
  return <CountriesList countries={countries} showCountry={showCountry} />
}

}

export default Content