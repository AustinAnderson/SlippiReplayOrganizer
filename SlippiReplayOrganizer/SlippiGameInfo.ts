/*
import { SlippiGame, characters, stages } from "@slippi/slippi-js";
/*/
import * as slippi from "@slippi/slippi-js";
//const slippi = require("@slippi/slippi-js");
const SlippiGame = slippi.SlippiGame;
const characters = slippi.characters;
const stages = slippi.stages;
//*/


export class SlippiGameInfo {
    public readonly player1: string;
    public readonly player1Char: string;
    public readonly player2: string;
    public readonly player2Char: string;
    public readonly stage: string;
    public readonly p1Victory: boolean;
    public readonly noContest: boolean;
    public readonly originalFilePath: string;
    public readonly startedAt: Date;
    public sameCombatantsIgnoreOrder(game2: SlippiGameInfo): boolean {
        return (this.player1 == game2.player1 && this.player2 == game2.player2)
            || (this.player1 == game2.player2 && this.player2 == game2.player1);
    }
    public DisplayStr(): string {
        const p1 = 0, p2 = 1;
        let v = [['', ''], ['<', '>']];
        if (this.noContest) v[p2] = v[p1];
        else if (this.p1Victory) [v[p1], v[p2]] = [v[p2], v[p1]];
        let player1Line = `${v[p1][0]}${this.player1}(${this.player1Char})${v[p1][1]}`;
        let player2Line = `${v[p2][0]}${this.player2}(${this.player2Char})${v[p2][1]}`;
        //<RTLT#1232(Peach)>_Vs_FIZI#2323(Doc)_(BattleField).slp
        return `${player1Line}_Vs_${player2Line}_(${this.stage})`;
    }
    public constructor(filePath: string) {
        let game = new SlippiGame(filePath);
        let w = game.getWinners();
        let settings = game.getSettings();
        this.startedAt = new Date(Date.parse(game.getMetadata().startAt));
        this.originalFilePath = filePath;
        this.stage = stages.getStageName(settings.stageId);
        this.player1 = settings.players[0].connectCode;
        this.player1Char = characters.getCharacterShortName(settings.players[0].characterId);
        this.player2 = settings.players[1].connectCode;
        this.player2Char = characters.getCharacterShortName(settings.players[1].characterId);
        this.noContest = true;
        if (w.length == 1) {
            this.noContest = false;
            this.p1Victory = w[0].playerIndex == 0;
        }
    }
}