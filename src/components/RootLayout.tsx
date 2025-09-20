'use client';
import React, { ReactElement } from "react";
import Top from "./Headers/Top";
import Bottomheader from "./Headers/Bottomheader";
import Footer from "./Footer";

interface Props {
  children: ReactElement;
}

const RootLayout = ({ children }: Props) => {
  return (
    <>
      <Top />
      <Bottomheader />
      {children}
      <Footer />
    </>
  );
};

export default RootLayout;
