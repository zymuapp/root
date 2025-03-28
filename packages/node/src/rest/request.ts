import axios, { type Options, type Response } from "redaxios";

import type { APIResponse, ErroredAPIResponse } from ".";
import { isBrowser } from "../utils/is-browser";

const instance = axios.create({
	headers: {
		"Content-Type": "application/json",
		Accept: "application/json",
		...(!isBrowser && { "User-Agent": "zymu-api-client" }),
	},
	responseType: "json",
	transformRequest: [
		(data, headers) => {
			if (data instanceof FormData) {
				if (
					headers &&
					typeof headers === "object" &&
					"Content-Type" in headers
				) {
					// biome-ignore lint/performance/noDelete: the content-type must be deleted to allow the browser to set it
					delete headers["Content-Type"];
				}
				return data;
			}

			if (headers) {
				(
					headers as {
						[name: string]: string;
					}
				)["Content-Type"] = "application/json";
			}
			return JSON.stringify(data);
		},
	],
	withCredentials: isBrowser,
});

export interface APIRequestOptions extends Options {}

export const request = async <T>(url: string, options?: Options) => {
	const response = instance<APIResponse<T>>(url, { ...options })
		.then((response) => response)
		.catch((error: Response<ErroredAPIResponse>) => {
			if (!error.data) {
				console.error(error);
			}
			throw error.data;
		});

	return response;
};
