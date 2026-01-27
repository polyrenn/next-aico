import {
  Box,
  Divider,
  Stack,
  Flex,
  HStack,
  Spacer,
  VStack,
  Heading,
  Text,
  Button,
  Spinner,
  Center,
} from "@chakra-ui/react";
import {
  useFormik,
  Formik,
  FormikHelpers,
  FormikProps,
  FieldArray,
  Form,
  Field,
  FieldProps,
} from "formik";

import useSWR from "swr";
import ReactToPrint from "react-to-print";
import { useReactToPrint } from "react-to-print";

import React, {
  FC,
  useEffect,
  useRef,
  Ref,
  useState,
  ReactInstance,
} from "react";

type Summary = {
  kg: string;
  amount: number;
  total: number;
};

type FormValues = {
  friends: [];
};

interface SummaryProps {
  summary: any;
  ref: any;
  form: FormikProps<any>;
  customer: string;
  pricePerKg: number;
  cancelSummary: any;
  category: String | undefined;
}

import { useColorModeValue } from "@chakra-ui/react";
import CrbTable from "../Common/CrbTable";
import CrbNumber from "./CrbNumber";
import { useRouter } from "next/router";
import checkNetworkAndInternet from "../../../utils/network";

const SummaryCard: FC<SummaryProps> = React.forwardRef((props, ref) => {
  const router = useRouter();

  useEffect(() => {
    window.addEventListener("online", () => console.log("online"));
    /*
  window.addEventListener('offline', () => {
    router.push("/Login")
  })
  */
  }, []);

  const [error, setError] = useState(false);
  const [currentTime, setCurrentTime] = useState("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  let componentRef = useRef<null | HTMLDivElement>(null);

  const summary = props.summary;
  const customer = props.customer;
  let sidebar;
  console.log(props.customer);
  const form = props.form;
  //const customer = formValues.current.values.user

  useEffect(() => {
    console.log(summary);
  }, [summary]);

  sidebar = summary.map((item: any) => (
    <Box bg="#fafafa" key={item.kg}>
      <HStack border="2px solid" my={4} h="48px" px={8} justify="space-between">
        <Flex>
          <Text fontWeight={500}>{item.amount}x</Text>
          <Text fontWeight={500} key={item.kg}>
            {item.kg} Kg
          </Text>
        </Flex>

        <Text fontWeight={700}> Total {item.amount * item.kg} KG</Text>
        <Text>{item.amount * item.kg * props.pricePerKg}</Text>
      </HStack>
      <Divider orientation="horizontal" />
    </Box>
  ));

  const handleCancel = () => {
    props.cancelSummary([]);
  };

  const getTime = () => {
    return new Date().toLocaleTimeString();
  };

  const getDate = () => {
    return new Date().toLocaleDateString("en-UK");
  };

  console.log(summary.length == 0 || customer == "");

  const printRef = useRef(null);

  // We store the resolve Promise being used in `onBeforePrint` here
  const promiseResolveRef = useRef(null);

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    onBeforePrint: async () => {
      setIsSubmitting(true)
      console.log("Before Print: Checking network and internet...");
      const isConnected = await checkNetworkAndInternet();

      return new Promise((resolve, reject) => {
        if (isConnected) {
          console.log("Network and internet OK. Proceeding with print.");
          resolve(true);
          setIsSubmitting(false)
          form.current.submitForm()
        } else {
          console.log("No network or internet connection. Cancelling print.");
          reject(new Error("No network or internet connection"));
          // Optionally: Show a user-friendly message about the connection issue
          alert("Please check your network connection and try again.");
          setIsSubmitting(false)
        }
      });
    },
    onAfterPrint: () => {},
  });

  const Print: FC<any> = React.forwardRef((props, ref) => {
    return (
      <Box ref={ref} p={4}>
        <Stack justifyContent="space-between" direction="row" spacing={1}>
          <Box>
            <Heading size="md">Summary</Heading>
          </Box>

          <Box>
            <Heading size="md">{props.category}</Heading>
          </Box>
        </Stack>
        <CrbNumber error={setError}></CrbNumber>
        <Box>
          <Heading size="xs">Customer: {props.customer?.split("0")[0]}</Heading>
          <Stack>{new Date().toLocaleDateString()}</Stack>
        </Box>

        <Box fontWeight={500} fontSize={18} my={2} w="100%">
          <Heading mb={2} size="xs">
            Date: {summary.length > 0 ? getDate() : ""}
          </Heading>

          <Heading size="xs">
            Time: {summary.length > 0 ? getTime() : ""}
          </Heading>
        </Box>
        <Divider my={4} orientation="horizontal" />
        <CrbTable pricePerKg={props.pricePerKg} summary={summary}></CrbTable>
        <VStack my={4}>
          <Heading size="sm">Proceed to CashPoint</Heading>
        </VStack>
        {/* <Button isDisabled={summary.length == 0 ? true : false} width="full" onClick={() => form.current.submitForm()} colorScheme="purple">Complete</Button> */}
      </Box>
    );
  });

  const CrbNumber2 = () => {
    const [number, setNumber] = useState<number>(0);

    const fetcher = (url: string) => fetch(url).then((res) => res.json());
    const { data, error } = useSWR("/api/dummycrb", fetcher, {
      refreshInterval: 1000,
    });

    if (!data)
      return (
        <Center>
          <Spinner></Spinner>
        </Center>
      );

    console.log(props.form);

    return (
      <Text
        fontSize={"sm"}
        fontWeight={500}
        bg={useColorModeValue("cyan.50", "cyan.900")}
        p={2}
        px={4}
        my={2}
        width="fit-content"
        color={"cyan.900"}
        rounded={"md"}
      >
        {" "}
        CRB #{data.id + 1}
      </Text>
    );
  };

  return (
    <Box
      style={{
        position: "sticky",
        top: 0,
        alignSelf: "flex-start",
      }}
      className="summary-card"
      p={4}
      bg="white"
      w="fit-content"
      rounded="md"
    >
      <Print
        customer={props.customer}
        category={props.category}
        ref={printRef}
      ></Print>

        <Button
            type="submit"
            isLoading={isSubmitting}
            loadingText="Processing"
            isDisabled={customer == "" || summary.length == 0 ? true : false}
            width="full"
            onClick={handlePrint}
            colorScheme="purple"
          >
            Complete
          </Button>

      <Button
        mt={4}
        onClick={() => props.cancelSummary([])}
        width="full"
        color="white"
        bg="black"
      >
        Cancel
      </Button>
    </Box>
  );
});

export default SummaryCard;
