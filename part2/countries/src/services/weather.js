import axios from "axios"
const baseURL = `https://api.openweathermap.org/data/2.5/weather`
const api_key = import.meta.env.VITE_API_KEY

const getWeather = ({lat, lon}) => {
   const request = axios.get(`${baseURL}?lat=${lat}&lon=${lon}&appid=${api_key}`)

    return request
    .then((response => response.data))
}

export default getWeather