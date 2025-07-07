import { useState } from "react"

const Button = ({name, onClick}) => {
  return <button onClick={() => onClick(name)} >{name}</button>
}

const Statistics = ({data}) => {
  const sum = data.good + data.neutral + data.bad;
  if(sum == 0) {
    return(
      <div>
        <h3>No feedback given</h3>
      </div>
    )
  }
  return(
    <>
      <table>
         
        <tbody>
          <StatisticsLine value={data.good} text={"good"}/>
          <StatisticsLine value={data.neutral} text={"neutral"}/>
          <StatisticsLine value={data.bad} text={"bad"}/>
          <StatisticsLine value={sum} text={"total"}/>
          <StatisticsLine value={(data.good*1 + data.neutral*0 + data.bad*(-1))/sum} text={"average"}/>
          <StatisticsLine value={`${parseFloat(data.good / sum)*100}%`} text={"positive"}/>
        </tbody>
      </table>
   
    </>
  )
}

const StatisticsLine = (props) => {
  return(
    <tr>
      <td>{props.text}</td>
      <td>{props.value}</td>
    </tr>
  )
}

function App() {
  const [good, setGood] =useState(0);
  const [bad, setBad] = useState(0);
  const [neutral, setNeutral] = useState(0);

  const statisticsData = {
    good:good,
    bad:bad,
    neutral:neutral,
  }

  const handleFeedback = (type) => {
  if (type === "good") {
    setGood(good + 1)
  } else if (type === "neutral") {
    setNeutral(neutral + 1)
  } else if (type === "bad") {
    setBad(bad + 1)
  }
}


  return (
    <>
     <h1>give feedback</h1>

     <div>
      <Button name={"good"} onClick ={handleFeedback} />
      <Button name={"neutral"} onClick ={handleFeedback}/>
      <Button name={"bad"} onClick ={handleFeedback}/>
     </div>

      <h1>Statistics</h1>
     <Statistics data={statisticsData}/>

    </>
  )
}

export default App
