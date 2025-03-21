import { request } from "../request";
import { config } from "../../config/config";
import {
	MemberConnectedResponseDTO,
	MemberWishResponseDTO,
	MemberInfoResponseDTO,
} from "../dto/Member";

const BASE_URL = config.apiUrl;

export const memberService = {
	getMemberConnected: () => {
		return request<MemberConnectedResponseDTO>({
			method: "GET",
			url: `${BASE_URL}/member/connected`,
		});
	},
	getMemberWish: () => {
		return request<MemberWishResponseDTO>({
			method: "GET",
			url: `${BASE_URL}/member/wish`,
		});
	},
	patchMemberWish: (total:string) => {
		return request<MemberWishResponseDTO>({
			method: "PATCH",
			url: `${BASE_URL}/member/wish`,
			params: {wishFund:total}
		});
	},
	getMemberInfo: (config?: { headers: { Authorization: string } }) => {
		return request<MemberInfoResponseDTO>({
			method: "GET",
			url: `member/me`,
			headers: config?.headers,
		});
	},
	deleteAccount: (config?: { headers: { Authorization: string } }) => {
		return request<void>({
			method: "POST",
			url: `/auth/unsubscribe`,
			headers: config?.headers,
		});
	},
};
