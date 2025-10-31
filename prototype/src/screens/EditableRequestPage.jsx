import { useParams } from "react-router-dom";
import RequestDetail from "../components/request-detail";
import { useRequests } from "../context/RequestsContext";

export const EditableRequestPage = () => {
  const { id } = useParams();
  const { requests } = useRequests();
  const request = requests.find((r) => r.request_id === id);
  return request ? (
    <RequestDetail request={request} />
  ) : (
    <Typography variant="h6" sx={{ mt: 4 }}>
      Anfrage nicht gefunden.
    </Typography>
  );
};
