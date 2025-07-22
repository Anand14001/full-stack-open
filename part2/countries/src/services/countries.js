import axios from "axios"

const baseURL = 'https://studies.cs.helsinki.fi/restcountries/api/all'

const getCountries = () => {
    const request = axios
    .get(baseURL)
    return(
        request.then((res => res.data))
    )
    
}

export default getCountries