const express = require("express");
const {
  register,
} = require("../controllers/userController/authController/register");
const fileUploader = require("../middleware/fileUploader");
const { login } = require("../controllers/userController/authController/login");
const {
  updatePassword,
} = require("../controllers/userController/authController/updatePassword");
const {
  updateProfile,
} = require("../controllers/userController/authController/updateProfile");
const { protect } = require("../middleware/protect");
const { authorizeRole } = require("../middleware/authorizerole");
const {
  createAdmin,
} = require("../controllers/userController/admin/createAdmin");
const {
  getAllAdmin,
} = require("../controllers/userController/admin/getAllAdmin");
const { GetAdmin } = require("../controllers/userController/admin/getAdmin");
const {
  updateAdmin,
} = require("../controllers/userController/admin/updateAdmin");
const {
  deleteAdmin,
} = require("../controllers/userController/admin/deleteAdmin");
const {
  createVenodr,
} = require("../controllers/userController/vendor/createVendor");
const {
  getAllVendors,
} = require("../controllers/userController/vendor/getAllVenodr");
const { getVendor } = require("../controllers/userController/vendor/getVendor");
const {
  updateVendor,
} = require("../controllers/userController/vendor/updateVendor");
const {
  deleteVendor,
} = require("../controllers/userController/vendor/deleteVendor");
const {
  createBudgetRange,
} = require("../controllers/budgetRange/createBudgetRange");
const {
  getAllBudgetRanges,
} = require("../controllers/budgetRange/getAllBudgetRange");
const { getBudgetRange } = require("../controllers/budgetRange/getBudgetRange");
const {
  updateBudgetRange,
} = require("../controllers/budgetRange/updateBudgetRange");
const {
  deleteBudgetRange,
} = require("../controllers/budgetRange/deleteBudgetRange");
const {
  createServiceCategory,
} = require("../controllers/service/createService");
const {
  getAllServiceCategories,
} = require("../controllers/service/getAllService");
const { getServiceCategory } = require("../controllers/service/getService");
const {
  updateServiceCategory,
} = require("../controllers/service/updateService");
const {
  deleteServiceCategory,
} = require("../controllers/service/deleteService");
const { createPackage } = require("../controllers/package/createPackage");
const { getAllPackage } = require("../controllers/package/getAllPackage");
const { getPackage } = require("../controllers/package/getPackage");
const { updatePackage } = require("../controllers/package/updatePackage");
const { deletePackage } = require("../controllers/package/deletePackage");
const { createCustomer } = require("../controllers/customer/createCustomer");
const { getAllCustomers } = require("../controllers/customer/getAllCustomer");
const { getCustomer } = require("../controllers/customer/getCustomer");
const { updateCustomer } = require("../controllers/customer/updateCustomer");
const { deleteCustomer } = require("../controllers/customer/deleteCustomer");
const {
  assignVendorToCustomer,
} = require("../controllers/assign/assignVendorToCustomer");
const {
  removeVendorToCustomer,
} = require("../controllers/assign/removeVendorToCustomer");
const {
  getCustomersAssignedToVendor,
} = require("../controllers/userController/vendor/getCustomerAssignToVendor");
const {
  getVendorDashboard,
} = require("../controllers/dashboard/vendor/getVendorDashboard");
const {
  getUserDashboard,
} = require("../controllers/dashboard/user/getUserDashboard");

const router = express.Router();

//Authentication
router.post(
  "/register",
  fileUploader([{ name: "profileImage", maxCount: 1 }], "user"),
  register
);
router.post("/login", login);

router.patch(
  "/updatePassword",
  protect,
  authorizeRole("Super Admin", "Admin", "Vendor"),
  updatePassword
);
router.patch(
  "/updateProfile",
  protect,
  authorizeRole("Super Admin", "Admin", "Vendor"),
  fileUploader([{ name: "profileImage", maxCount: 1 }], "user"),
  updateProfile
);

