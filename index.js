const express = require('express')
const app = express()
const bcrypt = require('bcrypt')
const session = require('express-session')
const flash = require('connect-flash')
const mongodbsession = require('connect-mongodb-session')(session)
const PORT = 5000
const Customer = require('./model/customer')
const Admin = require('./model/admin')
const Product = require('./model/sendproducts')
const Arrival = require('./model/sendarrivals')

const connectMongoose = require('./utils/mongoose')
connectMongoose()

const mongodbStore = new mongodbsession({
    uri: `mongodb+srv://${process.env.myUsername}:${process.env.myPassword}@cluster0.fansx3c.mongodb.net/Project`,
    collection: 'usersession'
})

let cart = []
let orders = []

app.set('view engine', 'ejs')
app.use(express.json())
app.use(express.static('./'))
app.use(express.urlencoded({extended: true}))
app.use(session({
    secret: 'keyboard cat',
    saveUninitialized: true,
    resave: false,
    store: mongodbStore
}))

app.use(flash())

const userAuthentication = (req, res, next) => {
    if (req.session.userAuthentication) {
        next()
    } else {
        res.redirect('/customerlogin')
    }
}

const adminAuthentication = (req, res, next) => {
    if (req.session.adminAuthentication) {
        next()
    } else {
        res.redirect('/customerlogin')
    }
}

app.get('/', async (req, res) => {
    const foundProduct = await Product.find({})
    const foundArrival = await Arrival.find({})
    res.render('pages/index', {foundProduct, foundArrival})
})

app.get('/shop/:id', async (req, res) => {
    const {id} = req.params
    const productDetails = await Product.findOne({_id:id}).exec()
    const arrivalDetails = await Arrival.findOne({_id:id}).exec()

    res.render('pages/shop', {productData: productDetails, arrivalData: arrivalDetails, alert: req.flash('info')})
})

app.get('/customerlogin', async (req, res) => {
    if (req.session.userAuthentication) {
        res.redirect('/profile')

    } else if (req.session.adminAuthentication) {
        res.redirect('/dashboard')

    } else {
        res.render('pages/customerlogin', {alert: req.flash('info')})
    }
})

app.get('/profile', userAuthentication, async (req, res) => {
    const foundCustomer = await Customer.findOne({})
    res.render('pages/profile', {foundCustomer})
})

app.get('/cart', (req, res) => {
    res.render('pages/cart', {cart})
})

app.get('/checkout', (req, res) => {
    const cartTotal = cart.map(obj => parseInt(obj.productTotal)).reduce((acc, currentValue) => acc + currentValue, 0)
    const shippingValue = 2000
    const orderTotal = parseInt(cartTotal) + parseInt(shippingValue)
    res.render('pages/checkout', {cart, cartTotal, shippingValue, orderTotal})
})

app.get('/ordercomplete', (req, res) => {
    res.render('pages/ordercomplete')
})

app.get('/logout', (req, res) => {
    req.session.destroy()
    res.redirect('/')
})

app.get('/createaccount', (req, res) => {
    res.render('pages/createaccount', {alert: req.flash('info')})
})

app.get('/createadmin', (req, res) => {
    res.render('pages/createadmin', {alert: req.flash('info')})
})

app.get('/dashboard', adminAuthentication, async (req, res) => {
    const foundAdmin = await Admin.findOne({})
    res.render('pages/dashboard', {foundAdmin})
})

app.get('/sendproducts', (req, res) => {
    res.render('pages/sendproducts', {alert: req.flash('info')})
})

app.get('/sendarrivals', (req, res) => {
    res.render('pages/sendarrivals', {alert: req.flash('info')})
})

app.get('/placedorders', (req, res) => {
    const cartTotal = cart.map(obj => parseInt(obj.productTotal)).reduce((acc, currentValue) => acc + currentValue, 0)
    const shippingValue = 2000
    const orderTotal = parseInt(cartTotal) + parseInt(shippingValue)
    res.render('pages/placedorders', {orders, orderTotal})
})

let foundCustomer

