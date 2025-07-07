import { useState } from "react"

const Title = (props) => {
 return <h1>{props.title}</h1>
}

const Anecdotes = (props) => {
  return(
    <div>
      <p>{props.anecdotes}</p>
      <p>has {props.votes} votes.</p>
    </div>
  )
}

const Button = (props) => {
  return<button onClick={props.onClick}>{props.text}</button>
}

const MostVotes = (props) => {
  console.log("Rendering MostVotes:")
  console.log("Anecdote with most votes:", props.anecdotes)
  console.log("Votes:", props.max)
  return(
    <div>
      <p>{props.anecdotes}</p>
      <p>has {props.max} votes.</p>
    </div>
      )
  
}

function App() {
    const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ]

  const [selected, setSelected] = useState(0)
  const [voted, setVoted] = useState(Array(anecdotes.length).fill(0))

  const handleNext = () => {
    let next = Math.floor(Math.random()*anecdotes.length);
    setSelected(next)
    console.log("Selected anecdote number:", next)
    console.log(anecdotes[selected])
  }

  const handleVoteClick = () => {
    const newVote =[...voted];
    newVote[selected] +=1
    setVoted(newVote)
  }

  const max = Math.max(...voted)
  const index = voted.indexOf(max)

  return (
    <>
    <Title title={"Anecdote of the day"}/>
    <Anecdotes anecdotes={anecdotes[selected]} votes={voted[selected]}/>
      <div>
        <Button text={"vote"} onClick={handleVoteClick} />
        <Button text={"next anecdote"} onClick={handleNext}/>
      </div>
    <Title title={'Anecdote with most votes'}/>
    <MostVotes anecdotes={anecdotes[index]} max={max} />  
      
    </>
  )
}

export default App