//Admin
router
  .route("/admin")
  .post(
    protect,
    authorizeRole("Super Admin"),
    fileUploader([{ name: "profileImage", maxCount: 1 }], "user"),
    createAdmin
  )
  .get(protect, authorizeRole("Super Admin"), getAllAdmin);

router
  .route("/admin/:id")
  .get(protect, authorizeRole("Super Admin"), GetAdmin)
  .patch(
    fileUploader([{ name: "profileImage", maxCount: 1 }], "user"),
    updateAdmin
  )
  .delete(protect, authorizeRole("Super Admin"), deleteAdmin);

//Vendor
router
  .route("/vendor")
  .post(
    protect,
    authorizeRole("Super Admin", "Admin"),
    fileUploader([{ name: "profileImage", maxCount: 1 }], "user"),
    createVenodr
  )
  .get(protect, authorizeRole("Super Admin", "Admin"), getAllVendors);

router
  .route("/vendor/:id")
  .get(protect, authorizeRole("Super Admin", "Admin"), getVendor)
  .patch(
    protect,
    authorizeRole("Super Admin", "Admin"),
    fileUploader([{ name: "profileImage", maxCount: 1 }], "user"),
    updateVendor
  )
  .delete(protect, authorizeRole("Super Admin", "Admin"), deleteVendor);

router.get(
  "/assignVendorCustomer",
  protect,
  authorizeRole("Vendor"),
  getCustomersAssignedToVendor
);

//Budget range
router
  .route("/budgetRange")
  .post(protect, authorizeRole("Super Admin", "Admin"), createBudgetRange)
  .get(protect, authorizeRole("Super Admin", "Admin"), getAllBudgetRanges);

router
  .route("/budgetRange/:id")
  .get(protect, authorizeRole("Super Admin", "Admin"), getBudgetRange)
  .patch(protect, authorizeRole("Super Admin", "Admin"), updateBudgetRange)
  .delete(protect, authorizeRole("Super Admin", "Admin"), deleteBudgetRange);

//Service Category
router
  .route("/service")
  .post(protect, authorizeRole("Super Admin", "Admin"), createServiceCategory)
  .get(protect, authorizeRole("Super Admin", "Admin"), getAllServiceCategories);

router
  .route("/service/:id")
  .get(protect, authorizeRole("Super Admin", "Admin"), getServiceCategory)
  .patch(protect, authorizeRole("Super Admin", "Admin"), updateServiceCategory)
  .delete(
    protect,
    authorizeRole("Super Admin", "Admin"),
    deleteServiceCategory
  );

//Package
router
  .route("/package")
  .post(protect, authorizeRole("Super Admin", "Admin"), createPackage)
  .get(protect, authorizeRole("Super Admin", "Admin"), getAllPackage);

router
  .route("/package/:id")
  .get(protect, authorizeRole("Super Admin", "Admin"), getPackage)
  .patch(protect, authorizeRole("Super Admin", "Admin"), updatePackage)
  .delete(protect, authorizeRole("Super Admin", "Admin"), deletePackage);

//Customer
router
  .route("/customer")
  .post(createCustomer)
  .get(protect, authorizeRole("Super Admin", "Admin"), getAllCustomers);

router
  .route("/customer/:id")
  .get(protect, authorizeRole("Super Admin", "Admin"), getCustomer)
  .patch(
    protect,
    authorizeRole("Super Admin", "Admin", "Vendor"),
    updateCustomer
  )
  .delete(protect, authorizeRole("Super Admin", "Admin"), deleteCustomer);

//Assign
router.post(
  "/assign",
  protect,
  authorizeRole("Admin", "Super Admin"),
  assignVendorToCustomer
);

router.delete(
  "/assign/:id",
  protect,
  authorizeRole("Admin", "Super Admin"),
  removeVendorToCustomer
);

//dashboard
router.get(
  "/vendorDashboard",
  protect,
  authorizeRole("Vendor"),
  getVendorDashboard
);

//dashboard
router.get(
  "/userDashboard",
  protect,
  authorizeRole("Admin", "Super Admin"),
  getUserDashboard
);

module.exports = router;
