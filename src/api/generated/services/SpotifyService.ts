/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreatePlaylistRequest } from '../models/CreatePlaylistRequest';
import type { GeneratePlaylistRequest } from '../models/GeneratePlaylistRequest';
import type { Track } from '../models/Track';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class SpotifyService {
    /**
     * Get Playlists
     * @param authorization
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getPlaylistsSpotifyGetPlaylistsPost(
        authorization: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/spotify/get_playlists',
            headers: {
                'authorization': authorization,
            },
            errors: {
                404: `Not found`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * Generate Playlist
     * @param authorization
     * @param requestBody
     * @returns Track Successful Response
     * @throws ApiError
     */
    public static generatePlaylistSpotifyGeneratePlaylistPost(
        authorization: string,
        requestBody: GeneratePlaylistRequest,
    ): CancelablePromise<Array<Track>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/spotify/generate_playlist',
            headers: {
                'authorization': authorization,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                404: `Not found`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * Create Playlist
     * @param authorization
     * @param requestBody
     * @returns any Successful Response
     * @throws ApiError
     */
    public static createPlaylistSpotifyCreatePlaylistPost(
        authorization: string,
        requestBody: CreatePlaylistRequest,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/spotify/create_playlist',
            headers: {
                'authorization': authorization,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                404: `Not found`,
                422: `Validation Error`,
            },
        });
    }
}
