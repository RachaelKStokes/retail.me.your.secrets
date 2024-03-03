const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

router.get('/', async (req, res) => {
  // find all tags
  // be sure to include its associated Product data
  await Tag.findAll({
    attributes: ["id", "category_id", "product_name", "product_price", "stock"],
    include: [{
      model: Product,
      attributes: ["id", "product_name", "product_price", "stock", "category_id"],
      through: "ProductTag",
    }]
  })
  .then((parsedTagData) => {
    res.json(parsedTagData);
  })
  .catch((err) => {
    res.json(err);
  });
});


router.get('/:id', async (req, res) => {
  // find a single tag by its `id`
  await Tag.findByPk(req.params.id, {
    // be sure to include its associated Products
    include: [{
      model: Product,
      attributes: ["id", "product_name", "product_price", "stock", "category_id"],
      through: "ProductTag",
    }]
  })
  .then((TagById) => {
    res.json(TagById);
  })
  .catch((err) => {
    res.json(err);
  });
});

router.post('/', async (req, res) => {
  // create a new tag
  await Tag.create(req.body)
  .then((newTag) => res.status(200).json(newTag))
  .catch((err) => {
    res.status(400).json(err);
  });
});

router.put('/:id', async (req, res) => {
  // update a tag's name by its `id` value
  await Tag.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
  .then(Tag => Tag.findByPk(req.params.id))
  .then((updatedTag) => res.status(200).json(updatedTag))
  .catch((err) => {res.json(err)});
});

router.delete('/:id', async (req, res) => {
  // delete on tag by its `id` value
    await Tag.destroy({
      where: {
        id: req.params.id,
      },
    })
    .then((deleteTag) => {
      res.json(deleteTag);
    })
    .catch((err) => {
      res.json(err);
    });
});

module.exports = router;
