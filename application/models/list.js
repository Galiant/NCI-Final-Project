module.exports = function List(oldList) { // pass old reading list items
  // fetch old data
  this.items = oldList.items || {};

  // add item to reading list
  this.add = (item, id) => {
    let storedItem = this.items[id];
    if (!storedItem) {
      storedItem = this.items[id] = { item: item, price: 0 };
    }
    storedItem.price = storedItem.item.price;
  };

  // remove item from reading list
  this.removeItem = (id) => {
    delete this.items[id];
  };

  // display reading list item like array
  this.generateArray = () => {
    let arr = [];
    for (let id in this.items) {
      arr.push(this.items[id]);
    }
    return arr;
  };
};
