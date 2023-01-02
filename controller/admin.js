const Product = require('../models/product');
const mongodb = require('mongodb');
exports.getAddProudct = (req, res, next) => {
  Product.fetchAll().then(products => {
    res.render('admin/add-product', {
      pageTitle: 'Add Product',
      path: '/add-product',
      products: products,
      editMode: false
    });
  });
}

exports.postAddProducts = (req, res, next) => {
  const prodName = req.body.productName;
  const prodPrice = req.body.productPrice;
  const prodDescription = req.body.productDescription;
  const prodImage = req.body.productLink;
  const prodId = null;
  const product = new Product(prodName, prodPrice, prodImage, prodDescription,null,req.user._id);
  product.save();
  res.redirect('/add-product');
  console.log("Someone added new product");
}
exports.getAdmin = (req, res, next) => {
  Product.fetchAll()
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
        editMode: true
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
  const product = new Product(prodName, prodPrice, prodImage, prodDescription,new mongodb.ObjectId(prodId),req.user._id);
  product.save();
  res.redirect('/');
}
exports.deleteProduct = (req, res, next) => {
  const prodId = req.params.productId;
  console.log('DELETING PRODUCT USING PRODUCT ID: '+prodId);
  Product.delById(prodId);
  res.redirect('/admin');
}