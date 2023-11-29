import Container from 'react-bootstrap/Container'

const Contacts = () => {
    return (
        <Container>
            <h1>Контакти</h1>
            <ul>
                <li>
                    <p>
                        Менеджер Дмитро: <a href="tel:380050111111">+380 50 111-11-11</a>
                    </p>
                </li>
                <li>
                    <p>
                        Менеджер Іван: <a href="tel:380050111111">+380 50 111-11-11</a>
                    </p>
                </li>
            </ul>
            <p>
                Час роботи: 08:00 - 20:00
            </p>
        </Container>
    )
}

export default Contacts