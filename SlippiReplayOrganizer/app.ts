import { MockRankFetcher, RankFetcher } from "./RankFetcher.js";
import { SlippiGameInfo } from "./SlippiGameInfo.js";
import { MeleeSet } from "./MeleeSet.js";
import { SetBuilder } from "./SetBuilder.js";
import { UserFiller } from "./UserFiller.js";
import * as fs from 'fs';
import * as paths from 'path';

(async () => {
    try {
        let slippiReplayFolder = "C:\\Users\\Austi\\Documents\\Slippi\\";
        let games = await getGames(slippiReplayFolder);
        games.sort((x, y) => x.startedAt.getMilliseconds() - y.startedAt.getMilliseconds());
        let builder = new SetBuilder();
        let sets: MeleeSet[] = [];
        for (var game of games) {
            let next = builder.visitGame(game);
            if (next !== undefined)
            {
                sets.push(next);
            }
        }
        sets.push(builder.flush());
        //let fetcher = new RankFetcher("graphqlEndpoint");
        let fetcher = new MockRankFetcher();
        UserFiller.FillElos(sets, fetcher);
        await moveFiles(sets, slippiReplayFolder);
    }
    catch (e) {
        //logger.error(e);
        console.log(e);
    }
})();
async function getGames(slippiReplayFolderPath: string): Promise<SlippiGameInfo[]> {
    let files: string[] = [];
    await recursiveReadDir(slippiReplayFolderPath, files);
    return files.map(x => new SlippiGameInfo(x));
}
//fs.promise.readDir(path, {recursive: true}) apparently doesn't exist yet in ts? idk didn't compile,
//so combine with filter logic
async function recursiveReadDir(folderPath: string, fileList: string[])
{
    for (let path of await fs.promises.readdir(folderPath)) {
        if (path.endsWith(".slp")) {
            fileList.push(path);
        }
        else {
            let statted = await fs.promises.stat(path);
            //regex to ignore folders that are already processed
            if (statted.isDirectory && !MeleeSet.FormatStr.test(path)) {
                await recursiveReadDir(path, fileList);
            }
        }
    }
}
async function moveFiles(data: MeleeSet[], slippiReplayFolderPath: string) {

    for (var set of data) {
        let dateFolder = paths.dirname(set.games[0].originalFilePath);
        let setFolder = paths.join(dateFolder, set.DisplayStr);
        await fs.promises.mkdir(setFolder);
        for (var game of set.games) {
            await fs.promises.rename(game.originalFilePath, paths.join(setFolder,game.DisplayStr+".slp"));
        }
    }
}
