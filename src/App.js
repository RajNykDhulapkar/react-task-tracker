import { BrowserRouter as Router, Route } from 'react-router-dom'
import Header from './components/Header'
import Tasks from './components/Tasks'
import AddTask from './components/AddTask'
import Footer from './components/Footer'
import About from './components/About'
import { useState, useEffect } from 'react'

function App() {
  const [showAddTask, setShowAddTask] = useState(false)

  const [tasks, setTasks] = useState([])

  useEffect(() => {
    fetchTasks().then((data) => setTasks(data));
  }, [])

  const fetchTasks = async () => {
    const res = await fetch('http://localhost:8888/tasks')
    const data = await res.json()
    return data
  }

  const fetchTask = async (id) => {
    const res = await fetch(`http://localhost:8888/tasks/${id}`)
    const data = await res.json()
    return data
  }

  // Add task
  const addTask = async (task) => {
    // const id = Math.floor(Math.random()*10000) + 1
    // const newTask = {id, ...task}
    // setTasks([...tasks, newTask])

    const res = await fetch(`http://localhost:8888/tasks`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(task)
    })

    const data = await res.json()
    setTasks([...tasks, data])
  }

  // delete task 
  const deleteTask = async (id) => {
    await fetch(`http://localhost:8888/tasks/${id}`,
      { method: 'DELETE' })

    setTasks(tasks.filter((task) => task.id !== id))
  }

  // toggle reminder
  const toggleReminder = async (id) => {
    const taskToToggle = await fetchTask(id)
    console.log('task', taskToToggle)
    const updatedTask = { ...taskToToggle, reminder: !taskToToggle.reminder }
    const res = await fetch(
      `http://localhost:8888/tasks/${id}`,
      {
        method: 'PUT',
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify(updatedTask)
      }
    )
    const data = await res.json()

    setTasks(
      tasks.map((task) => task.id === id ? { ...task, reminder: data.reminder } : task)
    )

    // setTasks(tasks.map((task) =>  task.id === id ? {...task, reminder: !task.reminder} : task))
  }


  return (
    <Router>
      <div className="container">
        {/* <Header title="Hello"></Header> */}
        <Header onAdd={() => setShowAddTask(!showAddTask)}
          showAddTask={showAddTask}></Header>

        <Route path="/" exact render={(props) => (
          <>
            {showAddTask && (<AddTask onAdd={addTask}></AddTask>)}
            {tasks.length > 0 ? (
              <Tasks tasks={tasks}
                onDelete={deleteTask}
                onToggle={toggleReminder}
              ></Tasks>
            ) : (
              'No Tasks to show'
            )
            }
          </>
        )} />

        <Route path="/about" component={About} />
        <Footer></Footer>
      </div>
    </Router>
  );
}

// class App extends React.Component {
//   render(){
//     return <h1>Hello from a class</h1>
//   }
// }

export default App;
