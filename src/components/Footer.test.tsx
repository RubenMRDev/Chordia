import React from "react";
import { render, screen } from "@testing-library/react";
import Footer from "./Footer";

describe("Footer", () => {
  test("renders the footer element", () => {
    render(<Footer />);
    const footerElement = screen.getByRole("contentinfo"); 
    expect(footerElement).toBeInTheDocument();
  });

  test("displays the current year and copyright text", () => {
    render(<Footer />);
    const year = new Date().getFullYear().toString();
    expect(screen.getByText(new RegExp(`© ${year} Chordia. All rights reserved.`))).toBeInTheDocument();
  });
});
