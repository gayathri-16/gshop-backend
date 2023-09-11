const Product = require('../models/productModel');

exports.getNewArrivals = async (req, res) => {
	const sortBy = req.query.sortBy ? req.query.sortBy : 'desc';
	const limit = req.query.limit ? parseInt(req.query.limit) : parseInt(3);

	try {
		const newArrivals = await Product.find({})
			.sort({ createdAt: sortBy })
			.limit(limit);

		res.json({
			newArrivals,
		});
	} catch (err) {
		console.log(err, 'filter Controller.getNewArrivals error');
		res.status(500).json({
			errorMessage: 'Please try again later',
		});
	}
};

exports.searchByQueryType = async (req, res) => {
	const { type, query } = req.body;


	try {
		let filterproducts;

		switch (type) {
			case 'text':
				filterproducts = await Product.find({ $text: { $search: query } });
				break;
			case 'category':
				filterproducts = await Product.find({category:query})
					
				console.log(query);
		
				break;
		}

		// if (!filterproducts.length > 0) {
		// 	filterproducts = await Product.find({});
		// }

		res.status(200).json({
			 filterproducts 
			});
	} catch (err) {
		console.log(err, 'filter Controller.searchByQueryType error');
		res.status(500).json({
			errorMessage: 'Please try again later',
		});
	}
};