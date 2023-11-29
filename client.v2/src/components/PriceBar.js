import { Button } from 'react-bootstrap';
import { observer } from 'mobx-react-lite';
import { useRef, useContext, useEffect } from 'react'; // Добавляем useEffect
import { AppContext } from './AppContext.js';
import { useNavigate, useLocation, createSearchParams } from 'react-router-dom';

const PriceBar = observer(() => {
    const { catalog } = useContext(AppContext);
    const navigate = useNavigate();
    const location = useLocation(); // Получаем доступ к текущему URL

    const inputMin = useRef(null);
    const inputMax = useRef(null);

    const filterProductPrice = async (e) => {
        e.preventDefault();

        const minValue = parseFloat(inputMin.current.value);
        const maxValue = parseFloat(inputMax.current.value);

        if (isNaN(minValue) || isNaN(maxValue)) {
            alert('Будь ласка, введіть коректні значення ціни.');
            return;
        }

        catalog.price = `${minValue}-${maxValue}`;

        let params = {}
        if (catalog.category) params.category = catalog.category;
        if (catalog.brand) params.brand = catalog.brand;
        if (catalog.page > 1) params.page = catalog.page;
        if (catalog.price) params.price = catalog.price

        navigate({
            pathname: '/',
            search: '?' + createSearchParams(params),
        });
    };

    const clearPriceFilter = () => {
        catalog.price = null;

        let params = {}
        if (catalog.category) params.category = catalog.category;
        if (catalog.brand) params.brand = catalog.brand;
        if (catalog.page > 1) params.page = catalog.page;
        if (catalog.price) params.price = catalog.price

        navigate({
            pathname: '/',
            search: '?' + createSearchParams(params),
        });
    };

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const priceParam = searchParams.get('price');

        if (priceParam) {
            const [minValue, maxValue] = priceParam.split('-');
            inputMin.current.value = minValue;
            inputMax.current.value = maxValue;
        }
    }, [location.search]); // Обновляем значения при изменении search параметров

    return (
        <div className='price-bar'>
            <div>
                <input
                    type="number"
                    className='price-bar__input min'
                    placeholder='0'
                    min={0}
                    max={9999999}
                    ref={inputMin}
                />
                <span>-</span>
                <input
                    type="number"
                    className='price-bar__input max'
                    placeholder='9999999'
                    min={0}
                    max={9999999}
                    ref={inputMax}
                />
            </div>
            <Button onClick={filterProductPrice}>Фільтрувати</Button>
            <Button onClick={clearPriceFilter}>Очистити фільтр ціни</Button>
        </div>
    );
});

export default PriceBar;