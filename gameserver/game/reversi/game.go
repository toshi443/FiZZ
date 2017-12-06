package Reversi

import (
  ai "app/game"
  "encoding/json"
  "log"
  "strconv"
)

/*
	status
	-1 : error
	0: game is not finished
	1: Win
	2: Lose
	3: draw
*/

func Game(config *GameConfig, containers []ai.Container, firstMover int) *Fight{
  initBoard()

  fight := &Fight{}
  for i:=0; i<len(containers); i++ {
    f := &FightSummary{
        BotCode: containers[i].BotCode,
        Team: getTeam(i, firstMover),
    }
    fight.Summaries = append(fight.Summaries, *f)
  }

  //fightにログを追加する
  //勝ち負け判定
  context := &Context{}
  for {
    movablePos := getMovablePos()

    if len(movablePos) == 0 {
      if isGameOver() {
        break
      }
      pass()
      continue
    }

    bot := containers[(turns + firstMover)%2]

    //contextの更新
    b := adaptBoard()
    context.Board = b
    context.Team = getTeam((turns + firstMover)%2, firstMover)
    context.History = append(context.History, b)

    cxt, _ := json.Marshal(context)
    resp, err := bot.Play(string(cxt))

    action := resp["action"].(map[string]string)

    if err != nil {
      log.Fatal(err)
      configureFight(fight, firstMover, "ERROR occurred with "+bot.BotCode)
      fight.Winner = containers[(turns + firstMover + 1)%2].BotCode
      return fight
    }

    actionLog := &ActionLog{
      BotCode: bot.BotCode,
      Team: context.Team,
      Params: map[string]string {
                        "turn": string(turns),
                        "x":action["x"],
                        "y":action["y"],
                      },
      ActionCode: action["code"],
    }
    fight.Logs = append(fight.Logs, *actionLog)

    var point Point
    point.x, _ = strconv.Atoi(action["x"])
    point.y, _ = strconv.Atoi(action["y"])
    point.color, _ = strconv.Atoi(context.Team)

    point.x++
    point.y++

    if !move(point) {
      break
    }
  }
  //fightの設定をおこなって返却
  configureFight(fight, firstMover, "The game was finished successfully.")
  return fight
}

func configureFight(fight *Fight, firstMover int, msg string){
  var winner string
  var max float32 = 0.0
  for i:=0; i<len(fight.Summaries); i++{
    s := fight.Summaries[i]
    te, _ := strconv.Atoi(s.Team)
    s.PointPercentage = float32(countColor(te)/(BOARD_SIZE*BOARD_SIZE))
    if max < s.PointPercentage {
      winner = s.BotCode
      max = s.PointPercentage
    }
  }
  fight.Messages = msg
  fight.Winner = winner
}

func getTeam(index, firstMover int) string {
  if index%2 == firstMover%2{
    return string(BLACK)
  }else{
    return string(WHITE)
  }
}

func adaptBoard() [8][8]int{
  var ret [8][8]int
  for x:=1;x<=BOARD_SIZE;x++{
    for y:=1;y<=BOARD_SIZE;y++{
      ret[x-1][y-1] = board[x][y]
    }
  }
  return ret
}
