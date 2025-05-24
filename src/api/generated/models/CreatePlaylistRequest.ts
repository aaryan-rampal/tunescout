/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Track } from './Track';
/**
 * Pydantic model used for spotify_router.create_playlist().
 *
 * Args:
 * BaseModel: Pydantic model.
 */
export type CreatePlaylistRequest = {
    tracks: Array<Track>;
    name: string;
};

