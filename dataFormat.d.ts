type Rankings = {
  rankings: Ranking[],
  teams: Team[]
}

type Ranking = {
  link: string,
  date: string | Date,
  ranks: Rank[]
}

type Rank = {
  position: number,
  team: string,
  points: number,
  link: string,
  players: Player[]
}

type Player = {
  player: string,
  link: string,
  nationality: string
}

type Team = {
  name: string,
  color: string,
  safeTeamName: string,
  ranks?: number[]
}
