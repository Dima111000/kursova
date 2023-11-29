import { Button, Card, Col } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import product from "../pages/Product";
import { useContext, useState } from "react";
import { append } from "../http/basketAPI";
import { AppContext } from "./AppContext";

const ProductItem = ({data}) => {
    const { basket } = useContext(AppContext)
    const handleClick = (productId) => {
        append(productId).then(data => {
            basket.products = data.products
        })
    }
    const navigate = useNavigate()
    return (
        <Col xl={4} lg={4} sm={6} className="mt-3">
            <Card style={{display: "flex", alignItems: "center", justifyContent: "center", paddingTop: 8, paddingBottom: 8}}>
                <Card style={{maxWidth: 250, cursor: 'pointer', display: "flex", alignItems: "center", justifyContent: "center", border: "none"}} onClick={() => navigate(`/product/${data.id}`)}>
                    {data.image ? (
                        <Card.Img variant="top" src={process.env.REACT_APP_IMG_URL + data.image} style={{maxWidth: 180, minHeight: 180}} />
                    ) : (
                        <Card.Img variant="top" src="http://via.placeholder.com/200" />
                    )}
                    <Card.Body style={{minHeight: 120, overflow: 'hidden', marginTop: 40, marginBottom: 5}}>
                        <p>Бренд: {data.brand.name}</p>
                        <p>Категория: {data.category.name}</p>
                        <p>Цена: {data.price} грн.</p>
                        <strong>{data.name}</strong>
                    </Card.Body>
                </Card>
                <Button style={{maxWidth: 200}} onClick={() => handleClick(data.id)}>Добавить в корзину</Button>
            </Card>
        </Col>
    )
}

export default ProductItem