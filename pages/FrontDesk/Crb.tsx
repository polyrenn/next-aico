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

export const BranchContext = createContext<{ address: string, branchId: number } | undefined>(undefined);
export default (props:any) => {
  const categoryPrices: { category: string, pricePerKg: number }[] = props.prices

  //const options:string[] = ['Domestic', 'Dealer', 'Eatery', 'Other']
  const options:string[] = categoryPrices.map(a => a.category);
  const [category, setCategory] = useState<string>();

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

  const [pricePerKg, setPricePerKg] = useState<number | undefined>(0)
  
  const toast = useToast()
  
  const handleChange = (value:any) => {
    toast({
      title: `The value got changed to ${value}!`,
      status: 'success',
      duration: 2000,
    })
    setCategory(value)
    let valu = `${value}`.toLowerCase()

    const price = categoryPrices.find(element => element.category === value)?.pricePerKg;

    setPricePerKg(price)
  
    console.log(categoryPrices)
    console.log(category)
  }

  
  console.log(props.prices)
  

  const { value, getRootProps, getRadioProps } = useRadioGroup({
    name: 'framework',
    onChange: handleChange
  })

  const group = getRootProps()
    return (
        <div>
        <WithSubnavigation branch={props.branch}></WithSubnavigation>
        <Head title="Crb Desk" />
        <Box className='main-content' mx={8}>
            {/* Optional Prop Number that determines Number of Stat to Render in the Block */}
            <Box my={4} className='stats'>
                <StatBlock></StatBlock>
            </Box>

            <Box className='Utils'>
                <Center>
                    <Button colorScheme='gray'>Report</Button>
                </Center>
            </Box>

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

            <Box className='category'>
                <Text my={2} color={'grey.500'} fontSize='xl'>Category - {category}</Text>
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
                <SaleForm category={category} branch={props.branch} post={props.post} pricePerKg={pricePerKg}></SaleForm>
            </BranchContext.Provider>    
            </Box>
            
        </Box>

        <Box my={4} className='sales-form'>
            
        </Box>
    </div>
    )
}


export const getServerSideProps = withSessionSsr(
  async function getServerSideProps({ req }) {

  const user = req.session.user;
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
      branchId: true
    },
  });

  const prices = await prisma.prices.findMany({
    where: {
      branchId: user?.branch // Context Fron Login
    },

    select: {
      category: true,
      pricePerKg: true
    }
  });
  
  

  return {
    props: { post, branch, prices },
  };

},
);
  
  
