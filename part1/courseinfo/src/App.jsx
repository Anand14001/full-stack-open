import { useState } from "react"

const Header = ({name}) => {
  console.log(`Course name: ${name}`)
  return(
    <h1>{name}</h1>
  )
}

const Parts = ({part}) =>{
  console.log(`part: ${part.name},  exercises:${part.exercises}`)
  return(
    <div>
      <p>Part:{part.name} <br/> Excercises:{part.exercises}</p>
    </div>
  )
}


const Content = ({Course}) => {
  return(
    <div>
      {Course.parts.map((part, index) => (
        <Parts key={index} part={part}/>
      ))}
    </div>
  )
}



const Total = ({part}) => {
  const TotalExc = part[0].exercises + part[1].exercises + part[2].exercises 
  console.log(`Total number of exercises:${TotalExc}`)
  return(
    <div>
      <p>Total number of exercises: {TotalExc} </p>
    </div>
  )
}



function App() {
  const Course = {
      name:"Half Stack application development",
      parts:[
        {name:"Fundamentals of React", exercises:10},
        {name:"Using props to pass data", exercises:7},
        {name:"State of a component", exercises:14},
      ]
   
}


  return (
    <>
      <Header name={Course.name}/>
      <Content Course={Course}/>
      <Total part={Course.parts}/>
    </>
  )
}

export default App
