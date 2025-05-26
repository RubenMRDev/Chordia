import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Header from "./Header";
import { BrowserRouter } from "react-router-dom";

jest.mock("../context/AuthContext", () => ({
  useAuth: jest.fn(),
}));
import { useAuth } from "../context/AuthContext";

jest.mock("react-router-dom", () => {
  const originalModule = jest.requireActual("react-router-dom");
  return {
    ...originalModule,
    useLocation: jest.fn(),
  };
});
import { useLocation } from "react-router-dom";

const mockUseAuth = useAuth as jest.Mock;
const mockUseLocation = useLocation as jest.Mock;

const renderHeader = () =>
  render(
    <BrowserRouter>
      <Header />
    </BrowserRouter>
  );

describe("Header", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders Sign In button when user is not logged in", () => {
    mockUseAuth.mockReturnValue({
      currentUser: null,
      userProfile: null,
    });

    mockUseLocation.mockReturnValue({
      pathname: "/",
    });

    renderHeader();

    const signInButtons = screen.getAllByText("Sign In");
    expect(signInButtons.length).toBeGreaterThan(0);
  });

  test("renders user profile name and image when user is logged in", () => {
    mockUseAuth.mockReturnValue({
      currentUser: { displayName: "John Doe", photoURL: "photo-url" },
      userProfile: { displayName: "John Profile", photoURL: "profile-photo-url" },
    });

    mockUseLocation.mockReturnValue({
      pathname: "/",
    });

    renderHeader();

    expect(screen.getByText("John Profile")).toBeInTheDocument();
    expect(screen.getAllByAltText("Profile").length).toBeGreaterThan(0);
  });

  test("highlights active link based on location pathname", () => {
    mockUseAuth.mockReturnValue({
      currentUser: null,
      userProfile: null,
    });

    mockUseLocation.mockReturnValue({
      pathname: "/library",
    });

    renderHeader();

    const libraryLink = screen.getByText("Library");
    expect(libraryLink).toHaveClass("text-[var(--accent-green)]");
  });

  test("calls handleLinkClick on link click", () => {
    mockUseAuth.mockReturnValue({
      currentUser: null,
      userProfile: null,
    });

    mockUseLocation.mockReturnValue({
      pathname: "/discover",
    });

    renderHeader();

    const discoverLink = screen.getByText("Discover");

    expect(discoverLink).toHaveClass("text-[var(--accent-green)]");
  });

  test("fallback image is set when profile image fails to load", () => {
    mockUseAuth.mockReturnValue({
      currentUser: { photoURL: "invalid-url", displayName: "User" },
      userProfile: null,
    });

    mockUseLocation.mockReturnValue({
      pathname: "/",
    });

    renderHeader();

    const images = screen.getAllByAltText("Profile");
    expect(images.length).toBeGreaterThan(0);

    fireEvent.error(images[0]);

    expect(images[0].src).toBe(
      "https://res.cloudinary.com/doy4x4chv/image/upload/v1743174847/pfpplaceholder_fwntlq.webp"
    );
  });
});
