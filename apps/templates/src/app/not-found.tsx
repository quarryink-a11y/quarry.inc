import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page Not Found - Quarry.ink",
  description: "The page you are looking for does not exist.",
};

export default function NotFound() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1
        style={{
          fontSize: "4rem",
          marginBottom: "1rem",
        }}
      >
        404
      </h1>
      <p
        style={{
          fontSize: "1.5rem",
          marginBottom: "2rem",
        }}
      >
        The page you are looking for does not exist.
      </p>
      <Link
        href="/"
        style={{
          fontSize: "1.2rem",
          color: "#0070f3",
          textDecoration: "underline",
        }}
      >
        Go back to Home
      </Link>
    </div>
  );
}
