const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const userSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  cart: {
    items: [
      {
        productId: { type: Schema.Types.ObjectId, required: true, ref: 'Product' },
        quantity: { type: Number, required: true }
      }
    ]
  },
  resetTokenExpiration: Date,
  resetToken: String
})
userSchema.methods.addToCart = function (product) {
  const cartProductIndex = this.cart.items.findIndex(cp => {
    return cp.productId.toString() === product._id.toString();
  });

  let updatedCartItem = [...this.cart.items];
  let newQuantity = 1;
  if (cartProductIndex >= 0) {
    newQuantity = this.cart.items[cartProductIndex].quantity + 1;
    updatedCartItem[cartProductIndex].quantity = newQuantity;
  } else {
    updatedCartItem.push({
      productId: product._id,
      quantity: newQuantity
    })
  }
  const updatedCart = {
    items: updatedCartItem
  }
  this.cart = updatedCart;
  return this.save();

}
// userSchema.methods.delFromCart=function(prodId){
//     const updatedCartItems = this.cart.items.filter(item => {
//       return item.productId.toString() !== prodId.toString()
//     });
//     console.log('DELETE CART ITEM');
//     console.log(updatedCartItems);
//     this.cart.items=updatedCartItems;
//     return this.save();
// }
userSchema.methods.delFromCart = function (prodId) {
  const updatedCartItems = this.cart.items.filter(item => {
    console.log(item.productId, prodId)
    return item.productId.toString() !== prodId.toString();
  });
  console.log(updatedCartItems);
  this.cart.items = updatedCartItems;
  return this.save();
}
userSchema.methods.clearCart = function () {
  this.cart = { items: [] }
  return this.save();
}

module.exports = mongoose.model('User', userSchema);
// const getDb = require('../util/database').getDb;
// const mongodb = require('mongodb');
// class User {
//   constructor(username, email, cart, id) {
//     this.username = username;
//     this.email = email;
//     this.cart = cart;
//     this._id = id;
//   }

//   save() {
//     const db = getDb();
//     return db.collection('users')
//       .insertOne(this);
//   }

//   static findById(id) {
//     const db = getDb();
//     return db.collection('users').findOne({ _id: new mongodb.ObjectId(id) })
//       .then((user) => {
//         console.log('USER FOUND')
//         console.log(user);
//         return user;
//       }).catch((err) => {
//         console.log(err);
//       });
//   }
//   addToCart(product) {
//     // --- FOR ADDING FIRST PRODUCT ---
//     // let cartInput = { items: [{ ...product, quantity: 1 }] };
//     // const db = getDb();
//     // return db.collection('users')
//     //   .updateOne({
//     //     _id: new mongodb.ObjectId(this._id)
//     //   },
//     //     { $set: { cart: cartInput } }
//     //   );
//     const cartProductIndex = this.cart.items.findIndex(cp => {
//       return cp.productId.toString() === product._id.toString();
//     });

//     let updatedCartItem = [...this.cart.items];
//     let newQuantity = 1;
//     if (cartProductIndex >= 0) {
//       newQuantity = this.cart.items[cartProductIndex].quantity + 1;
//       updatedCartItem[cartProductIndex].quantity = newQuantity;
//     } else {
//       updatedCartItem.push({
//         productId: new mongodb.ObjectId(product._id),
//         quantity: newQuantity
//       })
//     }

//     const updatedCart = {
//       items: updatedCartItem
//     }
//     const db = getDb();

//     return db.collection('users')
//       .updateOne({ _id: new mongodb.ObjectId(this._id) }, { $set: { cart: updatedCart } });

//   }
//   getCart() {
//     const db = getDb();
//     // GETTING ALL THE PRODUCT IDS OF PRODUCTS IN CART
//     const productIds = this.cart.items.map(product => {
//       return product.productId;
//     })
//     // GETTING ALL THE PRODUCTS FROM PRODUCTS COLLECTION USING THE IDS STORED IN productids constant
//     return db.collection('products')
//       .find({ _id: { $in: productIds } })
//       .toArray()
//       .then(products => {
//         return (products.map(p => {
//           return {
//             ...p, quantity: this.cart.items.find(i => {
//               return i.productId.toString() === p._id.toString();
//             }).quantity
//           }
//         }))
//       })

//   }
//   delFromCart(prodId) {
//     const updatedCartItems = this.cart.items.filter(item => {
//       return item.productId.toString() !== prodId.toString()
//     });
//     console.log('DELETE CART ITEM');
//     console.log(updatedCartItems);
//     const db = getDb();
//     return db.collection('users')
//       .updateOne({ _id: new mongodb.ObjectId(this._id) }, {
//         $set: {
//           cart: {
//             items: updatedCartItems
//           }
//         }
//       })
//   }
//   addOrder() {
//     const db = getDb();
//     return this.getCart()
//       .then(products => {
//         const order = {
//           items: products,
//           user: {
//             _id: new mongodb.ObjectId(this._id),
//             name: this.username
//           }
//         }
//         return db.collection('orders').insertOne(order);
//       })
//       .then(result => {
//         this.cart = { items: [] };
//         return db.collection('users').updateOne(
//           { _id: new mongodb.ObjectId(this._id) },
//           { $set: { cart: { items: [] } } }
//         )
//       })
//   }
//   getOrders(){
//     const db = getDb();
//    return db
//    .collection('orders')
//    .find({'user._id':new mongodb.ObjectId(this._id)})
//    .toArray();
//   }
// }
// module.exports = User;