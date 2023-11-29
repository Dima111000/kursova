import { useContext } from 'react'
import { Card, Col, Button } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { append } from '../http/basketAPI'
import { AppContext } from '../components/AppContext.js'

const ProductItem = ({data}) => {
    const navigate = useNavigate();
    const { basket } = useContext(AppContext);

    const handleClick = (productId) => {
        append(productId).then(d => {
            basket.products = d.products
        })
    }

    return (
        <div data-id={data.id} className='store__product'>
            <Col className="mt-3 col-card store__card" onClick={() => navigate(`/product/${data.id}`)}>
                <Card className="card product__image-block">
                    {data.image ? (
                        <Card.Img variant="top" className="product__image" src={process.env.REACT_APP_IMG_URL + data.image} />
                    ) : (
                        <Card.Img variant="top" className="product__image" src="http://via.placeholder.com/200" />
                    )}
                </Card>
                <Card.Body>
                    <p>Бренд: <strong>{data.brand.name}</strong></p>
                    <p>Назва товару: <strong>{data.name}</strong></p>
                    <p>Ціна: <strong>{data.price} грн.</strong></p>
                </Card.Body>
            </Col>
            <Button onClick={() => handleClick(data.id)}>Додати до кошика</Button>
        </div>
    )
}

export default ProductItem