import { Box, Flex, Spacer } from '@chakra-ui/react';
import { Text } from '@chakra-ui/react';
import { FC } from 'react';
import {
    Stat,
    StatLabel,
    StatNumber,
    StatHelpText,
    StatArrow,
    StatGroup,
  } from '@chakra-ui/react'
interface PropTy {
    label: String
    statNumber: number
    helper: String
}
const CustomStat:FC<PropTy> = (props) =>  {
    // Optional Color Scheme Prop 
    return (
        <Stat mr={4} p={2} borderWidth='1px' borderRadius='lg'>
          <StatLabel>{props.label}</StatLabel>
          <StatNumber>{props.statNumber}</StatNumber>
          <StatHelpText>
            <StatArrow type='increase' />
            {props.helper}
          </StatHelpText>
        </Stat>
    )
}

export default CustomStat;