//Layout Imports
import { Stack, HStack } from "@chakra-ui/react";
//Element Imports
import { Text } from "@chakra-ui/react";
//React Imports
import { FC } from "react";
//Utility Imports
import { useColorModeValue } from "@chakra-ui/react";

interface PriceProps {
    kilogram: number
    price: number
}

const PriceLabel:FC<PriceProps> = (props) => {
    return (
        <HStack
            fontSize={'sm'}
            fontWeight={500}
            bg={useColorModeValue('cyan.50', 'cyan.900')}
            p={2}
            px={4}
            color={'cyan.900'}
            rounded={'md'}
        >
            <Text>{props.kilogram} KG</Text>
            <Text>{props.price * props.kilogram}</Text>
        </HStack>
    )
}

export default PriceLabel