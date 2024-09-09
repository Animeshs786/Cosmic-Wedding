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
const { protect, authorizedRole } = require("../middleware/protect");
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
const testVendro = require("../controllers/assign/testVendor");
const assignPackageToVendor = require("../controllers/userController/vendor/assignPackageToVendor");
const { createLocation } = require("../controllers/location/createLocation");
const { getAllLocation } = require("../controllers/location/getAllLocation");
const { getLocation } = require("../controllers/location/getLocation");
const { updateLocation } = require("../controllers/location/updateLocation");
const { deleteLocation } = require("../controllers/location/deleteLocation");
const {
  getAllRejectedLead,
} = require("../controllers/rejectedLead/getAllRejectedLead");
const {
  verifyRejectLead,
} = require("../controllers/rejectedLead/verifyRejectLead");
const {
  uploadCustomerFromCsv,
} = require("../controllers/customer/uploadCustomerFromCsv");
const { createVendor } = require("../controllers/userController/vendor/createVendor");
// const authorizedRole = require("../middleware/authorizedrole");

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
  authorizedRole("Super Admin", "Admin", "Vendor"),
  updatePassword
);
router.patch(
  "/updateProfile",
  protect,
  authorizedRole("Super Admin", "Admin", "Vendor"),
  fileUploader([{ name: "profileImage", maxCount: 1 }], "user"),
  updateProfile
);

//Admin
router
  .route("/admin")
  .post(
    protect,
    authorizedRole("Super Admin"),
    fileUploader([{ name: "profileImage", maxCount: 1 }], "user"),
    createAdmin
  )
  .get(protect, authorizedRole("Super Admin"), getAllAdmin);

router
  .route("/admin/:id")
  .get(protect, authorizedRole("Super Admin"), GetAdmin)
  .patch(
    fileUploader([{ name: "profileImage", maxCount: 1 }], "user"),
    updateAdmin
  )
  .delete(protect, authorizedRole("Super Admin"), deleteAdmin);

//Vendor
router
  .route("/vendor")
  .post(
    // protect,
    // authorizedRole("Super Admin", "Admin"),
    fileUploader([{ name: "profileImage", maxCount: 1 }], "user"),
    createVendor
  )
  .get(protect, authorizedRole("Super Admin", "Admin"), getAllVendors);

router
  .route("/vendor/:id")
  .get(protect, authorizedRole("Super Admin", "Admin"), getVendor)
  .patch(
    protect,
    authorizedRole("Super Admin", "Admin"),
    fileUploader([{ name: "profileImage", maxCount: 1 }], "user"),
    updateVendor
  )
  .delete(protect, authorizedRole("Super Admin", "Admin"), deleteVendor);

router.get(
  "/assignVendorCustomer",
  protect,
  authorizedRole("Vendor"),
  getCustomersAssignedToVendor
);

//Budget range
router
  .route("/budgetRange")
  .post(protect, authorizedRole("Super Admin", "Admin"), createBudgetRange)
  .get(getAllBudgetRanges);

router
  .route("/budgetRange/:id")
  .get(protect, authorizedRole("Super Admin", "Admin"), getBudgetRange)
  .patch(protect, authorizedRole("Super Admin", "Admin"), updateBudgetRange)
  .delete(protect, authorizedRole("Super Admin", "Admin"), deleteBudgetRange);

//Service Category
router
  .route("/service")
  .post(protect, authorizedRole("Super Admin", "Admin"), createServiceCategory)
  .get(
    protect,
    authorizedRole("Super Admin", "Admin"),
    getAllServiceCategories
  );

router
  .route("/service/:id")
  .get(protect, authorizedRole("Super Admin", "Admin"), getServiceCategory)
  .patch(protect, authorizedRole("Super Admin", "Admin"), updateServiceCategory)
  .delete(
    protect,
    authorizedRole("Super Admin", "Admin"),
    deleteServiceCategory
  );

//Package
router
  .route("/package")
  .post(protect, authorizedRole("Super Admin", "Admin"), createPackage)
  .get(protect, authorizedRole("Super Admin", "Admin"), getAllPackage);

router
  .route("/package/:id")
  .get(protect, authorizedRole("Super Admin", "Admin"), getPackage)
  .patch(protect, authorizedRole("Super Admin", "Admin"), updatePackage)
  .delete(protect, authorizedRole("Super Admin", "Admin"), deletePackage);

//Customer
router
  .route("/customer")
  .post(createCustomer)
  .get(protect, authorizedRole("Super Admin", "Admin"), getAllCustomers);

router
  .route("/customer/:id")
  .get(protect, authorizedRole("Super Admin", "Admin"), getCustomer)
  .patch(
    protect,
    authorizedRole("Super Admin", "Admin", "Vendor"),
    updateCustomer
  )
  .delete(protect, authorizedRole("Super Admin", "Admin"), deleteCustomer);

//Assign
router.post(
  "/assign",
  protect,
  authorizedRole("Admin", "Super Admin"),
  assignVendorToCustomer
);

router.delete(
  "/assign/:id",
  protect,
  authorizedRole("Admin", "Super Admin"),
  removeVendorToCustomer
);

//dashboard
router.get(
  "/vendorDashboard",
  protect,
  authorizedRole("Vendor"),
  getVendorDashboard
);

//dashboard
router.get(
  "/userDashboard",
  protect,
  authorizedRole("Admin", "Super Admin"),
  getUserDashboard
);

router.get("/testAssignVendor", testVendro);
router.post(
  "/assignPackage",
  protect,
  authorizedRole("Super Admin", "Admin"),
  assignPackageToVendor
);

//Location
router
  .route("/location")
  .post(protect, authorizedRole("Super Admin", "Admin"), createLocation)
  .get(getAllLocation);

router
  .route("/location/:id")
  .get(protect, authorizedRole("Super Admin", "Admin"), getLocation)
  .patch(protect, authorizedRole("Super Admin", "Admin"), updateLocation)
  .delete(protect, authorizedRole("Super Admin", "Admin"), deleteLocation);

//Reject Lead
router
  .route("/rejectLead")
  .get(
    protect,
    authorizedRole("Super Admin", "Admin", "Vendor"),
    getAllRejectedLead
  );

router
  .route("/rejectLead/:id")
  .patch(protect, authorizedRole("Super Admin", "Admin"), verifyRejectLead);

// upload customer
router
  .route("/uploadCustomer")
  .post(
    protect,
    authorizedRole("Super Admin", "Admin"),
    fileUploader([{ name: "csvFile", maxCount: 1 }], "csvFile"),
    uploadCustomerFromCsv
  );

module.exports = router;
