const Product = require('../../models/Product')
const validator = require("fastest-validator");
const bucketurl = require("../../config/BucketUrl");


const getAllProducts = async (req, res, next) => {
    try {
        let allPrducts = await Product.find({}).populate('serllerId category subCategory')
        if (!allPrducts) {
            res.status(401).json({ message: "Products not found" })
        }
        let filterProducts = allPrducts.filter(product => product.sellerId.status !== 'freez')
        res.status(201).json({
            message: "Success",
            products: filterProducts
        })
    } catch (error) {
        res.status(500).json({ message: error })

    }

}

const updateProductByadmin = async (req, res, next) => {
    try {
        let product = await Product.findOneAndUpdate({ _id: req.params.productId }, { ...req.body });
        res.status(201).json({
            message: "Product updated successfully",
            product
        })
    } catch (error) {
        res.status(500).json({
            message: error
        })
    }
}

const createProductByAdminForUser = async (productData, files) => {
    const createdproduct = {
        name: productData.name,
        price: productData.price,
        salePrice: productData.salePrice,
        discount: productData.discount,
        shortDetails: productData.shortDetails,
        description: productData.description,
        stock: productData.stock,
        new: productData.new,
        sale: productData.sale,
        rating: productData.rating,
        tags: productData.tags,
        serllerId: productData.serllerId,
        condition: productData.condition,
        category: productData.category,
        subCategory: productData.subCategory,
        cities: productData.cities,
        applyMakeAnOffer: productData.applyMakeAnOffer || false,
    };
    let images = [];

    for (let index = 0; index < files.length; index++) {
        images.push(`${bucketurl}/images/${files[index].filename}`);
    }

    createdproduct.pictures = images;

    console.log('hittttttttt', files)
    const schema = {
        name: { type: "string", optional: false },
        price: { type: "string", optional: false },
        salePrice: { type: "string", optional: false },
        discount: "string",
        shortDetails: { type: "string", optional: false },
        description: { type: "string", optional: false },
        stock: { type: "string", optional: false },
        new: { type: "string", optional: false },
        sale: { type: "string", optional: false },
        category: { type: "string", optional: false },
        rating: { type: "string", optional: false },
        tags: { type: "string", optional: true },
        // pictures:{ type: "string", optional: false }
        serllerId: { type: "string", optional: false },
        condition: { type: "string", optional: true },
        category: { type: "string", optional: false },
        subCategory: { type: "string", optional: false },
    };

    const v = new validator();
    const validateResponse = v.validate(createdproduct, schema);

    if (validateResponse !== true) {
        return res.status(400).json({
            message: "Validation Failed",
            errors: validateResponse,
        });
    }

    let product = await Product.create(createdproduct)
    if (!product) {
        throw new Error('product Not Found')
    }
    return { message: "product created", product: result, }
}

const searchProducts = async (req, res, next) => {
    try {
        let queryObject = { '$and': [] };
        console.log(req.query, 'req');
        const { name, sellerEmail, priceTo, priceFrom, active, inActive } = req.query;

        if (txt) {
            queryObject.$and.push({ '$text': { '$search': name } });
        }
        if (priceFrom && priceTo) {
            queryObject.$and.push({ 'price': { $gte: priceFrom, $lte: priceTo } });
        }
        else if (priceFrom) {
            queryObject.$and.push({ 'price': { $gte: priceFrom } });
        }
        else if (priceTo) {
            queryObject.$and.push({ 'price': { $lte: priceTo } });
        }

        if (active && inActive) {
            queryObject.$and.push({ '$or': [{ 'status': 'inActive' }, { 'status': 'active' }] });
        }
        else if (inActive) {
            queryObject.$and.push({ 'status': 'inActive' });
        }
        else if (active) {
            queryObject.$and.push({ 'status': 'ative' });
        }

        console.log(queryObject, 'Query object');
        let products = await Product.find(queryObject).populate('serllerId category subCategory')

        if (products) {
            let allProducts = products
            if (sellerEmail) {
                allProducts = products.filter(product => product.serllerId.email === sellerEmail.toLowerCase())
            }
            res.status(201).json({
                message: "Success",
                products: allProducts
            });

        } else {
            res.status(401).json({ message: "Products Not Found" });
        }
    } catch (error) {
        res.status(500).json({ message: error })
    }

};

const getAllProductsbySeller = async (req, res, next) => {

    const sellerProducts = await Product.find({ sellerId: req.params.sellerId })
    if (!sellerProducts) {
        res.status(401).json({message: "Products not fount"})
    }
    res.status(201).json({
        message: "Success",
        products: sellerProducts
    })

}


module.exports = {
    getAllProducts,
    updateProductByadmin,
    searchProducts,
    getAllProductsbySeller
}