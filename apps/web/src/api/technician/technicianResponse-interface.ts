import { Meta, Technicians } from "@/types";

export interface GetTechniciansResponse {
    items: Technicians[];
    meta: Meta;
}