class Product {
    constructor (ing_list, p_id, desc, loc, com, all_list) {
        this.ing_list = ing_list.split(",");
        this.p_id = p_id;
        this.desc = desc;
        this.loc = loc;
        this.com = com;
        this.all_list = all_list.split(",");
        this.ing = [];
    }
}

module.exports = Product;