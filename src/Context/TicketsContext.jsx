import { createContext, useState, useContext, useEffect } from "react";
import { getTickets, changeTicketStatus } from "../Services/ticketsService";
export const TicketContext = createContext();

export const useTicketContext = () => {
  const context = useContext(TicketContext);
  if (!context) {
    throw new Error("useTicketContext must be used within a TicketProvider");
  }
  return context;
};

export const TicketProvider = ({ children }) => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(null);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getTickets();
      const tickets = data?.tickets || [];
      setTickets(tickets);
    } catch (error) {
      console.error("Failed to fetch tickets:", error);
      setError(error.message || "Failed to load tickets");
      setTickets([]);
    } finally {
      setLoading(false);
    }
  };

  const updateTicketStatus = async (ticketId, status) => {
    try {
      setUpdating(ticketId);
      setError(null);

      await changeTicketStatus( ticketId, status);

      setTickets((prevTickets) =>
        prevTickets.map((ticket) =>
          ticket.ticketId === ticketId ? { ...ticket, status } : ticket
        )
      );

      return { success: true };
    } catch (error) {
      console.error("Failed to update ticket status:", error);
      setError(error.message || "Failed to update ticket status");

      await fetchTickets();

      return { success: false, error: error.message };
    } finally {
      setUpdating(null);
    }
  };

  const retry = async () => {
    await fetchTickets();
  };

  const getTicketsByStatus = (status) => {
    return tickets.filter((ticket) => ticket.status === status);
  };

  const getStatusCounts = () => {
    return {
      pending: tickets.filter((ticket) => ticket.status === "P").length,
      completed: tickets.filter((ticket) => ticket.status === "C").length,
      rejected: tickets.filter((ticket) => ticket.status === "R").length,
      total: tickets.length,
    };
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const value = {
    tickets,
    loading,
    error,
    updating,

    fetchTickets,
    updateTicketStatus,
    retry,

    getTicketsByStatus,
    getStatusCounts,
  };

  return (
    <TicketContext.Provider value={value}>{children}</TicketContext.Provider>
  );
};
