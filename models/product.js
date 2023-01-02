const getDb = require('../util/database').getDb;
const mongodb = require('mongodb');

class Product {
  constructor(name, price, imageUrl, description, id,userId) {
    this.name = name;
    this.price = price;
    this.imageUrl = imageUrl;
    this.description = description;
    // this._id = id ? new mongodb.ObjectId(id) : null;
    this._id = id;
    console.log('PRINTING THE ID');
    console.log(this._id);
    this.userId =userId;
  }
  save() {
    const db = getDb();
    let dbOp;
    if (this._id) {
      // UPDATING THE PRODUCT
      dbOp = db.collection('products').updateOne({ _id: new mongodb.ObjectId(this._id) }, { $set: this });
    } else {
      // INSERTING THE PRODUCT
      dbOp = db.collection('products').insertOne(this);
    }
    return dbOp
      .then(result => {
        console.log(result);
      })
      .catch(err => {
        console.log(err);
      });
  }
  static fetchAll() {
    const db = getDb();
    // FETCHING ALL ITEMS FROM MONGODB
    return db.collection('products')
      .find()
      .toArray()
      .then(result => {
        // console.log('PRINTING THE FETCHED BOOKS FROM FUNCTION fetchAll()');
        // console.log(result);
        return result;
      })
      .catch(err => {
        console.log(err);
      });
  }
  static findById(prodId) {
    const db = getDb();
    // FETCHING ONE ITEM FROM MONGODB
    return db.collection('products')
      .find({ _id: mongodb.ObjectId(prodId) })
      .next()
      .then(product => {
        // console.log('FINDING PRODUCT BY ID: ' + prodId);
        // console.log(product);
        return product;
      })
      .catch(err => {
        console.log(err);
      })
  }
  static delById(prodId){
    const db =getDb();
    db.collection('products')
    .deleteOne({_id: new mongodb.ObjectId(prodId)})
    .then(result=>{
      console.log('DELETE A PRODUCT');
      console.log(result);
    })
    .catch(err=>{
      console.log(err);
    })
  }
}

module.exports = Product;