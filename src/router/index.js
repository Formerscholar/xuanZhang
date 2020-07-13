import Vue from 'vue'
import VueRouter from 'vue-router'

const Home = () => import('../views/home/Home')
const Mission = () => import('../views/home/children/Mission/Mission')
const Newtask = () =>
  import('../views/home/children/Mission/children/Newtask/Newtask')

const Details = () => import('../views/home/children/Details/Details')

const Client = () => import('../views/client/Client')
const clientDetails = () =>
  import('../views/client/cihldren/clientDetails/clientDetails')
const clientedit = () =>
  import('../views/client/cihldren/clientedit/clientedit')
const enterpriseedit = () =>
  import('../views/client/cihldren/enterpriseedit/enterpriseedit')
const Deal = () => import('../views/deal/Deal')
const DealGoods = () => import('../views/deal/children/DealGoods/DealGoods')
const ContractDetails = () =>
  import('../views/deal/children/ContractDetails/ContractDetails')
const keepmoneypage = () =>
  import('../views/deal/children/keepmoneypage/keepmoneypage')

const listShop = () => import('../views/deal/children/listShop/listShop')
const contract = () => import('../views/deal/children/contract/contract')
const ShipmentItem = () =>
  import('../views/deal/children/contract/children/ShipmentItem/ShipmentItem')
const editShipItem = () =>
  import('../views/deal/children/contract/children/editShipItem/editShipItem')
const Receivable = () =>
  import('../views/deal/children/contract/children/Receivable/Receivable')
const turnover = () =>
  import('../views/deal/children/contract/children/turnover/turnover')
const StorageCompany = () =>
  import('../views/deal/children/aside/children/StorageCompany/StorageCompany')
const machining = () => import('../views/deal/children/machining/machining')
const purchase = () => import('../views/deal/children/purchase/purchase')
const aside = () => import('../views/deal/children/aside/asides')
const Outsourcing = () =>
  import('../views/deal/children/Outsourcing/Outsourcing')
const stock = () => import('../views/deal/children/stock/stock')
const selfConcordat = () =>
  import('../views/deal/children/selfConcordat/selfConcordat')
const ShippedList = () =>
  import('../views/deal/children/ShippedList/ShippedList')
const Settlementlist = () =>
  import('../views/deal/children/Settlementlist/Settlementlist')
const Invoicelist = () =>
  import('../views/deal/children/Invoicelist/Invoicelist')
const Operation = () => import('../views/operation/Operation')

const createContract = () =>
  import('../views/deal/children/createContract/createContract')
const editContract = () =>
  import('../views/deal/children/editContract/editContract')
const addNewCustomerslist = () =>
  import('../views/deal/children/createContract/children/addNewCustomerslist')
const addressEdit = () =>
  import('../views/deal/children/addressEdit/addressEdit')
const addressList = () =>
  import('../views/deal/children/addressList/addressList')
const addbill = () => import('../views/deal/children/addbill/addbill')
const addbillWl = () => import('../views/deal/children/addbillWl/addbillWl')
const Ship = () => import('../views/deal/children/Ship/Ship')
const warehouse = () => import('../views/deal/children/warehouse/warehouse')
const warehouseRet = () =>
  import('../views/deal/children/warehouseRet/warehouseRet')
const returnedPurchase = () =>
  import('../views/deal/children/returnedPurchase/returnedPurchase')
const OEMs = () => import('../views/deal/children/OEM/OEM')
const outsource = () => import('../views/deal/children/outsource/outsource')

const Profile = () => import('../views/profile/Profile')

const Login = () => import('../views/login/Login')

const businessLogin = () => import('../views/businessLogin/businessLogin')

const controlled = () => import('../views/controlled/Controlled')
const manboard = () => import('../views/manboard/manboard')
const staffEntry = () =>
  import('../views/manboard/children/staffEntry/staffEntry')

