import { useEffect, useState } from "react"
import getWeather from "../services/weather"

const Weather = ({capital, lat, lon}) => {
    const [weather, setWeather] = useState()


    useEffect(() => {
        if(lat && lon) {
       console.log('fetching weather of', capital)
    getWeather({lat, lon})
        .then((response) => 
            {
                setWeather(response)
            })}
    }, [lat, lon])
    
    
    return(
        <div>
            <h1>Weather in {capital}</h1>
             {weather ? (
                <>
                    <p>Temperature: {Math.round(weather.main.temp - 273.15)}°C</p>
                    <p>Wind: {weather.wind.speed} m/s</p>
                    <img src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} alt="Weather icon"></img>
                </>
            ):(
                <p>No Weather Data available!</p>
            )}
        </div>
    )
}

export default Weather