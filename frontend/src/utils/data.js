import {
  LuLayoutDashboard,
  LuHandCoins,
  LuWalletMinimal,
  LuLogOut,
  LuUser,
  LuLandmark,
  LuTarget, 
  LuScale, 
} from "react-icons/lu";

export const SIDE_MENU_DATA = [
  { id: "01", label: "Dashboard", icon: LuLayoutDashboard, path: "/dashboard" },
  { id: "02", label: "Income", icon: LuWalletMinimal, path: "/income" },
  { id: "03", label: "Expense", icon: LuHandCoins, path: "/expense" },
  { id: "04", label: "Budgeting", icon: LuScale, path: "/" },
  { id: "05", label: "Goals/Savings", icon: LuTarget, path: "/" },
  { id: "06", label: "Banks", icon: LuLandmark, path: "/" },
  { id: "07", label: "Profile", icon: LuUser, path: "/profile" },
  { id: "08", label: "Logout", icon: LuLogOut, path: "/logout" },
];