import Dashboard from "./views/Dashboard.js";
import { Managelottery } from "./views/managelottery/Managelottery.js";
import Createlottery from "./views/managelottery/Createlottery.js";
import Lotterysetting from "./views/managelottery/Lotterysetting.js";
import Allusers from "./views/Allusers.js";
import DeleteUser from "./views/DeleteUser.js";
// import AccountInfo from "./views/AccountInfo.js";
import Profitandloss from "./views/Profitandloss.js";
import ActiveBets from "./views/ActiveBets";
import Accountstatement from "./views/Accountstatement.js";
// import ChipsTransaction from "./views/ChipsTransaction.js";
// import Chiphistory from "./views/Chiphistory.js";
import Chipsummary from "./views/Chipsummary.js";
import Bethistory from "./views/Bethistory.js";
import BetLive from "./views/BetLive.js";
import Lottery from "./views/lottery/Lottery.js";
import Casino from "./views/casino/Casino.js";
import Gametype from "./views/lottery/Gametype.js";
import Game from "./views/lottery/Game.js";
import Master from "./views/master/Master.js";
import Users from "./views/users/Users.js";
import {Betting} from "./views/betting/Betting.js";
import Edituser from "./views/users/Edituser.js";
import Changepassword from "./views/users/Changepassword.js";
import Userdashboard from "./views/Userdashboard.js";
import Chart from "./views/Chart.js";
import LotteryResult from "./views/LotteryResult.js";
import Account from "./views/Account.js";
import AccountDetails from "./views/AccountDetails.js";
import Bettype from "./views/managelottery/components/Bettype.js";
import Betlistbytype from "./views/managelottery/components/Betlistbytype.js";
import {i18n} from "./components/i18n/hindi.js";
// Auth 
import Login from "./views/auth/Login.js";
var routes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: "nc-icon nc-bank",
    component: Dashboard,
    layout: "/dashboard",
  },
  {
    path: "/manage-lottery",
    name: "Live Lottery",
    icon: "nc-icon nc-bank",
    component: Managelottery,
    layout: "/dashboard",
  },
  {
    path: "/create-lottery",
    name: "Create Lottery",
    icon: "nc-icon nc-bank",
    component: Createlottery,
    layout: "/dashboard",
  },
  {
    path: "/allusers",
    name: "All Users",
    icon: "nc-icon nc-bank",
    component: Allusers,
    layout: "/dashboard",
  },
  {
    path: "/deleted-user",
    name: "Deleted user",
    icon: "nc-icon nc-bank",
    component: DeleteUser,
    layout: "/dashboard",
  },
  // {
  //   path: "/account-statement",
  //   name: "Account Statement",
  //   icon: "nc-icon nc-pin-3",
  //   component: Accountstatement,
  //   layout: "/dashboard",
  // },
  {
    path: "/account-statement",
    name: "Account Statement",
    icon: "nc-icon nc-pin-3",
    component: Account,
    layout: "/dashboard",
  },
  {
    path: "/chip-summary",
    name: "Chip Summary",
    icon: "nc-icon nc-bell-55",
    component: Chipsummary,
    layout: "/dashboard",
  },
  {
    path: "/profitandloss",
    name: "Profit & Loss",
    icon: "nc-icon nc-tile-56",
    component: Profitandloss,
    layout: "/dashboard",
  },
  {
    path: "/live-bets",
    name: "live Bets",
    icon: "nc-icon nc-caps-small",
    component: BetLive,
    layout: "/dashboard",
  },
  {
    path: "/bethistory",
    name: "Bet History",
    icon: "nc-icon nc-caps-small",
    component: Bethistory,
    layout: "/dashboard",
  },
  {
    path: "/chart",
    name: "Chart",
    icon: "nc-icon nc-caps-small",
    component: Chart,
    layout: "/dashboard",
  },
  {
    path: "/edit-user",
    name: "Edit Profile",
    icon: "nc-icon nc-caps-small",
    component: Edituser,
    layout: "/dashboard",
  }
];
var supermasterroute = [
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: "nc-icon nc-bank",
    component: Dashboard,
    layout: "/dashboard",
  },
  {
    path: "/allusers",
    name: "All Users",
    icon: "nc-icon nc-bank",
    component: Master,
    layout: "/dashboard",
  },
  {
    path: "/deleted-user",
    name: "Deleted user",
    icon: "nc-icon nc-bank",
    component: DeleteUser,
    layout: "/dashboard",
  },
  {
    path: "/manage-lottery",
    name: "Live Lottery",
    icon: "nc-icon nc-bank",
    component: Managelottery,
    layout: "/dashboard",
  },
  // {
  //   path: "/account-statement",
  //   name: "Account Statement",
  //   icon: "nc-icon nc-pin-3",
  //   component: Accountstatement,
  //   layout: "/dashboard",
  // },
  {
    path: "/account-statement",
    name: "Account Statement",
    icon: "nc-icon nc-pin-3",
    component: Account,
    layout: "/dashboard",
  },
  {
    path: "/chip-summary",
    name: "Chip Summary",
    icon: "nc-icon nc-bell-55",
    component: Chipsummary,
    layout: "/dashboard",
  },
  {
    path: "/profitandloss/",
    name: "Profit & Loss",
    icon: "nc-icon nc-tile-56",
    component: Profitandloss,
    layout: "/dashboard",
  },{
    path: "/live-bets",
    name: "live Bets",
    icon: "nc-icon nc-caps-small",
    component: BetLive,
    layout: "/dashboard",
  },
  {
    path: "/bethistory",
    name: "Bet History",
    icon: "nc-icon nc-caps-small",
    component: Bethistory,
    layout: "/dashboard",
  },
  {
    path: "/chart",
    name: "Chart",
    icon: "nc-icon nc-caps-small",
    component: Chart,
    layout: "/dashboard",
  },
  {
    path: "/edit-user",
    name: "Edit Profile",
    icon: "nc-icon nc-caps-small",
    component: Edituser,
    layout: "/dashboard",
  }

]
var master = [
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: "nc-icon nc-bank",
    component: Dashboard,
    layout: "/dashboard",
  },
  {
    path: "/allusers",
    name: "All Users",
    icon: "nc-icon nc-bank",
    component: Allusers,
    layout: "/dashboard",
  },
  {
    path: "/deleted-user",
    name: "Deleted user",
    icon: "nc-icon nc-bank",
    component: DeleteUser,
    layout: "/dashboard",
  },
  {
    path: "/manage-lottery",
    name: "Today Lottery",
    icon: "nc-icon nc-bank",
    component: Managelottery,
    layout: "/dashboard",
  },
  // {
  //   path: "/account-statement",
  //   name: "Account Statement",
  //   icon: "nc-icon nc-pin-3",
  //   component: Accountstatement,
  //   layout: "/dashboard",
  // },
  {
    path: "/account-statement",
    name: "Account Statement",
    icon: "nc-icon nc-pin-3",
    component: Account,
    layout: "/dashboard",
  },
  {
    path: "/chip-summary",
    name: "Chip Summary",
    icon: "nc-icon nc-bell-55",
    component: Chipsummary,
    layout: "/dashboard",
  },
  {
    path: "/profitandloss",
    name: "Profit & Loss",
    icon: "nc-icon nc-tile-56",
    component: Profitandloss,
    layout: "/dashboard",
  },
  {
    path: "/live-bets",
    name: "live Bets",
    icon: "nc-icon nc-caps-small",
    component: BetLive,
    layout: "/dashboard",
  },
  {
    path: "/bethistory",
    name: "Bet History",
    icon: "nc-icon nc-caps-small",
    component: Bethistory,
    layout: "/dashboard",
  },
  {
    path: "/chart",
    name: "Chart",
    icon: "nc-icon nc-caps-small",
    component: Chart,
    layout: "/dashboard",
  },
  {
    path: "/edit-user",
    name: "Edit Profile",
    icon: "nc-icon nc-caps-small",
    component: Edituser,
    layout: "/dashboard",
  }
]
var userHindi = [
  {
    path: "/user-dashboard",
    // name: "Dashboard",
    name: i18n.DASHBOARD.DASHBOARD.hindi,
    icon: "nc-icon nc-diamond",
    component: Userdashboard,
    layout: "/dashboard",
  },
  {
    path: "/lottery",
    name: i18n.LOTTERY.LOTTERY.hindi,
    icon: "nc-icon nc-diamond",
    component: Lottery,
    layout: "/dashboard",
  },
  {
    path: "/casino",
    name: i18n.CASINO.CASINO.hindi,
    icon: "nc-icon nc-diamond",
    component: Casino,
    layout: "/dashboard",
  },
  {
    path: "/profitandloss",
    name: i18n.PROFIT_LOSS.PROFIT_LOSS.hindi,
    icon: "nc-icon nc-tile-56",
    component: Profitandloss,
    layout: "/dashboard",
  },
  {
    path: "/live-bets",
    name: i18n.LIVE_BETS.LIVE_BETS.hindi,
    icon: "nc-icon nc-caps-small",
    component: BetLive,
    layout: "/dashboard",
  },
  {
    path: "/bethistory",
    name: i18n.BETS_HISTORY.BETS_HISTORY.hindi,
    icon: "nc-icon nc-caps-small",
    component: Bethistory,
    layout: "/dashboard",
  },
  {
    path: "/active-bets",
    name: i18n.ACTIVE_BETS.ACTIVE_BETS.hindi,
    icon: "nc-icon nc-tile-56",
    component: ActiveBets,
    layout: "/dashboard",
  }, {
    path: "/chart",
    name: i18n.CHART.CHART.hindi,
    icon: "nc-icon nc-caps-small",
    component: Chart,
    layout: "/dashboard",
  }, 
  // {
  //   path: "/account-statement",
  //   name: "Account Statement",
  //   icon: "nc-icon nc-pin-3",
  //   component: Accountstatement,
  //   layout: "/dashboard",
  // },
  {
    path: "/account-statement",
    name: i18n.ACCOUNT_STATEMENT.ACCOUNT_STATEMENT.hindi,
    icon: "nc-icon nc-pin-3",
    component: Account,
    layout: "/dashboard",
  },
  {
    path: "/edit-user",
    name: i18n.EDIT_PROFILE.EDIT_PROFILE.hindi,
    icon: "nc-icon nc-caps-small",
    component: Edituser,
    layout: "/dashboard",
  }
]
var userEnglish = [
  {
    path: "/user-dashboard",
    // name: "Dashboard",
    name: i18n.DASHBOARD.DASHBOARD.english,
    icon: "nc-icon nc-diamond",
    component: Userdashboard,
    layout: "/dashboard",
  },
  {
    path: "/lottery",
    name: i18n.LOTTERY.LOTTERY.english,
    icon: "nc-icon nc-diamond",
    component: Lottery,
    layout: "/dashboard",
  },
  {
    path: "/casino",
    name: i18n.CASINO.CASINO.english,
    icon: "nc-icon nc-diamond",
    component: Casino,
    layout: "/dashboard",
  },
  {
    path: "/profitandloss",
    name: i18n.PROFIT_LOSS.PROFIT_LOSS.english,
    icon: "nc-icon nc-tile-56",
    component: Profitandloss,
    layout: "/dashboard",
  },
  {
    path: "/live-bets",
    name: i18n.LIVE_BETS.LIVE_BETS.english,
    icon: "nc-icon nc-caps-small",
    component: BetLive,
    layout: "/dashboard",
  },
  {
    path: "/bethistory",
    name: i18n.BETS_HISTORY.BETS_HISTORY.english,
    icon: "nc-icon nc-caps-small",
    component: Bethistory,
    layout: "/dashboard",
  },
  {
    path: "/active-bets",
    name: i18n.ACTIVE_BETS.ACTIVE_BETS.english,
    icon: "nc-icon nc-tile-56",
    component: ActiveBets,
    layout: "/dashboard",
  }, {
    path: "/chart",
    name: i18n.CHART.CHART.english,
    icon: "nc-icon nc-caps-small",
    component: Chart,
    layout: "/dashboard",
  }, 
  // {
  //   path: "/account-statement",
  //   name: "Account Statement",
  //   icon: "nc-icon nc-pin-3",
  //   component: Accountstatement,
  //   layout: "/dashboard",
  // },
  {
    path: "/account-statement",
    name: i18n.ACCOUNT_STATEMENT.ACCOUNT_STATEMENT.english,
    icon: "nc-icon nc-pin-3",
    component: Account,
    layout: "/dashboard",
  },
  {
    path: "/edit-user",
    name: i18n.EDIT_PROFILE.EDIT_PROFILE.english,
    icon: "nc-icon nc-caps-small",
    component: Edituser,
    layout: "/dashboard",
  }
]
var innerroute = [
  {
    path: "/edituser/:id",
    name: "Edit User",
    icon: "nc-icon nc-diamond",
    component: Edituser,
    layout: "/dashboard",
  },
  {
    path: "/gametype/:id",
    name: "Game type",
    icon: "nc-icon nc-diamond",
    component: Gametype,
    layout: "/dashboard",
  },
  {
    path: "/game/:id",
    name: "Game",
    icon: "nc-icon nc-diamond",
    component: Game,
    layout: "/dashboard",
  },
  {
    path: "/setting/:id",
    name: "Lottery setting",
    icon: "nc-icon nc-diamond",
    component: Lotterysetting,
    layout: "/dashboard",
  },
  {
    path: "/last-result/:id",
    name: "Last Result",
    icon: "nc-icon nc-diamond",
    component: LotteryResult,
    layout: "/dashboard",
  },
  {
    path: "/today/:id",
    name: "Bet Type",
    icon: "nc-icon nc-diamond",
    component: Bettype,
    layout: "/dashboard",
  },
  {
    path: "/lottery/:id/:name/:type/:time/:pathParam2",
    name: "Single",
    icon: "nc-icon nc-diamond",
    component: Betlistbytype,
    layout: "/dashboard",
  },
  {
    path: "/lottery/:id/:name/:type/:time",
    name: "Single",
    icon: "nc-icon nc-diamond",
    component: Betlistbytype,
    layout: "/dashboard",
  },
  {
    path: "/masters/:id",
    name: "Masters",
    icon: "nc-icon nc-bank",
    component: Master,
    layout: "/dashboard",
  },
  {
    path: "/masters/",
    name: "Masters",
    icon: "nc-icon nc-bank",
    component: Master,
    layout: "/dashboard",
  },
  {
    path: "/users/:id",
    name: "Masters",
    icon: "nc-icon nc-bank",
    component: Users,
    layout: "/dashboard",
  },
  {
    path: "/users/",
    name: "Masters",
    icon: "nc-icon nc-bank",
    component: Users,
    layout: "/dashboard",
  },
  {
    path: "/change-password",
    name: "Change Password",
    icon: "nc-icon nc-bank",
    component: Changepassword,
    layout: "/dashboard",
  },
  {
    path: "/user/profitandloss/:id",
    name: "Profit & Loss",
    icon: "nc-icon nc-tile-56",
    component: Profitandloss,
    layout: "/dashboard",
  },
  {
    path: "/user/account-statement/:id",
    name: "Account Statement",
    icon: "nc-icon nc-pin-3",
    component: Accountstatement,
    layout: "/dashboard",
  },
  {
    path: "/manage/today/:id/:name/:type/:time",
    name: "Today Betting",
    icon: "nc-icon nc-bank",
    component: Betting,
    layout: "/dashboard",
  },
  {
    path: "/account-details",
    name: "Account Details",
    icon: "nc-icon nc-pin-3",
    component: AccountDetails,
    layout: "/dashboard",
  },
];

var auth = [
  {
    path: "/login",
    name: "Login",
    layout: "/user",
    component: Login,
  },
];
export {
  routes, innerroute, auth, supermasterroute,
  master,
  userHindi,
  userEnglish
};
