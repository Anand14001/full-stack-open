const PersonForm = ({submit,newName,handleNameChange,newNumber,handleNumberChange }) => {
   return(
   <div>
        <form onSubmit={submit}>
            <div>
                name: <input value={newName} onChange={handleNameChange}/>
            </div>
            <div>
                number: <input value={newNumber} onChange={handleNumberChange}/>
            </div>

            <button type="submit">add</button>

        </form>
    </div>
   )
}

export default PersonForm;