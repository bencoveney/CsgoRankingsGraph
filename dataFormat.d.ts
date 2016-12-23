type DataFormat = {
  rankings: {
    link: string,
    date: string | Date,
    ranks: {
      position: number,
      team: string,
      points: number,
      link: string,
      players: {
        player: string,
        link: string,
        nationality: string
      }[]
    }[]
  }[],
  teams: {
    name: string,
    color: string,
    safeTeamName: string,
    ranks?: number[]
  }[],
  players: {
    teams?: string[]
  }
}