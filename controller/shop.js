const Product = require('../models/product');
const Order = require('../models/order');
// const Cart = require('../models/cart');

exports.getProducts = (req, res, next) => {
  Product.find()
    .then(products => {
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
      console.log(product);
      res.render('shops/details',
        {
          pageTitle: 'Details',
          products: product,
          path: ''
        })
    })
    .catch(err=>{
      console.log(err);
    })
    ;
}

exports.getCart = (req, res, next) => {
  req.user
    .populate('cart.items.productId')
    .then(user => {
      // console.log(user.cart.items)
      return user.cart.items;
    })
    .then(products => {
      let totalPrice = 0;
      products.forEach(p => {
        totalPrice = totalPrice + p.productId.price * p.quantity;
      })
      console.log(products);
      res.render('yourCart', {
        pageTitle: 'Cart',
        path: '/cart',
        totalPrice: totalPrice,
        products: products
      });
    })
    .catch(err => {
      console.log(err);
    })
};

exports.getAddToCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId)
    .then(product => {
      console.log('ADD TO CART');
      // console.log(product);
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
    .then(result=>{
      // console.log(result);
    })
    .then(res.redirect('/cart'))
    .catch(err => {
      console.log(err);
    });
}
// exports.addOrder = (req, res, next) => {
//   req.user.addOrder().then(res.redirect('/orders'));
// }
// exports.getOrders = (req, res, next) => {
//   req.user
//     .getOrders()
//     .then(orders => {
//       res.render('shops/orders', {
//         path: '/orders',
//         pageTitle: 'Your Orders',
//         orders: orders
//       });
//       console.log('orders');
//       console.log(orders);
//     })
//     .catch(err => console.log(err));
// }

exports.postOrder = (req, res, next) => {
  req.user
    .populate('cart.items.productId')
    .then(user => {
      const products = user.cart.items.map(i => {
        return { quantity: i.quantity, product: {...i.productId._doc} }
      });
      console.log(products);
      const order = new Order({
        user: {
          name: req.user.username,
          userId: req.user
        },
        products: products
      });
      return order.save();
    }) 
    .then(result=>{
      req.user.clearCart();
    })
    .then(result => {
      res.redirect('/orders');
    })
    .catch(err => console.log(err));
};

exports.getOrder = (req, res, next) => {
  Order.find({'user.userId':req.user._id})
    .then(orders => {
      res.render('shops/orders', {
        path: '/orders',
        pageTitle: 'Your Orders',
        orders: orders
      })
      console.log('orders');
      console.log(orders);
    })
    .catch(err => console.log(err));
};
