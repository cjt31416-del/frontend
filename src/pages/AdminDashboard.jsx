import React, { useState, useEffect } from 'react'

export default function Display({ onLogout }) {

  const [students, setStudents] = useState([])
  const [studentId, setStudentId] = useState('')
  const [name, setName] = useState('')
  const [course, setCourse] = useState('')
  const [yearLevel, setYearLevel] = useState('')

  const api_url = 'http://localhost:8080/api/students'

  useEffect(() => {
    fetch(api_url)
      .then((response) => response.json())
      .then((data) => {
        setStudents(data)
      })
      .catch((err) => {
        console.log(err)
      })
  }, [])

  async function formSubmit(event) {
    event.preventDefault()

    try {
      const response = await fetch(api_url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          studentId: studentId,
          name: name,
          course: course,
          yearLevel: yearLevel
        })
      })

      const newStudent = await response.json()

      setStudents((currentStudents) => [
        ...currentStudents,
        newStudent
      ])

      setStudentId('')
      setName('')
      setCourse('')
      setYearLevel('')
    } catch (err) {
      console.log(err)
    }
  }

  function handleLogout() {
    onLogout?.()
  }

  return (
    <div className="bg-primary-subtle" style={{ minHeight: "100vh" }}>
      <div className="text-center d-flex justify-content-center flex-column bg-primary-subtle">

        <header className="fw-bold text-primary text-start bg-dark m-2 p-4 mx-1">
          Student Information System
          <i className='bi bi-mortarboard text-primary m-1'></i>
        </header>

        <h1
          className="fw-bold text-primary"
          style={{ fontFamily: 'monospace' }}
        >
          Students
        </h1>

        <form onSubmit={formSubmit}>

          <label
            className="fw-light"
            htmlFor="studentId"
          >
            Student ID:
          </label>

          <input
            type="text"
            className="form-control"
            style={{ width: "300px", margin: "auto" }}
            id="studentId"
            placeholder="Student ID"
            value={studentId}
            onChange={(event) =>
              setStudentId(event.target.value)
            }
          />

          <label
            className="fw-light"
            htmlFor="name"
          >
            Name:
          </label>

          <input
            type="text"
            className="form-control"
            style={{ width: "300px", margin: "auto" }}
            placeholder="Name"
            id="name"
            value={name}
            onChange={(event) =>
              setName(event.target.value)
            }
          />

          <label
            className="fw-light"
            htmlFor="course"
          >
            Course:
          </label>

          <input
            type="text"
            className="form-control"
            style={{ width: "300px", margin: "auto" }}
            placeholder="Course"
            id="course"
            value={course}
            onChange={(event) =>
              setCourse(event.target.value)
            }
          />

          <label
            className="fw-light"
            htmlFor="yearLevel"
          >
            Year Level:
          </label>

          <input
            type="text"
            className="form-control mb-2"
            style={{ width: "300px", margin: "auto" }}
            placeholder="Year Level"
            id="yearLevel"
            value={yearLevel}
            onChange={(event) =>
              setYearLevel(event.target.value)
            }
          />

          <input
            type="submit"
            value="Submit"
          />

        </form>

        <table
          className="table table-striped mt-3"
          style={{ border: '1px solid black' }}
        >

          <thead className='table-dark'>
            <tr>
              <td>Student ID</td>
              <td>Name</td>
              <td>Course</td>
              <td>Year Level</td>
            </tr>
          </thead>

          <tbody className="table">

            {students.map((student, index) => (
              <tr key={index}>

                <td>
                  {student.studentId}
                </td>

                <td>
                  {student.name}
                </td>

                <td>
                  {student.course}
                </td>

                <td>
                  {student.yearLevel}
                </td>

              </tr>
            ))}

          </tbody>

        </table>

        <div className='fixed-bottom'>

          <button
            type="button"
            className="btn btn-outline-primary btn-lg my-3"
            onClick={handleLogout}
          >
            Logout
          </button>

        </div>

      </div>
    </div>
  )
}