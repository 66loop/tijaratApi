const Product = require('../../models/Product')
const validator = require("fastest-validator");
const bucketurl = require("../../config/BucketUrl");


const getAllProducts = async () => {
    let allPrducts = await Product.find({}).populate('serllerId category subCategory')
    let filterProducts = allPrducts.filter(product => product.sellerId.status !== 'freez')
    return filterProducts
}

const updateProductByadmin = async (productId, productData) => {
    return Product.findOneAndUpdate({ _id: productId }, { ...productData });
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

const searchProducts = async (queryData) => {
    let queryObject = { '$and': [] };
    console.log(req.query, 'req');
    const { name, sellerEmail, priceTo, priceFrom, active , inActive} = queryData;

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
        queryObject.$and.push({ '$or':[{ 'status': 'inActive'} , {'status': 'active' } ]});
    }
    else if (inActive) {
        queryObject.$and.push({ 'status': 'inActive'  });
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
        return allProducts;

    } else {
        throw new Error("Products Not Found");
    }
};

const getAllProductsbySeller = async (sellerId) => {
    const sellerProducts =  await Product.find({sellerId})
    if( !sellerProducts) {
        throw new Error ("Products not fount")
    }
    return sellerProducts

}


module.exports = {
    getAllProducts,
    updateProductByadmin,
    searchProducts,
    getAllProductsbySeller
}