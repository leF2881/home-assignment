import { useEffect } from "react";
import Header from "./Header";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { selectAllIncidents ,fetchIncidents} from "../../features/incidents/incidentsSlice";
export default function Dashboard() {
  const incidents = useAppSelector(selectAllIncidents);
  const dispatch=useAppDispatch()
useEffect(() => {
  dispatch(fetchIncidents());
}, [dispatch]);

  return (
    <>
      <Header />
     {incidents.map(item=><div key={item.id} className="text-white">{item.id}</div>)}
    </>
  );
}
