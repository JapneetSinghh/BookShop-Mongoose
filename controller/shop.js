const Product = require('../models/product');
// const Cart = require('../models/cart');

exports.getProducts = (req, res, next) => {
  Product.fetchAll().then(products => {
    console.log('--- FETCHING PRODUCTS FOR SHOP ---');
    res.render('shops/shop', {
      pageTitle: 'Our Products',
      path: '/',
      products: products,
      editMode: false
    });
  });
};

exports.getDetails = (req, res, next) => {
  const prodId = req.params.productId;
  console.log(prodId);
  Product.findById(prodId)
    .then(product => {
      res.render('shops/details',
        {
          pageTitle: 'Details',
          products: product,
          path: ''
        })
    });
}

exports.getCart = (req, res, next) => {
  req.user.getCart().then(products => {
    let totalPrice = 0;
    products.forEach(p => {
      console.log('hey');
      totalPrice = totalPrice + p.price * p.quantity;
    })
    res.render('yourCart', {
      pageTitle: 'Cart',
      path: '/cart',
      totalPrice: totalPrice,
      products: products
    });
  })
};

exports.getAddToCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId)
    .then(product => {
      console.log('ADD TO CART');
      console.log(product);
      req.user.addToCart(product)
        .then(result => {
          console.log(result);
          res.redirect('/cart');
        })
        .catch(err => {
          console.log(err);
        })
    })
}

exports.getRemoveFromCart = (req, res, next) => {
  const prodId = req.body.productId;
  req.user.delFromCart(prodId)
    .then(res.redirect('/cart'))
    .catch(err => {
      console.log(err);
    });

}
exports.addOrder = (req, res, next) => {
  req.user.addOrder().then(res.redirect('/orders'));
}
exports.getOrders = (req, res, next) => {
  req.user
    .getOrders()
    .then(orders => {
      res.render('shops/orders', {
        path: '/orders',
        pageTitle: 'Your Orders',
        orders: orders
      });
      console.log('orders');
      console.log(orders);
    })
    .catch(err => console.log(err));
}