const Product = require('../models/product');
const { validationResult } = require('express-validator');
// const mongodb = require('mongodb');
const User = require('../models/user');
exports.getAddProudct = (req, res, next) => {
  Product.find()
    .then(products => {
      res.render('admin/add-product', {
        pageTitle: 'Add Product',
        path: '/add-product',
        products: products,
        editMode: false,
        hasError: false,
        message: null,
        validation: 'error'
      });
    });
}

exports.postAddProducts = (req, res, next) => {
  const prodName = req.body.productName;
  const prodPrice = req.body.productPrice;
  const prodDescription = req.body.productDescription;
  const prodImage = req.body.productLink;
  const productBy = req.session.user.username;
  const prodId = null;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render('admin/add-product', {
      pageTitle: 'Add Product',
      path: '/add-product',
      editMode: false,
      hasError: true,
      products: {
        name: prodName,
        price: prodPrice,
        description: prodDescription,
        imageUrl: prodImage
      },
      message: errors.array()[0].msg,
      validation: 'error'

    });
  }

  const product = new Product({
    name: prodName,
    price: prodPrice,
    description: prodDescription,
    imageUrl: prodImage,
    userId: req.user._id,
    productBy: productBy
  });
  product.save().then(result => {
    res.render('admin/add-product', {
      pageTitle: 'Add Product',
      path: '/add-product',
      editMode: false,
      hasError: true,
      products: {
        name: '',
        price: '',
        description: '',
        imageUrl: ''
      },
      message: `${prodName} Added Successfully`,
      validation: 'success'
    });
  }); // MONGOOSE FUNCTION
  console.log("Someone added new product");
}
exports.getAdmin = (req, res, next) => {
  Product.find({ userId: req.user._id })
    .then(products => {
      console.log('--- ADMIN ---');
      // console.log(products);
      res.render('admin/admin', {
        pageTitle: 'Admin',
        path: '/admin',
        products: products,
        editMode: true
      });
    });
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.editMode;
  if (!editMode) {
    res.redirect('/');
  } else {
    console.log('Edit mode on');
    const prodId = req.params.productId;
    Product.findById(prodId).then(product => {
      console.log(product);
      res.render('admin/add-product', {
        pageTitle: 'Edit Product',
        path: '',
        products: product,
        editMode: true,
        hasError: false,
        message: null,
        validation: 'error'
      })
    })
  }
}

exports.postEditProduct = (req, res, next) => {

  const prodName = req.body.productName;
  const prodPrice = req.body.productPrice;
  const prodId = req.body.productId;
  const prodDescription = req.body.productDescription;
  const prodImage = req.body.productLink;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render('admin/add-product', {
      pageTitle: 'Edit Product',
      path: '/add-product',
      editMode: true,
      hasError: true,
      products: {
        name: prodName,
        price: prodPrice,
        description: prodDescription,
        imageUrl: prodImage
      },
      message: errors.array()[0].msg,
      validation: 'error'
    });
  }
  Product.findById(prodId)
    .then(product => {
      if (product.userId.toString() !== req.user._id.toString()) {
        req.flash('error', 'Unauthorized Access');
        return (res.redirect('/login'));
      }
      console.log(product);
      product.name = prodName;
      product.price = prodPrice;
      product.imageUrl = prodImage;
      product.description = prodDescription;
      product.save();
    })
    .then(result => {
      return res.render('admin/add-product', {
        pageTitle: 'Edit Product',
        path: '/add-product',
        editMode: true,
        hasError: true,
        products: {
          name: '',
          price: '',
          description: '',
          imageUrl: ''
        },
        message: 'Product Updated Successfully',
        validation: 'success'
      });
    })
    .catch(err => {
      console.log(err);
    })
}
exports.deleteProduct = (req, res, next) => {
  const prodId = req.params.productId;
  console.log('DELETING PRODUCT USING PRODUCT ID: ' + prodId);
  Product.deleteOne({ _id: prodId, userId: req.user.id })
    .then(result => {
      // Deleting from current users cart
      req.user.delFromCart(prodId)
        .then(result => {
          console.log(result);
        })
        .catch(err => {
        })
    })
    .catch(err => {
      console.log(err);
    });

  User.find()
    .then(users => {
      users.forEach(user => {
        user.delFromCart(prodId)
          .then(result => {
          })
          .catch(err => {
            console.log(err);
          })
      })
    })
    .then(result => {
      res.redirect('/admin')
    })
    .catch(err => {
      console.log(err);
    })
}