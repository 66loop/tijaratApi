const Product = require('../../models/Product')
const validator = require("fastest-validator");
const bucketurl = require("../../config/BucketUrl");


const getAllProducts = async (req, res, next) => {
    try {
        let allPrducts = await Product.find({}).populate('serllerId category subCategory')
        if (!allPrducts) {
            res.status(401).json({ message: "Products not found" })
        }
        let filterProducts = allPrducts.filter(product => product.serllerId.status !== 'freez')
        return res.status(201).json({
            message: "Success",
            products: filterProducts
        })
    } catch (error) {
        return res.status(500).json({ message: error.message })

    }

}

const updateProductByadmin = async (req, res, next) => {
    try {
        await Product.updateOne({ _id: req.params.productId }, { ...req.body });
        
        res.status(201).json({
            message: "Product updated successfully",
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
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
        res.status(500).json({ message: error.message })
    }

};

const getAllProductsbySeller = async (req, res, next) => {
    try {
        const sellerProducts = await Product.find({ serllerId: req.params.sellerId }).populate('serllerId category subCategory')
        if (!sellerProducts) {
            return res.status(401).json({ message: "Products not fount" })
        }
        return res.status(201).json({
            message: "Success",
            products: sellerProducts
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }



}

const getAProduct =async (req, res, next) => {
    try {
        const product = await Product.findOne({ _id: req.params.productId }).populate('serllerId category subCategory')
        if (!product) {
            return res.status(401).json({ message: "Products not fount" })
        }
        return res.status(201).json({
            message: "Success",
            product
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }
}

module.exports = {
    getAllProducts,
    updateProductByadmin,
    searchProducts,
    getAllProductsbySeller,
    getAProduct
}