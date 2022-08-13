import Link from 'next/link';
import Head from '../../components/head';
import Nav from '../../components/nav';
import WithSubnavigation  from '../../components/Navigation/CashierNav';
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
import SaleForm from '../../components/FrontDesk/SaleForm';

//React Imports
import { useState } from 'react';

//Utilities 
import { useRadioGroup } from '@chakra-ui/react';


export default () => {
  const options:string[] = ['Domestic', 'Dealer', 'Eatery', 'Other']
  const [category, setCategory] = useState('react')

  const categoryPrices = {
    domestic: 720,
    dealer: 680,
    eatery: 700
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

console.log(prices[0][1])

  const [pricePerKg, setPricePerKg] = useState<number | null>()
  
  const toast = useToast()
  
  const handleChange = (value:any) => {
    toast({
      title: `The value got changed to ${value}!`,
      status: 'success',
      duration: 2000,
    })
    setCategory(value)
    console.log(category)
  }
  

  const { value, getRootProps, getRadioProps } = useRadioGroup({
    name: 'framework',
    defaultValue: 'Domestic',
    onChange: handleChange
  })

  const group = getRootProps()
    return (
        <div>
        <WithSubnavigation></WithSubnavigation>
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

            <Box className='prices'>
                <Text my={2} color={'grey.500'} fontSize='xl'>Prices</Text>
                <HStack>
                {[1, 3, 5, 6, 10, 12.5, 15, 25, 50].map((size) => (
                   <PriceLabel key={size} kilogram='name' price={size}></PriceLabel>
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
                <SaleForm></SaleForm>
            </Box>
            
        </Box>

        <Box my={4} className='sales-form'>
            
        </Box>
    </div>
    )
}
    
    
