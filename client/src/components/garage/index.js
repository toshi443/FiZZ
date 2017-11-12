// Garageとはユーザーのマイページのこと
// このページでは、Botの登録（削除・修正（未実装））、Botの練習、対戦履歴の確認、通知の確認（未実装）のほか、
// 一般的なマイページ機能を提供する

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Modal from '../utils/Modal';

export default class Garage extends Component {

  // static propTypes = {
  //   bots: PropTypes.object.isRequired,
  //   onStandBot: PropTypes.func.isRequired,
  //   onRegisterBot: PropTypes.func.isRequired,
  //   onSetup: PropTypes.func.isRequired
  // }

  constructor() {
    super();

    this.state = {
      addNewModal: false,
      detailModal: false,
      practiceModal: false
    };

    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  componentWillMount(){
    this.props.onSetup();
  }

  openModal(modalName) {
    this.setState({[modalName]: true});
  }
  closeModal(modalName) {
    this.setState({[modalName]: false});
  }

  renderModals() {
    return(
      <div>
        <Modal
          isOpen={this.state.addNewModal}
          onRequestClose={() => this.closeModal("addNewModal")}
        >
          <div className="modal-header">
            <h3>Add your bot</h3>
            <p>Botを登録しましょう</p>
          </div>
          <div className="modal-content">
            <form>
              <label for="botName">Bot name:</label>
              <input className="u-full-width" type="text" placeholder="bot name" id="botName"/>
              <label for="repositoryUrl">Repository URL:</label>
              <input className="u-full-width" type="text" placeholder="repository url" id="repositoryUrl"/>
              <label for="botComment">Comment:</label>
              <textarea className="u-full-width" placeholder="このBotの説明" id="botComment"></textarea>
              <input className="button-primary" type="submit" value="Submit"/>
            </form>
          </div>
        </Modal>
        <Modal
          isOpen={this.state.detailModal}
          onRequestClose={() => this.closeModal("detailModal")}
        >
          <h3>Bot's details</h3>
        </Modal>
        <Modal
          isOpen={this.state.practiceModal}
          onRequestClose={() => this.closeModal("practiceModal")}
        >
          <h3>Practice bot</h3>
        </Modal>
      </div>
    )
  }

  render() {
    return(
      <div className="garage">
        {this.renderModals()}
        <div className="contents-body">
          <div className="container">
            <div className="row margin-top-25">
              <h1 className="page-title">Garage</h1>
              <div className="page-menu">
                <ul>
                  <li><Link to="/garage">Garage</Link></li>
                  <li><Link to="/match">Match</Link></li>
                  <li><Link to="/docs">Docs</Link></li>
                </ul>
              </div>
            </div>
            <div className="row margin-top-25">
              {/* Bots一覧及びアクション群 */}
              <div className="twelve columns">
                <div className="panel">
                  <div className="panel-heading">
                    <h3>Your Bots</h3>
                  </div>
                  <div className="margin-top-15">
                    <button className="button-primary" onClick={() => this.openModal("addNewModal")}>Add New</button>
                  </div>
                  <div className="table">
                    <table className="u-full-width">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Status</th>
                          <th>Game</th>
                          <th>%</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>Bot1</td>
                          <td>NotQualified</td>
                          <td>Reversi</td>
                          <td>30%</td>
                          <td>
                            <button className="button detail-button margin-top-5" onClick={() => this.openModal("detailModal")}>Detail</button> <button className="practice-button margin-top-5" onClick={() => this.openModal("practiceModal")}>Practice</button>
                          </td>
                        </tr>
                        <tr>
                          <td>Bot2</td>
                          <td>NotQualified</td>
                          <td>Reversi</td>
                          <td>30%</td>
                          <td>
                            <button className="button detail-button margin-top-5" onClick={() => this.openModal("detailModal")}>Detail</button> <button className="practice-button margin-top-5" onClick={() => this.openModal("practiceModal")}>Practice</button>
                          </td>
                        </tr>
                        <tr>
                          <td>Bot3</td>
                          <td>NotQualified</td>
                          <td>Reversi</td>
                          <td>30%</td>
                          <td>
                            <button className="button detail-button margin-top-5" onClick={() => this.openModal("detailModal")}>Detail</button> <button className="practice-button margin-top-5" onClick={() => this.openModal("practiceModal")}>Practice</button>
                          </td>
                        </tr>
                        <tr>
                          <td>Bot4</td>
                          <td>NotQualified</td>
                          <td>Reversi</td>
                          <td>30%</td>
                          <td>
                            <button className="button detail-button margin-top-5" onClick={() => this.openModal("detailModal")}>Detail</button> <button className="practice-button margin-top-5" onClick={() => this.openModal("practiceModal")}>Practice</button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
