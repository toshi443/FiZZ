package reversi

import (
	"net/http"
	"app/game/reversi"
  "github.com/labstack/echo"
	"app/models"
	"log"
	"fmt"
)

type Request struct {
	Bots []models.Bot `json:"bots" form:"bots"`
	Config models.GameConfig `json:"config" form:"config"`
}

func Play(c echo.Context) (err error){
	req := new(Request)
	if err = c.Bind(req); err != nil {
		return
	}
	log.Println(req)
	return c.JSON(http.StatusOK, play(&req.Config, req.Bots))
}

func play(config *models.GameConfig, bots []models.Bot) *models.Result{
	response, _ := reversi.GameMaster(config, bots)
	if err := response.SaveAsResultToDB(); err != nil {
		return response.GetErrorResult("SAVE_RESULT_TO_DB", fmt.Sprint(err))
	}
	return response.GetResult()
}
