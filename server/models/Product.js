import { Product as ProductMapping } from './mapping.js'
import { ProductProp as ProductPropMapping } from './mapping.js'
import { Brand as BrandMapping } from './mapping.js'
import { Category as CategoryMapping } from './mapping.js'
import FileService from '../services/File.js'
import AppError from '../errors/AppError.js'
import { Sequelize } from 'sequelize';

class Product {
    async getAll(options) {
        const { categoryId, brandId, limit, page, minPrice, maxPrice } = options;
        const offset = (page - 1) * limit;
        const where = {};
        
        if (categoryId) where.categoryId = categoryId;
        if (brandId) where.brandId = brandId;
        if (minPrice !== null && maxPrice !== null) {
            where.price = { [Sequelize.Op.between]: [minPrice, maxPrice] };
        }
        
        const products = await ProductMapping.findAndCountAll({
            where,
            limit,
            offset,
            include: [
                { model: BrandMapping, as: 'brand' },
                { model: CategoryMapping, as: 'category' }
            ],
            order: [['name', 'ASC']],
        });
        
        return products;
    }    

    async getOne(id) {
        const product = await ProductMapping.findByPk(id, {
            include: [
                {model: ProductPropMapping, as: 'props'},
                {model: BrandMapping, as: 'brand'},
                {model: CategoryMapping, as: 'category'},
            ]
        })
        if (!product) {
            throw new Error('Товар не найден в БД')
        }
        return product
    }

    async create(data, img) {
        const image = FileService.save(img) ?? ''
        const {name, price, categoryId = null, brandId = null} = data
        const product = await ProductMapping.create({name, price, image, categoryId, brandId})
        if (data.props) {
            const props = JSON.parse(data.props)
            for (let prop of props) {
                await ProductPropMapping.create({
                    name: prop.name,
                    value: prop.value,
                    productId: product.id
                })
            }
        }
        const created = await ProductMapping.findByPk(product.id, {
            include: [{model: ProductPropMapping, as: 'props'}]
        })
        return created
    }

    async update(id, data, img) {
        const product = await ProductMapping.findByPk(id, {
            include: [{model: ProductPropMapping, as: 'props'}]
        })
        if (!product) {
            throw new Error('Товар не найден в БД')
        }
        const file = FileService.save(img)
        if (file && product.image) {
            FileService.delete(product.image)
        }
        const {
            name = product.name,
            price = product.price,
            categoryId = product.categoryId,
            brandId = product.brandId,
            image = file ? file : product.image
        } = data
        await product.update({name, price, categoryId, image, brandId})
        if (data.props) { 
            await ProductPropMapping.destroy({where: {productId: id}})
            const props = JSON.parse(data.props)
            for (let prop of props) {
                await ProductPropMapping.create({
                    name: prop.name,
                    value: prop.value,
                    productId: product.id
                })
            }
        }
        await product.reload()
        return product
    }

    async delete(id) {
        const product = await ProductMapping.findByPk(id)
        if (!product) {
            throw new Error('Товар не найден в БД')
        }
        if (product.image) { // удаляем изображение товара
            FileService.delete(product.image)
        }
        await product.destroy()
        return product
    }

    async getProductsByPrice (options) {
        const { min, max, limit = 10, page = 1 } = options
        const offset = (page - 1) * limit

        if (min === undefined || max === undefined || min < 0 || max < 0 || min > max) {
            throw new AppError('Вказано недійсний діапазон цін.')
        }

        const products = await ProductMapping.findAndCountAll({
            where: {
                price: {
                    [Sequelize.Op.between]: [min, max]
                }
            },
            limit,
            offset,
            include: [
                { model: BrandMapping, as: 'brand' },
                { model: CategoryMapping, as: 'category' }
            ],
            order: [
                ['name', 'ASC'],
            ],
        })

        return products
    }

    async isExist(id) {
        const basket = await ProductMapping.findByPk(id)
        return basket
    }
}

export default new Product()