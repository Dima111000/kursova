import { Container, Button } from 'react-bootstrap'
import { useContext } from 'react'
import { AppContext } from '../components/AppContext.js'
import { Link, useNavigate } from 'react-router-dom'
import { logout } from '../http/userAPI.js'

const Admin = () => {
    const { user } = useContext(AppContext)
    const navigate = useNavigate()

    const handleLogout = (event) => {
        logout()
        user.logout()
        navigate('/login', {replace: true})
    }

    return (
        <Container>
            <h1>Панель управления</h1>
            <p>
                Это панель управления магазином для администратора
            </p>
            <ul>
                <li><Link to="/admin/orders">Замовлення у магазині</Link></li>
                <li><Link to="/admin/categories">Категорії каталогу</Link></li>
                <li><Link to="/admin/brands">Бренди каталогу</Link></li>
                <li><Link to="/admin/products">Товари каталогу</Link></li>
                <li><Link to="/admin/users">Користувачі магазину</Link></li>
            </ul>
            <Button onClick={handleLogout}>Вийти</Button>
        </Container>
    )
}

export default Admin