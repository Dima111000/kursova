import { Container, Button } from 'react-bootstrap'
import { useContext } from 'react'
import { AppContext } from '../components/AppContext.js'
import { Link, useNavigate } from 'react-router-dom'
import { logout } from '../http/userAPI.js'

const User = () => {
    const { user } = useContext(AppContext)
    const navigate = useNavigate()

    const handleLogout = (event) => {
        logout()
        user.logout()
        navigate('/login', {replace: true})
    }

    return (
        <Container>
            <h1 className='mb-5'>Особистий кабінет</h1>
            {user.email !== undefined && user.email !== null && (
                <p>Ім'я користувача: {user.email}</p>
            )}
            <div className='d-flex user__buttons gap-3'>
                <ul>
                    <li className='user__link-block'><Link to="/user/orders">Історія замовлень</Link></li>
                </ul>
                <Button variant="danger" onClick={handleLogout}>Вийти</Button>
            </div>
        </Container>
    )
}

export default User