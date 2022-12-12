import Link from "next/link";
import Head from "../components/head";
import Nav from "../components/nav";
import WithSubnavigation from "../components/Navigation/FrontDesk";
import { Box, Checkbox, HStack, Select } from "@chakra-ui/react";
import { useRef, useState } from "react";
import { GetServerSideProps } from "next";
import {
  Formik,
  Field,
  Form,
  FormikHelpers,
  FormikProps,
  FieldArray,
} from "formik";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Text,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  FormHelperText,
  Input,
} from "@chakra-ui/react";

import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
} from "@chakra-ui/react";
import * as Yup from 'yup';

import { prisma } from "../lib/prisma";
import CrbForm from "../components/Common/CrbForm";

export default (props: any) => {
  

  return (
    <div>
      <Head title="Home" />
      <Nav />
      <Box mx={8} className="hero">

        <h1 className="title">
          Welcome to Create Next App (Create Next.js App building tools)
        </h1>
        <p className="description">
          To get started, edit <code>pages/index.js</code> and save to reload.
        </p>
        <div className="row">
          <Link href="//nextjs.org/docs/">
            <a className="card">
              <h3>Getting Started &rarr;</h3>
              <p>Learn more about Next.js on official website</p>
            </a>
          </Link>
          <Link href="//github.com/create-next-app/create-next-app">
            <a className="card">
              <h3>Create Next App&rarr;</h3>
              <p>Was this tools helpful?</p>
            </a>
          </Link>
        </div>
      </Box>


      <style jsx>{`
        .hero {
          width: 100%;
          color: #333;
        }
        .title {
          margin: 0;
          width: 100%;
          padding-top: 80px;
          padding-bottom: 12px;
          line-height: 1.15;
          font-size: 37px;
        }
        .title,
        .description {
          text-align: center;
        }
        .row {
          max-width: 587px;
          margin: 80px auto 40px;
          display: flex;
          flex-direction: row;
          justify-content: space-around;
        }
        .card {
          padding: 18px 18px 24px;
          width: 220px;
          text-align: left;
          text-decoration: none;
          color: #434343;
          border: 1px solid #9b9b9b;
        }
        .card:hover {
          border-color: #067df7;
        }
        .card h3 {
          margin: 0;
          color: #067df7;
          font-size: 18px;
        }
        .card p {
          margin: 0;
          padding: 12px 0 0;
          font-size: 13px;
          color: #333;
        }
      `}</style>
    </div>
  );
};

