import axios from "axios";


export function getAPIErrorMessage(err:unknown) {
    if (!axios.isAxiosError(err)) return "Unexpected Error";

    if (!err.response) {
        return "CAnnot reach server";
    }

    const status = err.response.status;

    const data = err.response.data as any;
    const detail =
        typeof data == "string"
        ? data
        : data?.detail || data?.message || null;

    if (status === 400) return detail ?? "Bad Request.";
    if (status === 401) return "Invalid Credentials.";
    if (status === 403) return "Not Allowed.";
    if (status === 404) return "Not Found.";
    if (status === 422) return "Unprocessable Content";
    if (status === 500) return "Server Error (500)!.";

    return detail ?? `Request failed with status: ${status}`;
}