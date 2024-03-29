const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

router.get('/', async (req, res) => {
  // find all categories
  await Category.findAll({
    attributes: ["id", "category_name"],
  // be sure to include its associated Products
    include: [{
      model: Product,
      attributes: ["id", "product_name", "product_price", "stock", "category_id"]
    }]
  })
  .then((Categories) => {
    res.json(Categories);
  })
});

router.get('/:id', async (req, res) => {
  // find one category by its `id` value
  await Category.findByPk(req.params.id, {
    attributes: ["id", "category_name"],
    // be sure to include its associated Products
    include: [{
      model: Product,
      attributes: ["id", "product_name", "product_price", "stock", "category_id"],
    }]
  })
  .then((Category) => {
    res.json(Category);
  })
  .catch((err) => {
    res.json(err);
  });
});

router.post('/', async (req, res) => {
  // create a new category
  await Category.create(req.body)
  .then((newCategory) => res.status(200).json(newCategory))
  .catch((err) => {
    res.status(400).json(err);
  });
});

router.put('/:id', async (req, res) => {
  // update a category by its `id` value
  await Category.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
  .then(Category => Category.findByPk(req.params.id))
  .then((updatedCategory) => res.status(200).json(updatedCategory))
  .catch((err) => {res.json(err)});
});

router.delete('/:id', async (req, res) => {
  // delete a category by its `id` value
  await Category.destroy({
    where: {
      id: req.params.id,
    },
  })
  .then((deleteCategory) => {
    res.json(deleteCategory);
  })
  .catch((err) => {
    res.json(err);
  });
});

module.exports = router;
