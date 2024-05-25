const express = require("express");
const router = express();
const multer = require("multer");
const path = require("path");
const { validateToken } = require("../../middlewares/AuthorizationMW");
const asyncMiddleware = require("../../middlewares/async");
const adminController = require("../../controllers/Admin/AdminController");
let x = 1;
const uploadimage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, `./public/images`);
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname +
        "-" +
        Math.floor(Math.random() * 1000000000) +
        "-" +
        path.extname(file.originalname)
    );
  },
});
const upload = multer({
  storage: uploadimage,
});

router.post("/registration", asyncMiddleware(adminController.registration));
router.get("/get_products", asyncMiddleware(adminController.get_products));
// router.post("/addProduct",upload.single('image') ,asyncMiddleware(adminController.addProduct));
router.post(
  "/addProduct",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "images", maxCount: 10 },
  ]),
  asyncMiddleware(adminController.addProduct)
);

// Product Categories
router.get(
  "/product_categories",
  asyncMiddleware(adminController.product_categories)
);
router.get(
  "/updatePCStatus/:pcId",
  asyncMiddleware(adminController.updatePCStatus)
);
router.post(
  "/addProductCategories",
  asyncMiddleware(adminController.addProductCategories)
);
router.put(
  "/editProductCategories",
  asyncMiddleware(adminController.editProductCategories)
);
router.delete("/deletePC/:pcId", asyncMiddleware(adminController.deletePC));

// Shop Categories
router.get("/shopCategories", asyncMiddleware(adminController.shopCategories));
router.get(
  "/updateShopCategoriesStatus/:Id",
  asyncMiddleware(adminController.updateShopCategoriesStatus)
);
router.post(
  "/addShopCategories",
  asyncMiddleware(adminController.addShopCategories)
);
router.put(
  "/editShopCategories",
  asyncMiddleware(adminController.editShopCategories)
);
router.delete(
  "/deleteShopCategories/:Id",
  asyncMiddleware(adminController.deleteShopCategories)
);

// Tailor Categories
router.get(
  "/tailorCategories",
  asyncMiddleware(adminController.tailorCategories)
);
router.get(
  "/updateTailorCategoriesStatus/:Id",
  asyncMiddleware(adminController.updateTailorCategoriesStatus)
);
router.post(
  "/addTailorCategories",
  asyncMiddleware(adminController.addTailorCategories)
);
router.put(
  "/editTailorCategories",
  asyncMiddleware(adminController.editTailorCategories)
);
router.delete(
  "/deleteTailorCategories/:Id",
  asyncMiddleware(adminController.deleteTailorCategories)
);

router.get("/get_orders", asyncMiddleware(adminController.get_orders));
router.get("/get_tailors", asyncMiddleware(adminController.get_tailors));
router.get("/get_shops", asyncMiddleware(adminController.get_shops));
router.get("/get_users", asyncMiddleware(adminController.get_users));
router.get(
  "/updateStatus/:userId",
  asyncMiddleware(adminController.updateStatus)
);
router.get(
  "/updateProductStatus/:prodId",
  asyncMiddleware(adminController.updateProductStatus)
);
router.get(
  "/updateFeatured/:prodId",
  asyncMiddleware(adminController.updateFeatured)
);
router.get("/deleteUser/:userId", asyncMiddleware(adminController.deleteUser));

module.exports = router;
