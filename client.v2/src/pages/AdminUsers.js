import { useEffect, useState } from "react"
import { getAll, deleteUser } from '../http/userAPI'
import { Container, Spinner, Table, Button, Modal } from "react-bootstrap"

const AdminUsers = () => {
    const [users, setUsers] = useState(null)
    const [fetching, setFetching] = useState(true)
    const [change, setChange] = useState(false)
    const [showModal, setShowModal] = useState(false);
    const [userIdToDelete, setUserIdToDelete] = useState(null);

    const removeUser = (id) => {
        setUserIdToDelete(id);
        setShowModal(true);
    }

    const handleDeleteConfirmation = () => {
        deleteUser(userIdToDelete)
            .then(data => {
                setChange(!change)
                alert(`Пользователь удален`)
            })
            .finally(() => {
                setShowModal(false);
                setUserIdToDelete(null);
            });
    }

    useEffect(() => {
        getAll()
            .then(data => {
                if (data.length) {
                    const allUsers = data.reduce((acc, user) => {
                        if (user.role !== 'ADMIN') {
                            acc.push(user);
                        }
                        return acc;
                    }, [])

                    allUsers.forEach((user) => {
                        const orignalDate = user.createdAt
                        const formattedDate = new Date(orignalDate)

                        const day = formattedDate.getUTCDate()
                        const month = formattedDate.getUTCMonth() + 1
                        const year = formattedDate.getUTCFullYear()
                        const hours = formattedDate.getUTCHours()
                        const minutes = formattedDate.getUTCMinutes()

                        const formattedDay = day < 10 ? `0${day}` : day
                        const formattedMonth = month < 10 ? `0${month}` : month
                        const formattedHours = hours < 10 ? `0${hours}` : hours
                        const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes

                        const formattedDateString = `${formattedDay}.${formattedMonth}.${year} ${formattedHours}:${formattedMinutes}`

                        user.createdAt = formattedDateString
                    })

                    setUsers(allUsers)
                }
            })
            .finally(() => setFetching(false))
    }, [change])

    if (fetching) {
        return <Spinner animation="border" />
    }

    return (
        <Container>
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Підтвердження видалення</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Ви впевнені, що хочете видалити користувача?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Відміна
                    </Button>
                    <Button variant="danger" onClick={handleDeleteConfirmation}>
                        Видалити
                    </Button>
                </Modal.Footer>
            </Modal>

            <h1>Користувачі магазину</h1>
            {users.length > 0 ? (
                <Table>
                    <thead>
                        <tr>
                            <th>Емейл користувача</th>
                            <th>Дата створення облікового запису</th>
                            <th>Видалити користувача</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => 
                            <tr key={user.id}>
                                <td>{user.email}</td>
                                <td>{user.createdAt}</td>
                                <td>
                                    <Button variant="danger" size="sm" onClick={() => removeUser(user.id)}>
                                        Видалити
                                    </Button>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            ) : (
                <p>Упс! А користувачів немає</p>
            )}
        </Container>
    )
}

export default AdminUsers