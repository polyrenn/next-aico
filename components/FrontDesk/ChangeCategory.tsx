//Layout Imports
import { Box, Stack, HStack } from "@chakra-ui/react";
//Element Imports
import { Text } from "@chakra-ui/react";
import { RadioGroup, Radio } from "@chakra-ui/react";
//React Imports
import { FC } from "react";
import { useState } from "react";
//Utility Imports
import { useRadio } from "@chakra-ui/react";
import { useColorModeValue } from "@chakra-ui/react";


interface CategoryProps {
    kilogram: String
    price: number
}

const CategoryRadios:FC<any> = (props:any) => {
  const { state, getInputProps, getCheckboxProps } = useRadio(props)

  const input = getInputProps()
  const checkbox = getCheckboxProps()

  return (
    <Box as='label'>
      <input {...input} />
      <Box
        {...checkbox}
        cursor='pointer'
        borderWidth='1px'
        borderRadius='full'
        _checked={{
          bg: 'green.200',
          color: 'green.700',
          borderColor: 'green.200',
        }}
        _focus={{
          boxShadow: 'outline',
        }}
        px={5}
        py={2}
      >
        {props.children}
      </Box>
    </Box>
  )
}

export default CategoryRadios