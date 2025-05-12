
import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <div className="flex h-screen items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-purple-600">404</h1>
        <h2 className="mt-4 text-3xl font-bold tracking-tight">Page not found</h2>
        <p className="mt-2 text-lg text-muted-foreground">
          Sorry, we couldn't find the page you're looking for.
        </p>
        <Button asChild className="mt-8">
          <Link to="/">Back to Dashboard</Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFoundPage;
