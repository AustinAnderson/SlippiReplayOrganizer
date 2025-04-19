import { EloRankMap } from "./EloRankMap.js";
import { SlippiGameInfo } from "./SlippiGameInfo.js"
export class MeleeSet {
    public get P1Victory(): boolean {
        return this.results[0] > this.results[1];
    }
    public get DisplayStr(): string {
        let p1VOpen = '';
        let p1VClose = '';
        let p2VOpen = '<';
        let p2VClose = '>';
        if (this.P1Victory) {
            p2VOpen = '';
            p2VClose = '';
            p1VOpen = '<';
            p1VClose = '>';
        }
        let p1Rank = EloRankMap.getLabelForRank(this.player1Elo);
        let p2Rank = EloRankMap.getLabelForRank(this.player2Elo);
        let resStr = `${this.results[0]}-${this.results[1]}`;
        //<RTLT#1234(B2)>_Vs_FIZI#2983(Un)_(2-1)
        return `${p1VOpen}${this.player1}(${p1Rank})${p1VClose}_Vs_${p2VOpen}${this.player2}(${p2Rank})${p2VClose}_(${resStr})`;
    }
    public static readonly FormatStr: RegExp = /<?[^#]+#[0-9]+\(..\)>?_Vs_<?[^#]+#[0-9]+\(..\)>?_\([0-9]+-[0-9]+\)/
    public readonly player1: string;
    public readonly player2: string;
    public player1Elo: number;
    public player2Elo: number;
    private results: [number, number];
    public constructor(public readonly games: SlippiGameInfo[])
    {
        this.player1 = this.games[0].player1;
        this.player2 = this.games[0].player2;
        if (this.player1.localeCompare(this.player2) < 0) {
            this.player1 = this.player2;
            this.player2 = this.games[0].player1;
        }
        this.results = [0, 0];
        for (var game of this.games) {
            if (game.noContest) continue;
            let winnerNdx = 0;
            //either players match up after alphabetizing so winnerNdx should be p2's if not p1's win (ndx=1), or p1's win(0) or
            //not the same after alphabetizing players, only 2 so swapped, so our p1==this game's p2, and p2's win if game.p1Victory
            if ((game.player1 == this.player1 && !game.p1Victory) || game.p1Victory) {
                winnerNdx = 1;
            }
            this.results[winnerNdx]++;
        }

    }

}