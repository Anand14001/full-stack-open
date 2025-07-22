    const CountryFilter = ({filter, filterChange}) => {
    return(
        <div>

       Search Country: <input value={filter} onChange={filterChange} type='search' />
        </div>
    )
}

export default CountryFilter