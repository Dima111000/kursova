import { makeAutoObservable } from 'mobx'

class CatalogStore {
    _categories = []
    _brands = []
    _products = []
    _category = null
    _brand = null
    _price = null
    _page = 1
    _count = 0
    _limit = 3

    constructor() {
        makeAutoObservable(this)
    }

    get categories() {
        return this._categories
    }

    get brands() {
        return this._brands
    }

    get products() {
        return this._products
    }

    get category() {
        return this._category
    }

    get brand() {
        return this._brand
    }

    get price() {
        return this._price
    }

    get page() {
        return this._page
    }

    get count() {
        return this._count
    }

    get limit() {
        return this._limit
    }

    get pages() {
        return Math.ceil(this.count / this.limit)
    }

    set categories(categories) {
        this._categories = categories
    }

    set brands(brands) {
        this._brands = brands
    }

    set price(price) {
        this._price = price
    }

    set products(products) {
        this._products = products
    }

    set category(id) {
        this.page = 1
        this._category = id
    }

    set brand(id) {
        this.page = 1
        this._brand = id
    }

    set page(page) {
        this._page = page
    }

    set count(count) {
        this._count = count
    }

    set limit(limit) {
        this._limit = limit
    }
}

export default CatalogStore