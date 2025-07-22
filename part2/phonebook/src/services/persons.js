import axios from "axios"
const baseURL = 'http://localhost:3001/persons'


const getData = () => {
    const request = axios.get(baseURL)
    return request
    .then((res => res.data))
}

const addPerson = newObject => {
    const request = axios.post(baseURL, newObject)
    return request
    .then((res => res.data))
}

const deletePerson = id => {
    const request = axios.delete(`${baseURL}/${id}`)
    return request
    .then(() => console.log(`person with id: ${id} is deleted from the server.`))
}

const updatePerson = (id, person) => {
    const request = axios.put(`${baseURL}/${id}`, person)
    return request
    .then((response => response.data))
}

export default {getData, addPerson, deletePerson, updatePerson}