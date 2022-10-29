import { Status } from '../models/series.model';
import http from './axiosConfig';

export const getStatusesRequest = async () => {
  return await http.get<{ statuses: Status[] }>(`statuses`)
    .then((res) => res.data.statuses)
    .catch((err) => {
      throw err;
    });
}

export const saveStatusRequest = async (newStatus: Status) => {
  return await http.post<{ status: Status }>(`statuses`, {
      ...newStatus
    })
    .then((res) => res.data.status)
    .catch((err) => {
      throw err;
    });
}

export const updateStatusRequest = async (id: number, updatedStatus: Status) => {
  return await http.put<{ message: string }>(`statuses/${id}`, {
      ...updatedStatus
    })
    .then((res) => res.data.message)
    .catch((err) => {
      throw err;
    });
}