module.exports = function Wishlist(oldWishlist) { // pass old cart items
  // fetch old data
  this.items = oldWishlist.items || {};

  // add item to wishlist
  this.add = (item, id) => {
    let storedItem = this.items[id];
    if (!storedItem) {
      storedItem = this.items[id] = { item: item, price: 0 };
    }
    storedItem.price = storedItem.item.price;
  };

  // remove item from wishlist
  this.removeItem = (id) => {
    delete this.items[id];
  };

  // display wishlist item like array
  this.generateArray = () => {
    let arr = [];
    for (let id in this.items) {
      arr.push(this.items[id]);
    }
    return arr;
  };
};
