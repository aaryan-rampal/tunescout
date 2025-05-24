/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Generic Pydantic model used throughout the API to represent a track.
 *
 * Args:
 * BaseModel: Pydantic model.
 */
export type Track = {
    name: string;
    artists: Array<string>;
    uri: string;
    image_url: string;
    id: string;
    similarity?: number;
    runtime?: number;
};

