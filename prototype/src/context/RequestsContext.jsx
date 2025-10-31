import React, { createContext, useContext, useState } from "react";
import { initialRequests } from "../model/requests";

const RequestContext = createContext();

export const useRequests = () => useContext(RequestContext);

export const RequestProvider = ({ children }) => {
  const [requests, setRequests] = useState(initialRequests);

  const updateRequest = (id, updatedData) => {
    setRequests((prev) =>
      prev.map((req) =>
        req.request_id === id ? { ...req, ...updatedData } : req,
      ),
    );
  };

  const addRequest = (requestToAdd) => {
    setRequests((prev) => [...prev, requestToAdd]);
  };

  return (
    <RequestContext.Provider value={{ requests, updateRequest, addRequest }}>
      {children}
    </RequestContext.Provider>
  );
};
