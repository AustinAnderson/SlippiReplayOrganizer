import { MeleeSet } from "./MeleeSet.js";
import { SlippiGameInfo } from "./SlippiGameInfo.js"
export class SetBuilder {
    public constructor() { }
    private current: SlippiGameInfo[];
    public visitGame(game: SlippiGameInfo): MeleeSet | undefined {
        if (this.current.length == 0) {
            this.current.push(game);
            return undefined;
        }
        const last = this.current[this.current.length - 1];
        if (last.sameCombatantsIgnoreOrder(game)) {
            this.current.push(game);
            return undefined;
        }
        let res = new MeleeSet(this.current);
        this.current = [game];
        return res;
    }
    public flush(): MeleeSet {
        return new MeleeSet(this.current);
    }
}