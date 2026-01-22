import axios from "@/utils/axios";
import { CreateTestIncident, Incident, IncidentUpdate ,GetIncidentsResponse} from "@/types/incident";

export const incidentsAPI = {
  getIncidents: async (): Promise<Incident[]> => {
    const response = await axios.get<GetIncidentsResponse>("/incidents");
    return response.data.incidents;
  },

  updateIncident: async (
    id: string,
    update: IncidentUpdate,
  ): Promise<Incident> => {
    const response = await axios.patch(`/incidents/${id}`, update);
    return response.data;
  },
  //for developer
  createTestIncident: async (
    incident: CreateTestIncident,
  ): Promise<Incident> => {
    const response = await axios.post<Incident>("/incidents/test", incident);
    return response.data;
  },
};