const fileInfo = () => import('../views/fileInfo/fileInfo')
const Email = () => import('../views/fileInfo/children/myArea/myArea')
const Password = () => import('../views/fileInfo/children/password/password')
const AvatarInfo = () => import('../views/fileInfo/children/Homepage/Homepage')
const scan = () => import('../components/common/my_scan/my_scan')

const Reimbursement = () => import('../views/Reimbursement/Reimbursement')

const early = () => import('../views/early/early')

const ReimburDetails = () =>
  import('../views/Reimbursement/children/ReimburDetails/ReimburDetails')

const newAccount = () =>
  import('../views/Reimbursement/children/newAccount/newAccount')
const addDetails = () =>
  import('../views/Reimbursement/children/addDetails/addDetails')

const selectTime = () => import('../components/content/selectTime/selectTime')

const ContractDelivery = () =>
  import('../views/home/children/ContractDelivery/ContractDelivery')
const IncomingDelivery = () =>
  import('../views/home/children/IncomingDelivery/IncomingDelivery')
const Shipment = () => import('../views/home/children/Shipment/Shipment')
const TotalShipment = () =>
  import('../views/home/children/TotalShipment/TotalShipment')
const IncomDelivery = () =>
  import('../views/home/children/IncomDelivery/IncomDelivery')
const Outsourc = () => import('../views/home/children/Outsourc/Outsourc')
const editwarehouse = () =>
  import('../views/deal/children/editwarehouse/editwarehouse')

const materialpage = () => import('../views/materials/materialpage')

const addMaterial = () => import('../views/materials/children/addMaterial')

const editMaterial = () => import('../views/materials/children/editMaterial')

const bompage = () => import('../views/materials/children/bompage')

const LargeScreen = () =>
  import('../views/home/children/LargeScreen/LargeScreen')

