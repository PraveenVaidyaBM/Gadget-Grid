// external libraries
import { Container } from 'react-bootstrap'
import { Outlet } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import "react-toastify/ReactToastify.css"
// Components
import Header from './components/Header.jsx'
import Footer from './components/Footer'

const App = () => {

  return (
    <>
        <Header />
        <main className="container mt-2">
          <Container>
            <Outlet />
          </Container>
        </main>
        <Footer />
        <ToastContainer/>
    </> 
  )
}

export default App