import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ModalContainer from '../utils/Modal';
import Spinner from 'react-spinkit';

import {
  Map as IMap, List as IList
} from 'immutable';


export default class BotsList extends Component {
  static propTypes = {
    bots: PropTypes.object.isRequired,
  }
  constructor() {
    super();
    this.state = {
      botModal: false,
      checkModal: false,
      editModal: false,
      itemModaled: {
        id: "",
        name: "",
        isQualified: "",
        isValid: "",
        rank: "",
        isPrivate: "",
        gameName: "",
        createdAt: "",
        updatedAt: ""
      },
      itemEdited: {
        id: "",
        name: "",
        isPrivate: ""
      },
      isEditing: false
    };
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.toggleEdit = this.toggleEdit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.editBot = this.editBot.bind(this);
  }

  formatStatus(item) {
    if(IMap.isMap(item)) {
      if(item.get("isStandBy")) {
        return "is standby";
      } else if(item.get("isQualified")) {
        return "is qualified";
      } else if(item.get("isValid")){
        return "is valid";
      } else {
        return "is not valid"
      }
    } else {
      if(item.isStandBy) {
        return "is standby"
      } else if(item.isQualified) {
        return "is qualified";
      } else if(item.isValid) {
        return "is valid";
      } else {
        return "is not valid";
      }
    }
  }

  handleChange(event) {
    this.setState({
      itemEdited: {
        [event.target.name]: event.target.value
      }
    });
  }

  editBot() {
    let item = this.state.itemEdited;
    this.props.onBotEdited(item);
  }

  openModal(modalName, item) {
    this.setState({
      [modalName]: true,
      itemModaled: {
        id: item.get("id"),
        name: item.get("name"),
        isStandBy: item.get("isValid"),
        isQualified: item.get("isQualified"),
        isValid: item.get("isValid"),
        rank: item.get("rank"),
        isPrivate: item.get("isPrivate"),
        gameName: item.get("gameName"),
        createdAt: item.get("createdAt"),
        updatedAt: item.get("updatedAt")
      }
    })
  }

  toggleEdit() {
    const {isEditing, itemModaled} = this.state;
    if(!isEditing) {
      this.setState({
        itemEdited: {
          id: itemModaled.id,
          name: itemModaled.name,
          isPrivate: itemModaled.isPrivate
        },
      })
    };
    this.setState({
      isEditing: !isEditing
    })
  }

  closeModal(modalName) {
    this.setState({[modalName]: false});
  }

  renderCheckModalContent(item) {
    const { isQualified, isValid } = item;
    if(isQualified) {
      return(
        <p>This bot is qualified.</p>
      )
    } else if(isValid) {
      return(
        <p>This bot is valid but not qualified.</p>
      )
    } else {
      return(
        <p>This bot is not valid.</p>
      )
    }
  }

  renderCheckModal() {
    const checkModal = this.state.checkModal;
    const item = this.state.itemModaled;
    let status = this.formatStatus(item);
    return(
      <ModalContainer
        isOpen={checkModal}
        onRequestClose={() => this.closeModal("practiceModal")}
        title="Check this bot's code status."
        description=""
      >
        {this.renderCheckModalContent(item)}
        <p>Your bot status {status}.</p>
        <p>Please check your code.</p>
        <button onClick={(item) => this.props.onPracticeBot(item.botId)} className="button-primary">Check code validity</button>
        <hr/>
        <p>Your bot status is not qualified.</p>
        <p>Please practice and get qualification.</p>
        <button onClick={(item) => this.props.onPracticeBot(item.botId)} className="button-primary">Check bot quality</button>
      </ModalContainer>
    )
  }

  renderBotModal() {
    const { botModal, itemModaled, itemEdited, isEditing } = this.state;
    return(
      <ModalContainer
        isOpen={botModal}
        onRequestClose={() => this.closeModal("botModal")}
        title="Bot's detail"
        description="Botの情報。名前やURLを修正できます。"
      >
        <table className="u-full-width">
          <tbody>
            <tr>
              <th>Name</th>
              <td>{isEditing ?
                <input name="name" type="text" value={itemEdited.name} onChange={this.handleChange}/>
                : itemModaled.name}
              </td>
            </tr>
            <tr>
              <th>isPrivate</th>
              <td>{itemModaled.isPrivate ? "Private" : "Public"}</td>
            </tr>
            <tr>
              <th>GameName</th>
              <td>{itemModaled.gameName}</td>
            </tr>
            <tr>
              <th>Status</th>
              <td>{this.formatStatus(itemModaled)}</td>
            </tr>
            <tr>
              <th>Rank</th>
              <td>{itemModaled.rank}</td>
            </tr>

            <tr>
              <th>createdAt</th>
              <td>{itemModaled.createdAt}</td>
            </tr>
            <tr>
              <th>updatedAt</th>
              <td>{itemModaled.updatedAt}</td>
            </tr>
          </tbody>
        </table>
        {isEditing ?
          <div>
            <button className="button-primary" onClick={this.editBot}>Save</button>
            <button className="button-primary" onClick={this.toggleEdit}>Cansel</button>
          </div>
          : <button className="button-primary" onClick={this.toggleEdit}>Edit</button>
        }

      </ModalContainer>
    )
  }

  render() {
    const { bots, botsLoading } = this.props;
    return(
      <div className="table">
        {this.renderBotModal()}
        {this.renderCheckModal()}
        <table className="u-full-width">
          <thead>
            <tr>
              <th>Name</th>
              <th>Status</th>
              <th>Game</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {botsLoading ? <tr><td>Data is loading now....</td></tr> : null}
            {bots.map((i) => {
              let status = this.formatStatus(i);
              return(
                <tr key={i.get("botCode")}>
                  <td>{i.get("name")}</td>
                  <td>{status}</td>
                  <td>{i.get("gameName")}</td>
                  <td>
                    <button className="button detail-button margin-top-5" onClick={(e) => this.openModal("botModal", i)}>Detail</button> <button className="practice-button margin-top-5" onClick={(e) => this.openModal("checkModal", i)}>CodeCheck</button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    )
  }
}