const ScreenItem = () =>
  import('../views/home/children/LargeScreen/children/ScreenItem.vue')

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/home',
  },
  {
    path: '/home',
    meta: {
      requireAuth: true,
    },
    component: Home,
  },
  {
    path: '/client',
    meta: {
      requireAuth: true,
    },
    component: Client,
  },
  {
    path: '/deal',
    component: Deal,
    children: [
      {
        path: '',
        meta: {
          requireAuth: true,
        },
        redirect: 'sales',
      },
      {
        path: 'sales',
        meta: {
          requireAuth: true,
        },
        component: DealGoods,
      },
      {
        path: 'contract',
        component: contract,
      },
      {
        path: 'machin',
        component: machining,
      },
      {
        path: 'purchase',
        component: purchase,
      },
      {
        path: 'aside',
        component: aside,
      },
      {
        path: 'outsourcing',
        component: Outsourcing,
      },
      {
        path: 'stock',
        component: stock,
      },
    ],
  },
  {
    path: '/operation',
    meta: {
      requireAuth: true,
    },
    component: Operation,
  },
  {
    path: '/profile',
    meta: {
      requireAuth: true,
    },
    component: Profile,
  },
  {
    path: '/login',
    component: Login,
  },
  {
    path: '/businessLogin',
    component: businessLogin,
  },
  {
    path: '/scan',
    component: scan,
  },
  {
    path: '/controlled',

    component: controlled,
  },
  {
    path: '/fileInfo',

    component: fileInfo,
  },
  {
    path: '/mission',
    component: Mission,
  },
  {
    path: '/newtask',
    component: Newtask,
  },
  {
    path: '/details',
    component: Details,
  },
  {
    path: '/clientdetails',
    name: 'data',
    component: clientDetails,
  },
  {
    path: '/clientedit/:name/:id',
    component: clientedit,
  },
  {
    path: '/enterpriseedit/:name/:id',
    component: enterpriseedit,
  },
  {
    path: '/reimbursement',
    component: Reimbursement,
  },
  {
    path: '/early',
    component: early,
  },
  {
    path: '/account',
    component: newAccount,
  },
  {
    path: '/add-details',
    component: addDetails,
  },
  {
    path: '/create-contract',
    component: createContract,
  },
  {
    path: '/edit-contract',
    name: 'data',
    component: editContract,
  },
  {
    path: '/reimburDetails/:id',
    component: ReimburDetails,
  },
  {
    path: '/selfConcordat/:id',
    component: selfConcordat,
  },
  {
    path: '/shippedlist/:id',
    component: ShippedList,
  },
  {
    path: '/settlementlist/:id',
    component: Settlementlist,
  },
  {
    path: '/invoicelist/:id',
    component: Invoicelist,
  },
  {
    path: '/turnover/:id',
    component: turnover,
  },
  {
    path: '/storageCom/:id',
    component: StorageCompany,
  },
  {
    path: '/addbill',
    component: addbill,
  },
  {
    path: '/addbillwl',
    component: addbillWl,
  },
  {
    path: '/Ship',
    component: Ship,
  },
  {
    path: '/warehouse',
    component: warehouse,
  },
  {
    path: '/warehouseRet',
    component: warehouseRet,
  },
  {
    path: '/returnedPurchase',
    component: returnedPurchase,
  },
  {
    path: '/oem',
    component: OEMs,
  },
  {
    path: '/outsource',
    component: outsource,
  },
  {
    path: '/addressEdit',
    component: addressEdit,
  },
  {
    path: '/addressList',
    name: 'addressList',
    component: addressList,
  },
  {
    path: '/selectTime/:type',
    component: selectTime,
  },
  {
    path: '/addNewCustomerslist',
    component: addNewCustomerslist,
  },
  {
    path: '/contractdetails/:id',
    component: ContractDetails,
  },
  {
    path: '/keepmoneypage',
    name: 'data',
    component: keepmoneypage,
  },
  {
    path: '/listShop',
    name: 'data',
    component: listShop,
  },
  {
    path: '/manboard',
    component: manboard,
  },
  {
    path: '/staffEntry',
    component: staffEntry,
  },
  {
    path: '/ShipmentItem',
    name: 'data',
    component: ShipmentItem,
  },
  {
    path: '/editShipItem',
    name: 'data',
    component: editShipItem,
  },
  {
    path: '/Receivable',
    name: 'data',
    component: Receivable,
  },
  {
    path: '/email',
    component: Email,
  },
  {
    path: '/password',
    component: Password,
  },
  {
    path: '/avatarInfo',
    component: AvatarInfo,
  },
  {
    path: '/ContractDelivery',
    component: ContractDelivery,
  },
  {
    path: '/IncomingDelivery',
    component: IncomingDelivery,
  },
  {
    path: '/Shipment',
    component: Shipment,
  },
  {
    path: '/TotalShipment/:type',
    component: TotalShipment,
  },
  {
    path: '/IncomDelivery/:type',
    name: 'data',
    component: IncomDelivery,
  },
  {
    path: '/Outsourc/:type',
    name: 'data',
    component: Outsourc,
  },
  {
    path: '/editwarehouse/:id',
    component: editwarehouse,
  },
  {
    path: '/materialpage',
    component: materialpage,
  },
  {
    path: '/addMaterial',
    component: addMaterial,
  },
  {
    path: '/editMaterial/:id/:type',
    component: editMaterial,
  },
  {
    path: '/bompage/:id',
    component: bompage,
  },
  {
    path: '/LargeScreen',
    component: LargeScreen,
  },
  {
    path: '/ScreenItem',
    name: 'data',
    component: ScreenItem,
  },
]

const router = new VueRouter({
  routes,
})

router.beforeEach((to, from, next) => {
  if (to.meta.requireAuth) {
    if (!window.localStorage) {
      alert('浏览器不支持localstorage')
    } else {
      var storage = window.localStorage
      let tokenStr = JSON.parse(storage.getItem('token'))
      if (!tokenStr) {
        return next('/login')
      } else {
        return next()
      }
    }
  } else {
    return next()
  }
})
export default router
