export interface SpecializationsResponse {
    items: Specialization[];
    meta: Meta;
}

export interface Specialization {
    id: number;
    name: string;
    description: string;
    professions: Profession[];
}

export interface Meta {
    total: number;
    page: number;
    limit: number;
}

export interface Profession {
    id: number;
    name: string;
    description: string;
}