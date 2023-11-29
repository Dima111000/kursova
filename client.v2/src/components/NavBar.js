import { Container, Navbar, Nav, Form, Button } from 'react-bootstrap'
import { NavLink } from 'react-router-dom'
import { AppContext } from './AppContext.js'
import { useContext, useState, useEffect, useRef } from 'react'
import { observer } from 'mobx-react-lite'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShoppingCart, faShippingFast, faPhone, faSearch, faGlobe, faSun, faMoon, faUserShield } from '@fortawesome/free-solid-svg-icons'
import { faUser } from '@fortawesome/free-regular-svg-icons'
import { fetchAllProducts } from '../http/catalogAPI'

const NavBar = observer(() => {
    const { user, basket } = useContext(AppContext);

    const productsListOutput = useRef(null);
    const searchProductsForm = useRef(null);


    const switchThemeModeButton = useRef(null);
    const dayIcon = useRef(null);
    const nightIcon = useRef(null);

    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    const [isDarkMode, setIsDarkMode] = useState(() => {
        const savedTheme = localStorage.getItem('dark-mode');
        return savedTheme !== null ? JSON.parse(savedTheme) : true;
    });

    const handleInput = async (event) => {
        const inputValue = event.target.value.trim();
        setSearchTerm(inputValue);

        if (inputValue.length >= 3) {
            const products = await fetchAllProducts().then(data => data.rows);
            const filteredProducts = products.filter(product => product.name.toLowerCase().includes(inputValue));
            setSearchResults(filteredProducts);
            productsListOutput.current.classList.add('_open');
        } else {
            setSearchResults([]);
            productsListOutput.current.classList.remove('_open');
        }
    };

    const productLinkClickFunc = (e) => {
        if (productsListOutput.current.classList.contains('_open')) {
            productsListOutput.current.classList.remove('_open');
        }
    };

    const switchThemeModeClick = (e) => {
        const button = e.target;
    };

    useEffect(() => {
        const clickFunc = (e) => {
            const target = e.target;

            if (!productsListOutput.current.contains(target)) {
                productsListOutput.current.classList.remove('_open');
            } else {
                productsListOutput.current.classList.add('_open');
            }

            if (searchProductsForm.current.contains(target)) {
                productsListOutput.current.classList.add('_open');
            }

            if (switchThemeModeButton.current.contains(target)) {
                if (dayIcon.current.contains(target)) {
                    setIsDarkMode(false);

                    switchThemeModeButton.current.classList.remove('_night');

                    document.body.classList.add('day');
                    document.body.classList.remove('night');
                } else if (nightIcon.current.contains(target)) {
                    setIsDarkMode(true);

                    switchThemeModeButton.current.classList.add('_night');

                    document.body.classList.remove('day');
                    document.body.classList.add('night');
                }
            }
        }

        document.addEventListener('click', clickFunc);

        return () => {
            document.removeEventListener('click', clickFunc);
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('dark-mode', JSON.stringify(isDarkMode));

        const themeMode = JSON.parse(localStorage.getItem('dark-mode'));

        if (themeMode === true) {
            document.body.classList.remove('day');
            document.body.classList.add('night');
            switchThemeModeButton.current.classList.add('_night');
        } else {
            document.body.classList.add('day');
            document.body.classList.remove('night');
            switchThemeModeButton.current.classList.remove('_night');
        }

    }, [isDarkMode]);

    return (
        <Navbar bg="dark" variant="dark">
            <Container className="navbar-container _container">
            <NavLink to="/" className="navbar-brand _brand">Магазин</NavLink>
                <div className="navbar-form__wrapper">
                    <Form className="navbar-form" ref={searchProductsForm}>
                        <input
                            value={searchTerm}
                            onChange={handleInput}
                            onFocus={handleInput}
                            name="search-product"
                            placeholder="Введіть назву товару..."
                            className="navbar-input"
                            autoComplete='off'
                        />
                        <button className="navbar-form-button">
                            <FontAwesomeIcon icon={faSearch}></FontAwesomeIcon>
                        </button>
                    </Form>
                    <div className="navbar-form__search-product-output" ref={productsListOutput}>
                        <nav>
                            <ul>
                                {searchResults.map((product) => (
                                    <li key={product.id}>
                                        <NavLink to={`/product/${product.id}`} onClick={productLinkClickFunc} className="product__link">
                                            <img src={`	http://localhost:7000/${product.image}`} alt={product.name} />
                                            <div className="product__name">{product.name}</div>
                                        </NavLink>
                                        <div className="product__price">{product.price} грн.</div>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    </div>
                </div>
                <Nav className="ml-auto">
                    <Button ref={switchThemeModeButton} data-theme onClick={switchThemeModeClick} className='nav__dark-mode-selector-button nav__dark-mode-selector'>
                        <div ref={dayIcon} className='nav__dark-mode-selector-day nav__mode-selector'>
                            <FontAwesomeIcon icon={faSun}></FontAwesomeIcon>
                        </div>
                        <div ref={nightIcon} className='nav__dark-mode-selector-night nav__mode-selector'>
                            <FontAwesomeIcon icon={faMoon}></FontAwesomeIcon>
                        </div>
                    </Button>
                    <NavLink to="/delivery" className="nav-link">
                        <FontAwesomeIcon icon={faShippingFast}></FontAwesomeIcon>
                    </NavLink>
                    <NavLink to="/location" className="nav-link">
                        <FontAwesomeIcon icon={faGlobe}></FontAwesomeIcon>
                    </NavLink>
                    <NavLink to="/contacts" className="nav-link">
                        <FontAwesomeIcon icon={faPhone}></FontAwesomeIcon>
                    </NavLink>
                    {user.isAuth ? (
                        <NavLink to="/user" className="nav-link">
                            <FontAwesomeIcon icon={faUser}></FontAwesomeIcon>
                        </NavLink>
                    ) : (
                        <>
                            <NavLink to="/login" className="nav-link">Увійти</NavLink>
                            <NavLink to="/signup" className="nav-link">Реєстрація</NavLink>
                        </>
                    )}
                    {user.isAdmin && (
                        <NavLink to="/admin" className="nav-link">
                            <FontAwesomeIcon icon={faUserShield}></FontAwesomeIcon>
                        </NavLink>
                    )}
                    <NavLink to="/basket" className="nav-link shopping-cart">
                        <div>
                            <FontAwesomeIcon icon={faShoppingCart}></FontAwesomeIcon>
                            {!!basket.count && <span></span>}
                        </div>
                    </NavLink>
                </Nav>
            </Container>
        </Navbar>
    )
})

export default NavBar