import Link from 'next/link';
import Head from '../../components/head';
import Nav from '../../components/nav';
import WithSubnavigation  from '../../components/Navigation/FrontDesk';
//Layout Imports
import { Box, HStack, Center } from '@chakra-ui/react';
// Element Imports
import { Text, Button } from '@chakra-ui/react';
import { Radio, RadioGroup } from '@chakra-ui/react'
// Components
import StatBlock from '../../components/FrontDesk/StatBlock';
import PriceLabel from '../../components/FrontDesk/PriceLabel';
import CategoryRadios from '../../components/FrontDesk/ChangeCategory';
import { useToast } from '@chakra-ui/react';
// Tag Component
import {
    Tag,
    TagLabel,
    TagLeftIcon,
    TagRightIcon,
    TagCloseButton,
  } from '@chakra-ui/react'

// Icons
import { PhoneIcon, AddIcon, WarningIcon } from '@chakra-ui/icons'
import SaleForm from '../../components/FrontDesk/Crb/SaleForm';

//React Imports
import { useState, createContext } from 'react';

//Utilities 
import { useRadioGroup } from '@chakra-ui/react';
import { prisma } from "../../lib/prisma";
import { GetServerSideProps } from 'next';
import { withSessionSsr } from '../../lib/withSession';
import useSWR from 'swr';
import { useDisclosure } from '@chakra-ui/react';
import Report from '../../components/FrontDesk/Crb/Report';
import DayStats from '../../components/Common/DayStats';
import SwitchLog from '../../components/Common/SwitchLog';
const fetcher = (url:string) => fetch(url).then((res) => res.json())
export const BranchContext = createContext<{ address: string, branchId: number } | undefined>(undefined);


