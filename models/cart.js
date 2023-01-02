const fs = require("fs")
const path = require('path');
const p = path.join(path.dirname(require.main.filename),
  'data',
  'cart.json'
);

module.exports = class Cart {
  static addProduct(id, productPrice) {
    // let product=[{productId:id,productQty:2},totalPrice=12]
    fs.readFile(p, (err, fileContent) => {
      let cart = { products: [], totalPrice: 0 }
      if (!err) {
        cart = JSON.parse(fileContent);
      }
      const existingProductIndex = cart.products.findIndex(prod => prod.productId === id);
      console.log('Product Index: '+existingProductIndex);
      if (existingProductIndex > -1 || !existingProductIndex) {
        cart.products[existingProductIndex].productQty++;
      }
      else {
        cart.products.push({ productId: id, productQty: 1 });
      }
      cart.totalPrice = cart.totalPrice + + productPrice;
      console.log('Cart ', cart);

      fs.writeFile(p, JSON.stringify(cart), (err) => {
        if (err)
          console.log('Error'+err);
      })
    });


  }

  static getCart(callback) {
    fs.readFile(p, (err, fileContent) => {
      if (err) {
        console.log('Error'+err);
        callback({"products":[],"totalPrice":0});
      } else {
        callback(JSON.parse(fileContent));
      }
    });
  }
  static getDeleteProductFromCart(id,productPrice) {
    fs.readFile(p, (err, fileContent) => {
      if (err) {
        return;
      } else {
        const updatedCart = { ...JSON.parse(fileContent) };
        console.log('Updated Cart', updatedCart);
        const product = updatedCart.products.find(prod => prod.productId === id);
        console.log('Product: ',product);
        if(!product || product===undefined){
          return;
        }
        const productQty = product.productQty;
        updatedCart.products=updatedCart.products.filter(prod=>prod.productId !==id);
        updatedCart.totalPrice=updatedCart.totalPrice - productQty*productPrice;
        fs.writeFile(p, JSON.stringify(updatedCart), err => {
          if(err){
            console.log('Error: '+err);
          }
        });
      }
    }
  );
}

}