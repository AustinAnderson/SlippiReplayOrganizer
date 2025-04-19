import fetch from 'node-fetch';
import { HttpException } from './HttpFetchException.js';
import { UserRankResponseSchema } from './UserRankResponse.js';
export interface IRankFetcher {
    fetchEloForPlayer(playerTag: string): Promise<number>;
}
export class MockRankFetcher implements IRankFetcher {
    async fetchEloForPlayer(playerTag: string): Promise<number> {
        return Math.floor(Math.random() * (1100 - 750) + 750);
    }
}
export class RankFetcher implements IRankFetcher { 
    private static readonly GraphQlQueryTemplate: string = '{"variables":{"cc":"@USER@"},"query":"query GetCurrentElo($cc: String!) {getConnectCode(code: $cc) {user {rankedNetplayProfile {ratingOrdinal}}}}"}'
    constructor(private readonly graphqlEndpoint: string) { }

    async fetchEloForPlayer(playerTag: string): Promise<number> {
        const response = await fetch(
            this.graphqlEndpoint,
            {
                method: 'POST',
                body: RankFetcher.GraphQlQueryTemplate.replace("@USER@", playerTag),
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json'
                }
            }
        );

        let content = "";
        try {
            content = await response.text();
        }
        catch (e) {
            throw new HttpException(`fetching user data failed while reading content of ${response.status} response`, e, response.status);
        }
        if (response.status != 200) {
            throw new HttpException(`fetching user data failed: ${content}`, undefined, response.status);
        }
        var result = await UserRankResponseSchema.parseAsync(content);
        return result.data.getConnectCode.user.rankedNetplayProfile.ratingOrdinal;
    }
}