app.post('/login', async (req, res) => {
    const{email, password} = req.body
    foundCustomer = await Customer.findOne({email: email})
    
    if (foundCustomer) {
        const checkPassword = await bcrypt.compare(password, foundCustomer.password)
        
        if (checkPassword) {
            req.session.userAuthentication = true;
            res.redirect('/')
        } else {
            req.flash('info', 'Username or Password is incorrect')
            res.redirect('/customerlogin')
        }
    } else {
        const foundAdmin = await Admin.findOne({username: email})
        
        if (foundAdmin) {
            const checkPassword = await bcrypt.compare(password, foundAdmin.password)
            
            if (checkPassword) {
                req.session.adminAuthentication = true;
                res.redirect('/dashboard')
            } else {
                req.flash('info', 'Username or Password is incorrect')
                res.redirect('/customerlogin')
            }
        } else {
            req.flash('info', 'Username or Password is incorrect')
            res.redirect('/customerlogin')
        }
    }
})

app.post('/register', async (req, res) => {
    const {firstname, lastname, email, password} = req.body
    const foundCustomer = await Customer.findOne({email:email})

    if (foundCustomer) {
        req.flash('info', 'Email already exists')
        res.redirect('/createaccount')
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    const details = new Customer ({
        firstname: firstname,
        lastname: lastname,
        email: email,
        password: hashedPassword
    })

    await details.save()
    req.flash('info', 'Your account has been created!')
    res.redirect('/createaccount')
})

app.post('/createadmin', async (req, res) => {
    const{fullname, username, password} = req.body
    const foundAdmin = await Admin.findOne({username:username})

    if (foundAdmin) {
        req.flash('info', 'This username already exists')
        res.redirect('/createadmin')
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    const details = new Admin ({
        fullname: fullname,
        username: username,
        password: hashedPassword
    })

    await details.save()
    req.flash('info', 'Your account has been created!')
    res.redirect('/createadmin')
})

app.post('/sendproducts', async (req, res) => {
    const {title, image, rating, review, price, description} = req.body
    const foundProduct = await Product.findOne({title:title})

    if (foundProduct) {
        req.flash('info', 'This product already exists')
        res.redirect('/sendproducts')
    }

    const details = new Product ({
        title: title,
        image: image,
        rating: rating,
        review: review,
        price: price,
        description: description
    })

    await details.save()
    req.flash('info', 'This product was sent!')
    res.redirect('/sendproducts')
})

app.post('/sendarrivals', async (req, res) => {
    const {title, image, rating, review, price, description} = req.body
    const foundArrival = await Arrival.findOne({title:title})

    if (foundArrival) {
        req.flash('info', 'This product already exists')
        res.redirect('/sendarrivals')
    }

    const details = new Arrival ({
        title: title,
        image: image,
        rating: rating,
        review: review,
        price: price,
        description: description
    })

    await details.save()
    req.flash('info', 'This product was sent!')
    res.redirect('/sendarrivals')
})

app.post('/addtocart', (req, res) => {
    const {productId, productImage, productName, productPrice, productQuantity, productTotal} = req.body

    const existingItemIndex = cart.findIndex(item => item.productId === productId)

    if (existingItemIndex !== -1) {
        cart[existingItemIndex].productQuantity = parseInt(cart[existingItemIndex].productQuantity) + 1;
        cart[existingItemIndex].productTotal = productPrice * parseInt(cart[existingItemIndex].productQuantity)

    } else {
        const item = {
            productId, 
            productImage, 
            productName, 
            productPrice, 
            productQuantity, 
            productTotal: productPrice
        }
        cart.push(item)
    }

    req.flash('info', `You added ${productName} to your <a href="/cart">shopping cart</a>`)
    res.redirect('/shop/' + productId)
})

app.get('/removeitem', (req, res) => {
    const removeProduct = req.query.productId
    const newCart = cart.filter(element => element.productId !== removeProduct)

    cart = newCart
    res.redirect('/cart')
})

app.post('/sendorder', (req, res) => {
    const {checkEmail, checkFirstname, checkAddress, checkCity, checkState, checkPhone} = req.body
    const orderItem = {checkEmail, checkFirstname, checkAddress, checkCity, checkState, checkPhone}

    const cartTotal = cart.map(obj => parseInt(obj.productTotal)).reduce((acc, currentValue) => acc + currentValue, 0)
    const shippingValue = 2000
    const orderTotal = parseInt(cartTotal) + parseInt(shippingValue)

    let orderForEach = []
    orderForEach.push(orderItem, ...cart, orderTotal)

    orders.push(orderForEach)
    res.redirect('/ordercomplete')
})

app.post('/clearorder', (req, res) => {
    const index = req.body.index

    if (index >= 0 && index < orders.length) {
        orders.splice(index, 1)
    }
    res.redirect('/placedorders')
})

app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
})