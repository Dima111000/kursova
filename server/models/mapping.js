import sequelize from '../sequelize.js'
import database from 'sequelize'

const { DataTypes } = database

const User = sequelize.define('user', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    email: {type: DataTypes.STRING, unique: true},
    password: {type: DataTypes.STRING},
    role: {type: DataTypes.STRING, defaultValue: 'USER'},
})

const Basket = sequelize.define('basket', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
})

const BasketProduct = sequelize.define('basket_product', {
    quantity: {type: DataTypes.INTEGER, defaultValue: 1},
})

const Product = sequelize.define('product', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, unique: true, allowNull: false},
    price: {type: DataTypes.INTEGER, allowNull: false},
    rating: {type: DataTypes.INTEGER, defaultValue: 0},
    image: {type: DataTypes.STRING, allowNull: false},
})

const Category = sequelize.define('category', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, unique: true, allowNull: false},
})

// модель «Бренд», таблица БД «brands»
const Brand = sequelize.define('brand', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, unique: true, allowNull: false},
})

const Rating = sequelize.define('rating', {
    rate: {type: DataTypes.INTEGER, allowNull: false},
})

const ProductProp = sequelize.define('product_prop', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, allowNull: false},
    value: {type: DataTypes.STRING, allowNull: false},
})

const Order = sequelize.define('order', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, allowNull: false},
    email: {type: DataTypes.STRING, allowNull: false},
    phone: {type: DataTypes.STRING, allowNull: false},
    address: {type: DataTypes.STRING, allowNull: false},
    amount: {type: DataTypes.INTEGER, allowNull: false},
    status: {type: DataTypes.INTEGER, allowNull: false, defaultValue: 0},
    comment: {type: DataTypes.STRING},
    prettyCreatedAt: {
        type: DataTypes.VIRTUAL,
        get() {
            const value = this.getDataValue('createdAt')
            const day = value.getDate()
            const month = value.getMonth() + 1
            const year = value.getFullYear()
            const hours = value.getHours()
            const minutes = value.getMinutes()
            return day + '.' + month + '.' + year + ' ' + hours + ':' + minutes
        }
    },
    prettyUpdatedAt: {
        type: DataTypes.VIRTUAL,
        get() {
            const value = this.getDataValue('updatedAt')
            const day = value.getDate()
            const month = value.getMonth() + 1
            const year = value.getFullYear()
            const hours = value.getHours()
            const minutes = value.getMinutes()
            return day + '.' + month + '.' + year + ' ' + hours + ':' + minutes
        }
    },
})

const OrderItem = sequelize.define('order_item', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, allowNull: false},
    price: {type: DataTypes.INTEGER, allowNull: false},
    quantity: {type: DataTypes.INTEGER, allowNull: false},
})


Basket.belongsToMany(Product, { through: BasketProduct, onDelete: 'CASCADE' })
Product.belongsToMany(Basket, { through: BasketProduct, onDelete: 'CASCADE' })

Basket.hasMany(BasketProduct)
BasketProduct.belongsTo(Basket)
Product.hasMany(BasketProduct)
BasketProduct.belongsTo(Product)

Category.hasMany(Product, {onDelete: 'RESTRICT'})
Product.belongsTo(Category)

Brand.hasMany(Product, {onDelete: 'RESTRICT'})
Product.belongsTo(Brand)

Product.belongsToMany(User, {through: Rating, onDelete: 'CASCADE'})
User.belongsToMany(Product, {through: Rating, onDelete: 'CASCADE'})

Product.hasMany(Rating)
Rating.belongsTo(Product)
User.hasMany(Rating)
Rating.belongsTo(User)

Product.hasMany(ProductProp, {as: 'props', onDelete: 'CASCADE'})
ProductProp.belongsTo(Product)

Order.hasMany(OrderItem, {as: 'items', onDelete: 'CASCADE'})
OrderItem.belongsTo(Order)

User.hasMany(Order, {as: 'orders', onDelete: 'SET NULL'})
Order.belongsTo(User)

export {
    User,
    Basket,
    Product,
    Category,
    Brand,
    Rating,
    BasketProduct,
    ProductProp,
    Order,
    OrderItem
}