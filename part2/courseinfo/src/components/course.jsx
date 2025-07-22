const Header = ({ name }) => {
  return <h2>{name}</h2>;
};

const Content = ({parts}) => {
    return(
        <>
            {parts.map ((part) => (<Part key={part.id} parts={part} />)

            )}
        </>
    )
}

const Part = ({parts}) => {
    return (
        <p>{parts.name} {parts.exercises}</p>)
}

const Total = ({parts}) => {
    let total = 0;
    parts.forEach((part) => {
        total += part.exercises
    });
    return<p>Number of exerciess {total}</p>
}

const Course = ({ course }) => {
  return (
    <>
      <Header name={course.name} />
      <Content parts={course.parts} />
      <Total parts={course.parts} />
    </>
  );
};

export default Course;