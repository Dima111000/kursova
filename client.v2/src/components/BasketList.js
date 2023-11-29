import { useContext, useState } from 'react'
import { AppContext } from './AppContext.js'
import { increment, decrement, remove } from '../http/basketAPI.js'
import { Table, Spinner, Button } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import BasketItem from './BasketItem.js'
import { observer } from 'mobx-react-lite'
// import { isLogin } from '../http/isLoggin.js'

const BasketList = observer(() => {
    const { basket } = useContext(AppContext)
    const [fetching, setFetching] = useState(false)

    const navigate = useNavigate()

    const handleIncrement = (id) => {
        setFetching(true)
        increment(id)
            .then(
                data => basket.products = data.products
            )
            .finally(
                () => setFetching(false)
            )
    }

    const handleDecrement = (id) => {
        setFetching(true)
        decrement(id)
            .then(
                data => basket.products = data.products
            )
            .finally(
                () => setFetching(false)
            )
    }

    const handleRemove = (id) => {
        setFetching(true)
        remove(id)
            .then(
                data => basket.products = data.products
            )
            .finally(
                () => setFetching(false)
            )
    }

    if (fetching) {
        return <Spinner animation="border" />
    }

    return (
        <>
            {basket.count ? (
                <>
                    <Table bordered hover size="sm" className="mt-3">
                        <thead>
                            <tr>
                                <th>Найменування</th>
                                <th>Кількість</th>
                                <th>Ціна</th>
                                <th>Сума</th>
                                <th>Видалити</th>
                            </tr>
                        </thead>
                        <tbody>
                            {basket.products.map(item => 
                                <BasketItem
                                    key={item.id}
                                    increment={handleIncrement}
                                    decrement={handleDecrement}
                                    remove={handleRemove}
                                    {...item}
                                />
                            )}
                            <tr>
                                <th colSpan="3">Разом</th>
                                <th>{basket.sum}</th>
                                <th>грн.</th>
                            </tr>
                        </tbody>
                    </Table>
                    <Button onClick={() => navigate('/checkout')}>Оформити замовлення</Button>
                </>
            ) : (
                <p>Ваш кошик порожній</p>
            )}
        </>
    )
})

export default BasketList