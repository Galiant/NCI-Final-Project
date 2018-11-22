module.exports = function Cart(oldCart) { // pass old cart items
  // fetch old data
  this.items = oldCart.items || {};
  this.totalQty = oldCart.totalQty || 0;
  this.totalPrice = oldCart.totalPrice || 0;

  // add item to cart
  this.add = (item, id) => {
    let storedItem = this.items[id];
    if (!storedItem) {
      storedItem = this.items[id] = { item: item, qty: 0, price: 0 };
    }
    storedItem.qty++;
    storedItem.price = storedItem.item.price * storedItem.qty;
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
