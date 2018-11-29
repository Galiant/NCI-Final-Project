module.exports = function Wishlist(oldWishlist) { // pass old cart items
  // fetch old data
  this.items = oldWishlist.items || {};
  this.totalQty = oldWishlist.totalQty || 0;
  this.totalPrice = oldWishlist.totalPrice || 0;

  // add item to wishlist
  this.add = (item, id) => {
    let storedItem = this.items[id];
    if (!storedItem) {
      storedItem = this.items[id] = { item: item, qty: 0, price: 0 };
    }
    storedItem.qty++;
    storedItem.price = storedItem.item.price;
    this.totalQty++;
    this.totalPrice += storedItem.item.price;
  };

  // increase by one
  this.increaseByOne = (id) => {
    this.items[id].qty++;
    this.items[id].price += this.items[id].item.price;
    // round items[id].price on two decimals
    this.items[id].price = Math.round(this.items[id].price * 1e2) / 1e2;
    this.totalQty++;
    this.totalPrice += this.items[id].item.price;
    // round totalPrice on two decimals
    this.totalPrice = Math.round(this.totalPrice * 1e2) / 1e2;
  };

  // reduce by one
  this.reduceByOne = (id) => {
    this.items[id].qty--;
    this.items[id].price -= this.items[id].item.price;
    // round items[id].price on two decimals
    this.items[id].price = Math.round(this.items[id].price * 1e2) / 1e2;
    this.totalQty--;
    this.totalPrice -= this.items[id].item.price;
    // round totalPrice on two decimals
    this.totalPrice = Math.round(this.totalPrice * 1e2) / 1e2;

    if (this.items[id].qty <= 0) {
      delete this.items[id];
    }
  };

  // remove item from cart
  this.removeItem = (id) => {
    this.totalQty -= this.items[id].qty;
    this.totalPrice -= this.items[id].price;
    // round totalPrice on two decimals
    this.totalPrice = Math.round(this.totalPrice * 1e2) / 1e2;
    delete this.items[id];
  };

  // display cart item like array
  this.generateArray = () => {
    let arr = [];
    for (let id in this.items) {
      arr.push(this.items[id]);
    }
    return arr;
  };
};
