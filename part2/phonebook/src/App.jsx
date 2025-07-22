import { useEffect, useState } from 'react'
import Filter from './components/Filter';
import PersonList from './components/PersonList';
import PersonForm from './components/PersonForm';
import personService from './services/persons'
import Notification from './components/Notification';

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [filter, setFilter] = useState('');
  const [message, setMessage] = useState();
  const [messageStyle, setMessageStyle] = useState();


  useEffect(() => {
    console.log('effect');

   personService.getData()
   .then((response) => {
    setPersons(response)
   })
  }, [])

  console.log('render', persons.length, 'person')

  const addPerson = (event) => {
    event.preventDefault();

    const nameExist = persons.find(person => person.name === newName);

    if (nameExist) {
      const confirmUpdate = window.confirm(`${newName} is already on the phonebook, replace the old number with new one?`)

      if(confirmUpdate){
        const modifyPerson = {...nameExist, number:newNumber}
        personService.updatePerson(nameExist.id, modifyPerson)
        .then(
          response => {
            setPersons(persons.map(person => person.id  == nameExist.id ? response : person))
            setMessage(`updated number of ${nameExist.name}`)
            setMessageStyle({color:'green', border: '2px solid green'})
            setTimeout(() => {
              setMessage(null)
            }, 5000);
          }
        )

        .catch(error => {
          setMessage(`Information of ${nameExist.name} has already been removed from the server`)
          setMessageStyle({ color: 'red', border: '2px solid red' })
          setTimeout(() => {
            setMessage(null)
          }, 5000);
          setPersons(persons.filter(person => person.id !== nameExist.id))
        })
      }
      return;
    
    }

    const nameObject = {
      name: newName,
      number: newNumber,
      id: String(persons.length + 1)
    }

    console.log(`Added ${newName} ${newNumber}`)
    personService.addPerson(nameObject)
    .then(Response => {
      setPersons(persons.concat(Response))
      setMessage(`Added ${nameObject.name} `)
      setMessageStyle({color:'green', border: '2px solid green',})
      setTimeout(() => {
        setMessage(null)
      }, 5000);
    })

    setNewName('')
    setNewNumber('')
  }

  const handleNameChange = (event) => {
    console.log(event.target.value);
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    console.log(event.target.value);
    setNewNumber(event.target.value)
  }

  const handleDeletePerson = (person) => {
    if(window.confirm(`Delete ${person.name} ? `)){
      personService
      .deletePerson(person.id)
         .then(() => {
        setPersons(persons.filter(p => p.id !== person.id));
        setMessage(`Deleted ${person.name}`);
        setMessageStyle({ color: 'green', border: '2px solid green' });
        setTimeout(() => {
          setMessage(null);
        }, 5000);
      })
      .catch((error) => {
        setMessage(`Information of ${person.name} is already deleted from the server`)
        setMessageStyle({color:'red',border: '2px solid red'}),
        setTimeout(() => {
          setMessage(null)
        }, 5000)
        setPersons(persons.filter(p => p.id !== person.id));
      })
      
      
    }
  }

  const personToShow = filter
  ? persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()))
  : persons;

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }
  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} style={messageStyle} />
      <Filter filter={filter} onChange={handleFilterChange} />
      <h2>add a new</h2>
      <PersonForm submit={addPerson} newName={newName} handleNameChange={handleNameChange} newNumber={newNumber} handleNumberChange={handleNumberChange}/>
      <h2>Numbers</h2>
      <PersonList PersonArray={personToShow} deletePerson={handleDeletePerson}/>
     
    </div>
  )
}

export default App