import { UserData } from "../types";
import OrderList from "./OrderList";

interface Props {
  userData: UserData;
}

const AccountOrders: React.FC<Props> = ({ userData }) => {
  return <OrderList userData={userData} />;
};

export default AccountOrders;
