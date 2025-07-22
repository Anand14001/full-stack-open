const Countries = ({countries, showCountry}) => {
    return(
        <div>
         
            {countries.map((country, index) => (
                <p key={index}>
                    {country.name.common} <button onClick={() => showCountry(country)}>show</button>
                </p>
            ))}
        </div>
    )
}

export default Countries