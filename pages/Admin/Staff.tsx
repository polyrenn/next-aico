import Link from "next/link";
import Head from "../../components/head";
import Nav from "../../components/nav";
import WithSubnavigation from "../../components/Navigation/FrontDesk";
//Layout Imports
import {
  Box,
  VStack,
  Stack,
  Flex,
  Grid,
  GridItem,
  HStack,
  Center,
  Heading,
  Divider,
} from "@chakra-ui/react";
import { Tab, Tabs, TabList, TabPanel, TabPanels } from "@chakra-ui/react";
// Element Imports
import { Text, Button, Spinner, Avatar } from "@chakra-ui/react";
import { Radio, RadioGroup } from "@chakra-ui/react";
// Components
import { useToast } from "@chakra-ui/react";

// Icons
import { PhoneIcon, AddIcon, WarningIcon } from "@chakra-ui/icons";
import SaleForm from "../../components/FrontDesk/Crb/SaleForm";

//React Imports
import { useState, useContext, createContext, FC } from "react";

//Utilities
import { useRadioGroup, useColorModeValue } from "@chakra-ui/react";
import { prisma } from "../../lib/prisma";
import { Prisma, Staff } from "@prisma/client";
import { GetServerSideProps } from "next";
import useSWR from "swr";
import { useDisclosure } from "@chakra-ui/react";
import {
    AutoComplete,
    AutoCompleteInput,
    AutoCompleteItem,
    AutoCompleteList,
    AutoCompleteCreatable,
    AutoCompleteGroup
} from "@choc-ui/chakra-autocomplete";

import AdminNav from "../../components/Navigation/Admin";
import CategoryRadios from "../../components/FrontDesk/ChangeCategory";
import { withSessionSsr } from "../../lib/withSession";
import StaffTable from "../../components/Admin/Staff/StaffTable";
import NewStaff from "../../components/Admin/Staff/NewStaff";
import EditStaff from "../../components/Admin/Staff/EditStaff";

export const BranchContext = createContext<
  { address: string; branchId: number }[]
>([]);

interface PageProps<T> {
  branch: {
    address: string;
    branchId: number;
    name: string;
  };

  branches: {
    address: string;
    branchId: number;
  }[];

  company: {
    name: string;
    companyId: number;
  };

  user: {
    role: string,
    branchId: number
  }

  companies: T[];

  staffs: {
    id: number;
    companyID: number;
    branchId: number;
    username: string;
    password: string;
    role: string;
    branch: {
        name: string;
    };
  }[]
}

export default (props: PageProps<[]>) => {

    //Navigation Helpers
    const [collapsed, setCollapsed] = useState<boolean>(true);
    const [toggled, setToggled] = useState<boolean>(false);
  
    const handleCollapsedChange = (checked:boolean) => {
      setCollapsed(checked);
    };
  
    const handleToggleSidebar = (value:boolean) => {
      setToggled(value);
    };
  
    const handleToggleClose = (value:boolean) => {
      setToggled(value);
    };

    const staff = props.user

    //Modal Helpers
    const {isOpen, onOpen, onClose} = useDisclosure()
    const {isOpen:editIsOpen, onOpen:editOnOpen, onClose:editOnClose} = useDisclosure()

  
  const staffCount = props.staffs.length  
  console.log(props.companies);

  const [ branch, setBranch ] = useState<number>()
  const [tank, setTank] = useState<string | null>(null);
  const logInfo = (info: string) => {
    console.log(info);
    //setTank(info)
    return info;
  };

  const [user, setUser] = useState<string>("")
  
  const handleUserChange = (user:string) => {
    setUser(user)
  }
  const handleBranchChange = (branchId:number) => {
    setBranch(branchId)
  }


  return (
    <Flex height="100vh" width="100vw">
      <Head title="Admin - Staff"></Head>
      <Box height="100%" className="navigation">
        <AdminNav toggled={toggled}  handleToggleClose={handleToggleClose} company={props.company}></AdminNav>
      </Box>

      <Box overflowY="auto" w="100%" className="main-content">
        <WithSubnavigation user={user} handleCollapsedChange={handleCollapsedChange} handleToggleSidebar={handleToggleSidebar} branch={props.branch}></WithSubnavigation>
        <Box p={6} className="staffs">
        <Heading mb={4} color="gray.500" size="lg">Manage Accounts</Heading> 
        <Flex my={2} justify="space-between">
        <HStack>
              <Heading color="gray.800" size="sm">Staff</Heading>
              <Center
                rounded="sm"
                w="24px"
                h="24px"
                bg="green.200"
                color="green.500"
              >
               {staffCount}
              </Center>
            </HStack>
                <Button onClick={onOpen} colorScheme="blue">Add Staff</Button>
            </Flex>
            <StaffTable userChange={handleUserChange} onOpenEdit={editOnOpen} staff={props.staffs} branch={branch}></StaffTable>
        </Box>
        <NewStaff branch={branch} isOpen={isOpen} onClose={onClose}></NewStaff>
        <EditStaff user={user} branch={branch} isOpen={editIsOpen} onClose={editOnClose}></EditStaff>
      </Box>

    </Flex>
  );
};

// Auth Maybe
export const getServerSideProps = withSessionSsr(
  async function getServerSideProps({ req }) {

    const user = req.session.user;
    if (user?.role !== 'Admin' && user?.role !== 'Supervisor') {
      return {
        redirect: {
          destination: '/Login',
          permanent: false,
        },
      }
    }

    if (!user) {
      return {
        redirect: {
          destination: '/Login',
          permanent: false,
        },
      }
    }

    const branch = await prisma.branch.findFirst({
      where: {
        branchId: user?.branch
      },
      select: {
        address: true,
        branchId: true,
        name: true,
      },
    });

    let branches
  
    

    if(user?.role == 'Admin') {
        branches = await prisma.branch.findMany({
            select: {
              address: true,
              branchId: true,
              name: true
            },
            orderBy: {
              id: 'asc'
            }
          });
      } else {
        branches = await prisma.branch.findMany({
            where: {
                companyID: user.company
            },
            select: {
              address: true,
              branchId: true,
              name: true
            },
            orderBy: {
              id: 'asc'
            }
          });
      }

  const company = await prisma.company.findFirst({
    where: {
      companyId: user?.company
    },
    select: {
      name: true,
      companyId: true,
    },
  });

  const companies = await prisma.company.findMany({
    include: {
      branches: {
        include: {
          tanks: true,
        },
      },
    },
  });

  let staffs
  
    

    if(user?.role == 'Admin') {
        staffs = await prisma.staff.findMany({
            where: {
             NOT: [
              {
              role: 'Admin'
              }
             ]
            },
            include: {
              branch: {
                select: {
                  name: true
                }
              }
            },
            orderBy: {
              id: 'asc'
            }
          });
      } else {
        staffs = await prisma.staff.findMany({
            where: {
                companyID: user.company
            },
            include: {
              branch: {
                select: {
                  name: true
                }
              }
            },
            orderBy: {
              id: 'asc'
            }
          });
      }
  return {
    props: { branch, company, branches, companies, staffs, user },
  };
});
