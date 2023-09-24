const fs = require("fs")

class ProductManager {
    constructor() {
        this.path = 'Products.json';
        this.autoId = 0;
        this.initFile()
    }

    async initFile() {
        if (fs.existsSync(this.path)) {
            const stats = fs.statSync(this.path);
            if (stats.size === 0) {
                fs.writeFileSync(this.path, '[]');
            }
        } else {
            fs.writeFileSync(this.path, '[]');
        }
    }

    async getProducts(){
        let data = await fs.promises.readFile(this.path)
        let products = JSON.parse(data)
        return products
    }

    async addProduct(title, description, price, thumbnail, code, stock) {
        if (!title || !description || !price || !thumbnail || !code || !stock) {
            throw new Error('Los campos son obligatorios');
        }

        let products = await this.getProducts();

        const productExist = products.find(product => product.code === code);
        if (productExist) {
            throw new Error('Ya existe un producto con ese código');
        }

        const newProduct = {
            title,
            description,
            price,
            thumbnail,
            code,
            stock
        }

        products.push(newProduct);

        await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2));

        return newProduct;
    }

    async getProductByid(code){
        let products = await this.getProducts()
        let idProduct = products.find(product => product.code === code);
        if (!idProduct) {
            console.log("Product not Found");
        } else{
            return idProduct

        }
    }

    async updateProduct(code, product){
        if (!product.title || !product.description || !product.price || !product.thumbnail 
            || !product.code || !product.stock) {
            throw new Error('Los campos son obligatorios');
        }
        let products = await this.getProducts()
        let indice = products.findIndex(product => product.code === code)
        if (indice !== -1) {
            products[indice].title = product.title
            products[indice].description = product.description
            products[indice].price = product.price
            products[indice].thumbnail = product.thumbnail
            products[indice].code = product.code
            products[indice].stock = product.stock
        }
        await fs.promises.writeFile(this.path, JSON.stringify(products))
        console.log("Producto Actualizado")
        return products[indice]
    }

    async deleteProduct(code){
        let products = await this.getProducts()
        let indice = products.findIndex(product => product.code === code)
        if (indice !== -1) {
            products.splice(indice, 1)
        }
        await fs.promises.writeFile(this.path, JSON.stringify(products))
        return console.log(`Producto Eliminado`);
    }
    
}

const manager = new ProductManager()

