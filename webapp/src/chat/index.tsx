import React, { Component, PureComponent } from "react";
import "../App.css";
import { avatars } from "../App"

interface Props {
  messages: TMessage[]
}
interface State {
  messages: TMessage[]
}
interface TMessage {
  message: string,
  time: string,
  avatar: string,
  uid: string,
};
class Chat extends PureComponent<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      messages: []
    }
  }
  componentDidUpdate() {
    this.setState({ messages: this.props.messages })
    const chatMessages = document.querySelector('.chat-messages');
    chatMessages!.scrollTop = chatMessages!.scrollHeight;
  }
  componentDidMount() {
    this.setState({ messages: this.props.messages })
  }
  render() {
    return <div className="chat-messages">
      {this.state.messages.map((item: TMessage, index) => (
        <div className="message-container">
          <div className="avatar">
            <i className={`fas ${avatars[item.avatar].name} fa-2x`}
              style={{ color: avatars[item.avatar].color }}></i> </div>
          <div className="message">{item.message}</div>
        </div>
      ))}
    </div>
  }
}

export default Chat;