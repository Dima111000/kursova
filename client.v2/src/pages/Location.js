import React, { useEffect, useRef, useState } from 'react';
import { ReactComponent as UA } from '../image/ua.svg';
import { Modal, Button } from 'react-bootstrap';
import { useLocation } from 'react-router-dom'

const Location = () => {
    const location = useLocation()

    const [locationVisible, setLocationVisible] = useState(false)

    const mapRef = useRef(null);
    const [showModal, setShowModal] = useState(false);
    const [regions, setRegions] = useState([]);
    const [regionMarket, setRegionMarket] = useState([]);
    const [selectedRegion, setSelectedRegion] = useState(null);

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedRegion(null);
    };

    useEffect(() => {
        setLocationVisible(true)
    }, [location])

    useEffect(() => {
        if (locationVisible === true) {
            mapRef.current.classList.add('_visible')
        }
    }, [locationVisible]);

    useEffect(() => {
        const handleRegionClick = (mapRegionName, mapRegionShops) => {
            const [shopName, shopAddress] = mapRegionShops.split(' * ');

            if (!regions.includes(mapRegionName)) {
                setRegions(prevRegions => [...prevRegions, mapRegionName]);
            }

            const marketObj = { name: shopName, address: shopAddress };
            if (!regionMarket.some(region => region.name === marketObj.name)) {
                setRegionMarket(prevMarket => [...prevMarket, marketObj]);
            }

            setSelectedRegion({ name: mapRegionName, shopName: shopName, address: shopAddress });
            setShowModal(true);
        };

        const map = mapRef.current;
        if (!map) return; // Проверка на null

        const mapRegions = map.querySelectorAll('path');

        const addEventListeners = () => {
            mapRegions.forEach((mapRegion) => {
                const mapRegionName = decodeUnicode(mapRegion.getAttribute('name'));
                let mapRegionShops = '';

                if (mapRegion.getAttribute('data-shops') !== '') {
                    mapRegionShops = decodeUnicode(mapRegion.getAttribute('data-shops'));
                } else {
                    mapRegionShops = 'Нажаль, в даному у регіоні у нас немає магазинів';
                }

                mapRegion.addEventListener('click', () => {
                    handleRegionClick(mapRegionName, mapRegionShops);
                });
            });
        };

        const removeEventListeners = () => {
            mapRegions.forEach((mapRegion) => {
                mapRegion.removeEventListener('click', () => {});
            });
        };

        addEventListeners();

        return () => {
            removeEventListeners();
        };
    }, [regions, regionMarket]);

    const decodeUnicode = (str) => {
        return str.replace(/\\u[\dA-F]{4}/gi, (match) => {
            return String.fromCharCode(parseInt(match.replace(/\\u/g, ''), 16));
        });
    };

    return (
        <div>
            <h1>Як нас знайти?</h1>

            <div className='map'>
                <UA ref={mapRef} className='map__ukraine' />
                <Modal show={showModal} onHide={handleCloseModal}>
                    <Modal.Header closeButton>
                        {selectedRegion && <>{selectedRegion.name}</>}
                    </Modal.Header>
                    <Modal.Body>
                        {selectedRegion && (
                            <>
                                <p>Наші магазини у даному регіоні:</p>
                                <div className='map__region-market'>
                                    <a href={selectedRegion.address} target='_blank'>
                                        {selectedRegion.shopName}
                                    </a>
                                </div>
                            </>
                        )}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant='secondary' onClick={handleCloseModal}>
                            Закрити
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </div>
    );
};

export default Location;