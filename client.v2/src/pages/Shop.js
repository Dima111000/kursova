import { Container, Row, Col, Spinner, Button } from 'react-bootstrap'
import CategoryBar from '../components/CategoryBar.js'
import BrandBar from '../components/BrandBar.js'
import ProductList from '../components/ProductList.js'
import PriceBar from '../components/PriceBar.js'
import { useContext, useEffect, useState } from 'react'
import { AppContext } from '../components/AppContext.js'
import { fetchCategories, fetchBrands, fetchAllProducts } from '../http/catalogAPI.js'
import { observer } from 'mobx-react-lite'
import { useLocation, useSearchParams, useNavigate } from 'react-router-dom'

const getSearchParams = (searchParams) => {
    let category = searchParams.get('category')
    if (category && /[1-9][0-9]*/.test(category)) {
        category = parseInt(category)
    }
    let brand = searchParams.get('brand')
    if (brand && /[1-9][0-9]*/.test(brand)) {
        brand = parseInt(brand)
    }
    let price = searchParams.get('price')
    let page = searchParams.get('page')
    if (page && /[1-9][0-9]*/.test(page)) {
        page = parseInt(page)
    }
    return {category, brand, price, page}
}

const Shop = observer(() => {
    const { catalog } = useContext(AppContext)
    const navigate = useNavigate();

    const [categoriesFetching, setCategoriesFetching] = useState(true)
    const [brandsFetching, setBrandsFetching] = useState(true)
    const [productsFetching, setProductsFetching] = useState(true)

    const location = useLocation()
    const [searchParams] = useSearchParams()

    useEffect(() => {
        fetchCategories()
            .then(data => catalog.categories = data)
            .finally(() => setCategoriesFetching(false))

        fetchBrands()
            .then(data => catalog.brands = data)
            .finally(() => setBrandsFetching(false))

        const {category, brand, page} = getSearchParams(searchParams)
        catalog.category = category
        catalog.brand = brand
        catalog.page = page ?? 1

        fetchAllProducts(catalog.category, catalog.brand, catalog.page, catalog.limit)
            .then(data => {
                catalog.products = data.rows
                catalog.count = data.count
            })
            .finally(() => setProductsFetching(false))
        // eslint-disable-next-line
    }, [])
    
    useEffect(() => {
        const { category, brand, page, price } = getSearchParams(searchParams)

        if (category || brand || page || price) {
            if (category !== catalog.category) {
                catalog.category = category;
            }
            if (brand !== catalog.brand) {
                catalog.brand = brand;
            }
            if (page !== catalog.page) {
                catalog.page = page ?? 1;
            }
            if (price !== catalog.price) {
                catalog.price = price;
            }
        } else {
            catalog.category = null;
            catalog.brand = null;
            catalog.page = 1;
            catalog.price= null;
        }
        // eslint-disable-next-line
    }, [location.search]);

    useEffect(() => {
        let minPrice = null;
        let maxPrice = null;

        if (catalog.price) {
            const [min, max] = catalog.price.split('-');
            minPrice = min || null;
            maxPrice = max || null;
        }
        fetchAllProducts(catalog.category, catalog.brand, catalog.page, catalog.limit, minPrice, maxPrice)
            .then(data => {
                catalog.products = data.rows;
                catalog.count = data.count;
            })
            .finally(() => setProductsFetching(false));
        // eslint-disable-next-line
    }, [catalog.category, catalog.brand, catalog.page, catalog.price])

    const handleClick = (e) => {
        const filterProductItem = e.currentTarget;

        const filterProductItemBlock = filterProductItem.querySelector('.filter-product__item-block');

        filterProductItemBlock.classList.toggle('open');
    }

    const handleClickInside = (e) => {
        e.stopPropagation();
    }

    const clearSearch = () => {
        catalog.price = null;
        navigate('/');
    };

    return (
        <Container>
            <Row className="mt-2">
                <Col md={3} className="mb-3">
                    {categoriesFetching ? (
                        <Spinner animation="border" />
                    ) : (
                        <div className='filter-product__item' onClick={handleClick}>
                            <strong>Категорія</strong>
                            <div className='filter-product__item-block' onClick={handleClickInside}>
                                <div>
                                    <CategoryBar />
                                </div>
                            </div>
                        </div>
                    )}
                    {brandsFetching ? (
                        <Spinner animation="border" />
                    ) : (
                        <div className='filter-product__item' onClick={handleClick}>
                            <strong>Бренд</strong>
                            <div className='filter-product__item-block' onClick={handleClickInside}>
                                <div>
                                    <BrandBar />
                                </div>
                            </div>
                        </div>
                    )}
                    <div className='filter-product__item' onClick={handleClick}>
                        <strong>Фільтрування за ціною</strong>
                        <div className='filter-product__item-block' onClick={handleClickInside}>
                            <div>
                                <PriceBar />
                            </div>
                        </div>
                    </div>
                    <Button className="w-100" onClick={clearSearch}>Очистити всі фільтри</Button>
                </Col>
                <Col md={9}>
                    <div>
                        {productsFetching ? (
                            <Spinner animation="border" />
                        ) : (
                            <ProductList />
                        )}
                    </div>
                </Col>
            </Row>
        </Container>
    )
})

export default Shop