export default (props:any) => {

  //Pass Branch From Login Context
  const { data, error } = useSWR('/api/Common/BranchDetails', fetcher, {
    onSuccess: (data) => {
     
}});

  const branchId = props.branch.branchId
  const user = props.user

  const categoryPrices: { category: string, pricePerKg: number, availableKgs: number[] }[] = props.prices
  const visibility = false
  //const options:string[] = ['Domestic', 'Dealer', 'Eatery', 'Other']
  const options:string[] = categoryPrices.map(a => a.category);
  const [category, setCategory] = useState<string>('Domestic');

  const [availableKgs, setAvailableKgs] = useState<number[]>()

  const priceList: { category: string, price: number }[] = [
    {
      category: 'Domestic',
      price: 720
    },

    {
      category: 'Dealer',
      price: 680
    },

    {
      category: 'Eatery',
      price: 700
    }
  ]

  priceList.map(({category, price}) => (
   console.log(category, price)
 ))

 interface PriceType {
  domestic: number;
  dealer: number;
  eatery: number
  other: number
}
  
  

  let prices = [
    [
    'Domestic', 720
    ],
    [
     'Dealer', 680   
    ],
    [
     'Eatery', 700
    ]
]

console.log(props.branch)

console.log(prices[0][1])

  const defaultKgs = categoryPrices.find(element => element.category === 'Domestic')?.availableKgs;
  const defaultPrice = categoryPrices.find(element => element.category === 'Domestic')?.pricePerKg as number
  const [priceKgs, setPriceKgs] = useState<number[] | undefined>(defaultKgs)

  const [pricePerKg, setPricePerKg] = useState<number>(defaultPrice)
  
  const toast = useToast()
  const currentDate = new Date().toISOString()
  
  const handleChange = (value:any) => {
    toast({
      title: `The value got changed to ${value}!`,
      status: 'success',
      duration: 2000,
    })
    setCategory(value)
    let valu = `${value}`.toLowerCase()

    const price = categoryPrices.find(element => element.category === value)?.pricePerKg as number
    const kgs = categoryPrices.find(element => element.category === value)?.availableKgs;
    setPricePerKg(price)
    setPriceKgs(kgs)
  
    console.log(categoryPrices)
    console.log(category)
  }

  
  console.log(props.prices)
  console.log(props.user)
  

  const { value, getRootProps, getRadioProps, setValue } = useRadioGroup({
    name: 'framework',
    onChange: handleChange,
    defaultValue: 'Domestic'
  })

  const resetToDefault = () => {
    setPricePerKg(defaultPrice)
    setPriceKgs(defaultKgs)
    setCategory("Domestic")
    setValue('Domestic')
  }
  

  const group = getRootProps()
  //Report Helpers
  const {isOpen, onClose, onOpen} = useDisclosure()  

    return (
        <div>
        <WithSubnavigation user={user} branch={props.branch}></WithSubnavigation>
        <Head title="Crb Desk" />
        <Box className='main-content' mx={8}>
            {/* Optional Prop Number that determines Number of Stat to Render in the Block */}
            <Center mt={2} className="switch-log">
            <SwitchLog branch={branchId} date={new Date().toISOString()}></SwitchLog>
            </Center>
            <Center className='stats'>
                <DayStats margin={true} date={currentDate} branch={branchId}></DayStats>
            </Center>

            <Box className='Utils'>
              {

              /*
                <Center>
                    <Button w="56" onClick={onOpen} colorScheme='purple'>Report</Button>
                </Center>
              */
              }  
            </Box>
          {
            /*
          
            <Box>
              {
                priceList.map(({category, price}) => (
                   <Text key={price}>Category - {category} Price - {price}</Text>
                ))
              
              }
            </Box>
            <Box className='prices'>
                <Text my={2} color={'grey.500'} fontSize='xl'>Prices</Text>
                <HStack>
                {[1, 3, 5, 6, 10, 12.5, 15, 25, 50].map((size) => (
                   <PriceLabel key={size} kilogram={size} price={pricePerKg}></PriceLabel>
                ))}
                </HStack>
            </Box>
                */}
            <Box className='category'>
                <Text style={ visibility ? {
                  visibility: 'hidden'
                }: {
                  visibility: 'visible'
                }} my={2} color={'grey.500'} fontSize='xl'>Category - {category}</Text>
                <HStack {...group}>
      {options.map((value) => {
        const radio = getRadioProps({ value })
        return (
          <Box>
           <CategoryRadios key={value} {...radio}>
            {value}
          </CategoryRadios>
          </Box>
         
        )
      })}
    </HStack>
            </Box>

            <Box my={4}>
            <BranchContext.Provider value={props.branch}>
                <SaleForm
                  resetToDefault={resetToDefault}
                 availableKgs={priceKgs}
                 category={category} branch={props.branch} post={props.post} pricePerKg={pricePerKg}></SaleForm>
            </BranchContext.Provider>    
            </Box>
            
            <Report branch={props.branch} branchId={branchId} isOpen={isOpen} onClose={onClose}></Report>
        </Box>

        <Box my={4} className='sales-form'>
            
        </Box>
        <style jsx global>{`
       .css-1zts0j {
        color: #0d0d0d !important;
        font-size: 14px !important;
       }
       .renn {
        background-color: red
       }
       .css-1dgdoa4 {
        color: #0d0d0d !important;
       }
      `}</style>
    </div>
    )
}


export const getServerSideProps = withSessionSsr(
  async function getServerSideProps({ req }) {

  const user = req.session.user;

  if (user?.role !== 'Crb Attendant') {
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

  const post = await prisma.customer.findMany({
    select: {
      name: true,
      branchId: true
    },
  });

  const branch = await prisma.branch.findFirst({
    where: {
      branchId: user?.branch // Uses First Found on Undefined
    },
    select: {
      address: true,
      branchId: true,
      name: true
    },
  });

  const prices = await prisma.prices.findMany({
    where: {
      branchId: user?.branch // Context From Login
    },

    select: {
      category: true,
      pricePerKg: true,
      availableKgs: true
    },

    orderBy: {
      id: 'asc'
    }
  });
  
  

  return {
    props: { post, branch, prices, user },
  };

},
);
  
  
