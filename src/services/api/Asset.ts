import { request } from '../request';
import { config } from '../../config/config';
import * as dto from '../dto/Asset';

const BASE_URL = config.apiUrl;

export const assetService = {
  getDetail: () => {
    return request<dto.DetailResponseDTO>({
      method: 'GET',
      url: `${BASE_URL}/asset/detail`,
    });
  },
  getRealEstates: () => {
    return request<dto.RealEstatesResponseDTO>({
      method: 'GET',
      url: `${BASE_URL}/asset/real-estates`,
    });
  },
  getCars: () => {
    return request<dto.CarsResponseDTO>({
      method: 'GET',
      url: `${BASE_URL}/asset/cars`,
    });
  },
  getPensions: () => {
    return request<dto.PensionsResponseDTO>({
      method: 'GET',
      url: `${BASE_URL}/asset/pensions`,
    });
  },
  postConnectAll: () => {
    return request<dto.ConnectResponseDTO>({
      method: 'POST',
      url: `${BASE_URL}/asset/connect/all`,
    });
  },
  postConnectSelected: (data: dto.ConnectSelectedRequestDTO) => {
    return request<dto.ConnectResponseDTO>({
      method: 'POST',
      url: `${BASE_URL}/asset/connect/selected`,
      data,
    });
  },
  postCar: (data: dto.PostCarRequestDTO) => {
    return request<dto.PostCarResponseDTO>({
      method: 'POST',
      url: `${BASE_URL}/asset/car`,
      data,
    });
  },
  postRealEstate: (data: dto.PostRealEstateRequestDTO) => {
    return request<dto.PostRealEstateResponseDTO>({
      method: 'POST',
      url: `${BASE_URL}/asset/real-estate`,
      data,
    });
  },
  getVirtual: () => {
    return request<dto.VirtualResponseDTO>({
      method: 'GET',
      url: `${BASE_URL}/asset/virtual`,
    });
  },
  getSecurities: () => {
    return request<dto.SecuritiesResponseDTO>({
      method: 'GET',
      url: `${BASE_URL}/asset/securities`,
    });
  },
  getBanks: () => {
    return request<dto.BanksResponseDTO>({
      method: 'GET',
      url: `${BASE_URL}/asset/bank`,
    });
  },
  getCash: () => {
    return request<dto.CashResponseDTO>({
      method: 'GET',
      url: `${BASE_URL}/asset/cash`,
    });
  },
  patchCash: (data: dto.PatchCashRequestDTO) => {
    return request<dto.PatchCashResponstDTO>({
      method: 'PATCH',
      url: `${BASE_URL}/asset/cash`,
      data,
    });
  },
};
