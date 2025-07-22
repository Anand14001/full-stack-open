import Weather from "./Weather"

const Country = ({country}) => {
    return(
        <div>
            <h1>{country.name.common}</h1>
            {country.capital && <p>Capital {country.capital[0]}</p>}
            <p>Area {country.area}</p>

            <h1>Languages</h1>
            <ul>
                {Object.keys(country.languages || {}).map((lang) => (
                    <li key={lang}>{country.languages[lang]}</li>
                ))}
            </ul>

            <img src={country.flags.png} alt={country.flags.alt}></img>

            {country.capital && country.capitalInfo && country.capitalInfo.latlng && (
                <Weather 
                    capital={country.capital[0]} 
                    lat={country.capitalInfo.latlng[0]} 
                    lon={country.capitalInfo.latlng[1]}  
                />
            )}
        </div>
    )
}

export default Country