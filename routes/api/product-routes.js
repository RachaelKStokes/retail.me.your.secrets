const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

// get all products
router.get('/', async (req, res) => {
  // find all products
  await Product.findAll({
    attributes: ["id", "product_name", "product_price", "stock", "category_id"],
    // be sure to include its associated Category and Tag data
    include: [{
      model: Tag,
      attributes: ["id", "tag_name"],
      through: "ProductTag",
    },
    {
      model: Category,
      attributes: ["id", "category_name"],
    },
    ],
  })
  .then((products) => {
    res.json(products);
  })
  .catch((err) => {
    res.json(err);
  });
});

// get one product
router.get('/:id', async (req, res) => {
  await Product.findByPk(req.params.id, {
    
    // be sure to include its associated Category and Tag data
    include: [{
      model: Category,
      attributes: ["id","category_name"],
    }, 
    { model: Tag,
      attributes: ["id", "tag_name"],
      through: "ProductTag",
    }],
  })
  .then((oneProduct) => {
    res.json(oneProduct);
  })
  .catch((err) => {
    res.json(err);
  });
});

// create new product
router.post('/', async (req, res) => {
  /* req.body should look like this...
    {
      product_name: "Basketball",
      price: 200.00,
      stock: 3,
      tagIds: [1, 2, 3, 4]
    }
  */
    // Product.create(req.body)
    // .then((product) => {
    //   if (req.body.tagIds.length) {
    //     const newProduct = req.body.tagIds.map((tag_id) => {
    //       return {
    //         product_id: product.id,
    //         tag_id,
    //       };
    //     });
    //     return ProductTag.bulkCreate(newProduct);
    //   }else{
    //     res.status(200).json(product);
    //   }
    // })
    // .then((productTagIds) => res.status(200).json(productTagIds))
    // .catch((err) => {
    //   res.status(400).json(err);
    // });
  try {
    const product = await Product.create(req.body);
    // if there's product tags, we need to create pairings by using the setTags method
    if (req.body.tagIds) {
      await product.setTags(req.body.tagIds);
      await product.save();
      return res.status(200).json(await product.getTags());
    }
    // if no product tags, just respond
    return res.status(200).json(product);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

// update product
router.put('/:id', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, { 
      include: [Tag],
    });
    // update product data
    product.update(req.body);
    // if there's product tags, we need to create pairings by using the setTags method
    if (req.body.tagIds) {
      await product.setTags(req.body.tagIds);
    }
    await product.save();
    await product.reload();
    return  res.status(200).json(product);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

router.delete('/:id', async (req, res) => {
  // delete one product by its `id` value
});

module.exports = router;
