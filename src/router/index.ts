import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import Loading from "../views/Loading.vue";
import Register from "../views/Register.vue";
import DataInformation from "../views/MainViews/DataInformation.vue";
import Map from "../views/MainViews/Map.vue";
import DeviceManage from  "../views/MainViews/DigitalMirror/DeviceManage.vue";
import DeviceInformation from  "../views/MainViews/DigitalMirror/DeviceInformation.vue";
import AddCompony from "../views/MainViews/DigitalMirror/AddCompony.vue"
import AddDevice from "../views/MainViews/DigitalMirror/AddDevice.vue"
import AddProduction from  "../views/MainViews/DigitalMirror/AddProduction.vue";
import FixProduction from "../views/MainViews/DigitalMirror/FixProduction.vue";
import ProductionManage from  "../views/MainViews/DigitalMirror/ProductionManage.vue";
import DataFlout from  "../views/MainViews/DeviceFlout/DataFlout.vue";
import ForeData from  "../views/MainViews/TimeData/ForeData.vue";
import DataCheck from  "../views/MainViews/TimeData/DataCheck.vue";
import DashBoard from  "../views/MainViews/Monitor/DashBoard.vue";
import DataMonitor from  "../views/MainViews/Monitor/DataMonitor.vue";
// eslint-disable-next-line no-irregular-whitespace
import DeviceList from "../views/MainViews/Monitor/DeviceList.vue";
// eslint-disable-next-line no-irregular-whitespace
import DataBoard from "../views/MainViews/Monitor/DataBoard.vue";
import Cookie from "js-cookie"


//pan
import ViewDetails from  "../views/MainViews/ViewDetails.vue";
import ViewDetails2 from  "../views/MainViews/ViewDetails2.vue";
import PersonnalDetails from "../views/MainViews/PersonnalDetails.vue";
import Settings from "../views/MainViews/Settings.vue";
import DeviceMap from "../views/MainViews/DeviceMap.vue";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    name:  "Loading",
    component: Loading,
  },
  {
    path: "/register",
    name:  "Register",
    component: Register,
  },
  {
    path: "/mainPage",
    name: "MainPage",
	children:[
		{
			path: "dataInformation",
			name: "DataInformation",
			component : DataInformation
		},
		{
		   path: "dataInformation/viewDetails",
		   name: "ViewDetails",
		   component : ViewDetails
		  },
		  {
		   path: "dataInformation/viewDetails2",
		   name: "ViewDetails2",
		   component : ViewDetails2
		  },
		  {
		     path: "personnalDetails",
		     name: "PersonnalDetails",
		     component: PersonnalDetails
		    },
		    {
		     path: "settings",
		     name: "Settings",
		     component: Settings
		    },
		{
			path: "map",
			name: "Map",
			component : Map
		},
		{
		   path: "devicemap",
		   name: "DeviceMap",
		   component : DeviceMap
		  },
		{
			path: "productionManage",
			name: "ProductionManage",
			component : ProductionManage
		},
		{
			path: "productionManage/addProduction",
			name: "AddProduction",
			component : AddProduction,
			props : true,
		},
		{
			path: "productionManage/fixProduction",
			name: "FixProduction",
			component : FixProduction,
			props : true,
		},
		{
			path: "deviceManage",
			name: "DeviceManage",
			props: true,
			component : DeviceManage,
		},
		{
			path: "deviceManage/deviceInformation",
			name: "DeviceInformation",
			component : DeviceInformation,
			props : true,
		},
		{
			path: "deviceManage/addCompony",
			name: "AddCompony",
			component : AddCompony,
			props : true
		},
		{
			path: "deviceManage/addDevice",
			name: "AddDevice",
			component : AddDevice,
			props : true,
		},
		{
			path: "foreData",
			name: "ForeData",
			component : ForeData
		},
		{
			path: "dataFlout",
			name: "DataFlout",
			component : DataFlout
		},
		{
			path: "dataCheck",
			name: "DataCheck",
			component : DataCheck
		},
		{
			path: "dashBoard",
			name: "DashBoard",
			component : DashBoard
		},

		{
			// eslint-disable-next-line no-irregular-whitespace
		    path: "dashBoard/deviceList",
			// eslint-disable-next-line no-irregular-whitespace
		    name: "DeviceList",
		// eslint-disable-next-line no-irregular-whitespace
		            component : DeviceList
		// eslint-disable-next-line no-irregular-whitespace
		        },
		// eslint-disable-next-line no-irregular-whitespace
		    {
			// eslint-disable-next-line no-irregular-whitespace
		            path: "dashBoard/deviceList/dataBoard",
		// eslint-disable-next-line no-irregular-whitespace
		            name: "DataBoard",
		// eslint-disable-next-line no-irregular-whitespace
		            component : DataBoard
		// eslint-disable-next-line no-irregular-whitespace
		        },
		{
			path: "dataMonitor",
			name: "DataMonitor",
			component : DataMonitor
		}
	],
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/MainPage.vue"),
  },
];

const router = new VueRouter({
  mode: "hash",
  base: process.env.BASE_URL,
  routes,
  
});
router.beforeEach((to, from, next) => {
  if (to.path === '/'||to.path === '/register') {
    next();
  } else {
    const token = Cookie.get('token');
	// console.log(token);
    if (token === 'null' || token === '' || token===undefined) {
      next('/');
    } else {
      next();
    }
  }
});
export default router;
