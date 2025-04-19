import { MeleeSet } from "./MeleeSet.js";
import { IRankFetcher } from "./RankFetcher.js";

export class UserFiller {
    public static async FillElos(sets: MeleeSet[], fetcher: IRankFetcher): Promise<void> {
        let usersToElos = new Map<string, number>();
        for (var set of sets) {
            usersToElos.set(set.player1, 0);
            usersToElos.set(set.player2, 0);
        }
        
        //now it's a unique list, fill it with elos,
        for (var key of usersToElos.keys()) {
            usersToElos.set(key, await fetcher.fetchEloForPlayer(key));
        }

        for (var set of sets) {
            set.player1Elo = usersToElos.get(set.player1);
            set.player2Elo = usersToElos.get(set.player2);
        }
    }
}