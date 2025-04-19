export class EloRankMap {
    private static readonly map = [
        { r: [-1, 0], str: "Un" },
        { r: [1, 766], str: "B1" },
        { r: [766, 914], str: "B2" },
        { r: [914, 1055], str: "B3" },
        { r: [1055, 1189], str: "S1" },
        { r: [1189, 1316], str: "S2" },
        { r: [1316, 1436], str: "S3" },
        { r: [1436, 1549], str: "G1" },
        { r: [1549, 1654], str: "G2" },
        { r: [1654, 1752], str: "G3" },
        { r: [1752, 1843], str: "P1" },
        { r: [1843, 1928], str: "P2" },
        { r: [1928, 2004], str: "P3" },
        { r: [2004, 2074], str: "D1" },
        { r: [2074, 2137], str: "D2" },
        { r: [2137, 2192], str: "D3" },
        { r: [2192, 2275], str: "M1" },
        { r: [2275, 2350], str: "M2" },
        { r: [2350, 2351], str: "M3" },
        { r: [2351, 5000], str: "GM" }
    ];
    public static getLabelForRank(elo: number) {
        let filtered = this.map.filter(x => x.r[0] > elo && x.r[1] <= elo);
        if (filtered.length < 1) {
            //logger.warn(`got elo outside or range '${elo}'`);
            return "??";
        }
        return filtered[0].str;
    }
}