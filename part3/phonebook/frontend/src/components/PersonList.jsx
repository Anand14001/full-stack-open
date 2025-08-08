const PersonList = ({PersonArray, deletePerson}) => {
    return(
        <div>
            {PersonArray.map((el) => <p key={el.id}>
                {el.name} {el.number}  <button onClick={() => deletePerson(el)} >Delete</button>
            </p>)}
        </div>
    )
}

export default PersonList;