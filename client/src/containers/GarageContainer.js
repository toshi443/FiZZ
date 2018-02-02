import React, {Component} from 'react';
import {PropTypes} from 'prop-types';
import Garage from '../components/garage'
import {connect} from 'react-redux';

import {
  scanBots,
  createBot,
  standBot,
  updateBot,
  deleteBot,
} from '../actions/botsAction';

import {
  runCodeCheck
} from '../actions/gamesAction';

import {
  scanResults,
  getResult
} from '../actions/matchesAction';

const mapStateToProps = (state) => {
  return {
    bots: state.getIn(['bots', 'items']),
    botsLoading: state.getIn(['bots', 'isLoading']),
    createCompleted: state.getIn(['bots', 'createCompleted']),
    results: state.getIn(['matches', 'results']),
    resultsLoading: state.getIn(['matches', 'isLoading']),
    participants: state.getIn(['matches', 'participants']),
  }
}

const mapDispatchToProps = (dispatch) => ({
    onSetup: () => {
      dispatch(scanBots());
      dispatch(scanResults());
    },
    onCreateBot: (bot) => {
      dispatch(createBot(bot))
    },
    onPracticeBot: (botId) => {
      dispatch(runPractice(botId))
    },
    onBotEdited: (bot) => {
      dispatch(editBot(bot))
    },
    onStandBot: (botId) => {
      dispatch(standBot(botId))
    },
    onGetResult: (resultId, gameName, botId) => {
      dispatch(getResult(resultId, gameName, botId))
    },
    onRequestCodeCheck: (bot) => {
      dispatch(runCodeCheck(bot))
    },
    onRequestUpdateBot: (bot) => {
      dispatch(updateBot(bot))
    },
    onRequestDeleteBot: (botId) => {
      dispatch(deleteBot(botId))
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(Garage)
