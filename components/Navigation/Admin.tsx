import { FC } from "react";
import { AddIcon, TimeIcon, ViewIcon, MinusIcon } from "@chakra-ui/icons";
import {
  ProSidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  Menu,
  MenuItem,
  SubMenu,
} from "react-pro-sidebar";
import "react-pro-sidebar/dist/css/styles.css";
import { Link } from "@chakra-ui/react";
import { Icon, createIcon } from "@chakra-ui/react";
import {
  TankIcon,
  CustomerIcon,
  StockIcon,
  PriceIcon,
  StaffIcon,
} from "../Icons/Icons";

import { useDisclosure } from "@chakra-ui/react";
import CreateCompany from "../Admin/CreateCompany";
import CreateBranch from "../Admin/CreateBranch";



const AdminNav: FC<any> = (props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { isOpen:isOpenBranch, onOpen:onOpenBranch, onClose:onCloseBranch } = useDisclosure();
 
  


  return (
    <ProSidebar breakPoint="md">
      <SidebarHeader
        style={{
          marginBottom: "24px",
          paddingBottom: "8px",
        }}
      >
        <Menu>
          <MenuItem>{props.company?.name}</MenuItem>
        </Menu>
      </SidebarHeader>
      <SidebarContent>
        <Menu>
          <MenuItem icon={<TimeIcon></TimeIcon>}>Sales</MenuItem>

          <SubMenu title="Stock" icon={<StockIcon />}>
          <MenuItem style={{padding: "8px"}}>
            <Link href="/Admin/#">View Stock Records</Link>
          </MenuItem>
          <MenuItem style={{padding: "8px"}}>
            <Link href="/Admin/#">Add & Update Stock</Link>
          </MenuItem>
          </SubMenu>
          <MenuItem icon={<StockIcon />}>
            <Link href="/Admin/Stock">Stock</Link>
          </MenuItem>

          <MenuItem icon={<TankIcon />}>
            <Link href="/Admin/Tanks">Tanks</Link>
          </MenuItem>
          <SubMenu title="Prices" icon={<PriceIcon />}>
          <MenuItem style={{padding: "8px"}}>
            <Link href="/Admin/Prices">Add & Update Price</Link>
          </MenuItem>
          <MenuItem style={{padding: "8px"}}>
            <Link href="/Admin/Prices/PriceList">Price List</Link>
          </MenuItem>
          </SubMenu>
          
          <MenuItem icon={<CustomerIcon />}>
          <Link href="/Admin/Customers">Customers</Link>
          </MenuItem>
          <MenuItem icon={<StaffIcon />}>
            <Link href="/Admin/Staff">Staff</Link>
          </MenuItem>
        </Menu>
      </SidebarContent>
      <SidebarFooter
        style={{
          marginTop: "24px",
          paddingTop: "8px",
        }}
      >
        <Menu>
          <SubMenu style={{ marginBottom: "8px" }} title="Company">
            <MenuItem icon={<AddIcon />}>
              <Link onClick={onOpen} href="#">
                Add New
              </Link>
            </MenuItem>
          </SubMenu>

          <SubMenu title="Branch">
            <MenuItem icon={<AddIcon />}>
              <Link onClick={onOpenBranch} href="#">
                Add New
              </Link>
            </MenuItem>
          </SubMenu>
        </Menu>
      </SidebarFooter>
      <CreateCompany isOpen={isOpen} onClose={onClose}></CreateCompany>
      <CreateBranch isOpen={isOpenBranch} onClose={onCloseBranch}></CreateBranch>
    </ProSidebar>
  );
};



export default AdminNav;
