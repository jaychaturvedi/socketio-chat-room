import InputBase from '@material-ui/core/InputBase';
import React, { PureComponent } from "react";
import io from "socket.io-client"
import "./App.css";
import Chat from "./chat"
const socket = io.connect("http://localhost:5000");

interface State {
  room: TRoom,
  socketID: string | null,
  text: string | null,
  selectedAvatar: string,
}
interface TRoom {
  owner: string | null;
  ownerAvatar: string | null;
  messages: TMessage[];
}
interface TMessage {
  message: string,
  time: string,
  avatar: string,
  uid: string,
};

class App extends PureComponent<{}, State> {
  constructor(props: any) {
    super(props)
    this.state = {
      room: {
        owner: null,
        ownerAvatar: null,
        messages: []
      } as TRoom,
      socketID: null,
      text: "",
      selectedAvatar: ""
    }
  }

  onMessage = (message: TMessage) => {
    const room = this.state.room
    this.setState({
      room: {
        owner: room.owner,
        ownerAvatar: room.ownerAvatar,
        messages: [...room.messages, message]
      }
    })
  }

  onOwnerChange = (owner: string | null, ownerAvatar: string | null) => {
    const room = this.state.room
    this.setState({
      room: {
        owner: owner,
        ownerAvatar: ownerAvatar,
        messages: room.messages
      }
    })
  }

  componentDidMount() {
    socket.on("onGetRoom", (room: TRoom) => {
      console.log("socketID", socket.id, room);
      this.setState({ room: room, socketID: socket.id })
    })
    socket.on("onOwnerChange", (room: { owner: string | null, ownerAvatar: string | null }) => {
      console.log(room);
      if (room !== null)
        this.onOwnerChange(room.owner, room.ownerAvatar)
    })
    socket.on("onMessage", (message: TMessage) => {
      console.log(message)
      this.onMessage(message)
    })
    socket.emit("getRoom")
  }

  onTypingMessage = (e: any) => {
    e.preventDefault()
    this.setState({
      text: e.target.value
    })
  }

  onSendingMessage = (e: any) => {
    if (this.state.text?.length) {
      socket.emit("sendMessage", this.state.text)
      this.setState({ text: "" })
    }
  }

  setAvatar = (avatar: string) => {
    socket.emit("claimRoom", avatar)
    if (this.state.socketID === this.state.room.owner) {
      this.setState({ selectedAvatar: avatar })
    }
    else {
      this.setState({ selectedAvatar: "" })
    }
  }

  getComputedAvatarColor = (key: string) => {
    if ((this.state.socketID === this.state.room.owner
      && this.state.room.ownerAvatar === key)
      || !this.state.room.owner) {
      return avatars[key].color
    }
    else {
      return "grey"
    }
  }

  render() {
    return (
      <div className="chat-container">
        <header className="chat-header">
          <h1>Chat</h1>
          <div className="avatar-container">
            {Object.keys(avatars).map((key: string) => {
              const color = this.getComputedAvatarColor(key)
              return <i className={`fas ${avatars[key].name} fa-2x`}
                onClick={() => this.setAvatar(key)}
                style={{ color: color, cursor: color === "grey" ? "none" : "pointer" }}
              ></i>
            })
            }
          </div>
        </header>
        <main className="chat-main">
          <Chat messages={this.state.room.messages} />
        </main>
        <div className="chat-form-container">
          <div>
            <InputBase
              name="message"
              onChange={e => this.onTypingMessage(e)}
              value={this.state.text}
              id="outlined-multiline-static"
              placeholder="Type a message"
              autoComplete={"off"}
              required={true}
              disabled={(this.state.socketID !== this.state.room.owner)}
              style={{
                width: "100%",
                background: "white",
                color: "black"
              }} />
          </div>
          <button
            onClick={this.onSendingMessage}
            className="btn"
            disabled={(this.state.socketID !== this.state.room.owner)}>
            <i className="fas fa-paper-plane"></i>
            <span className="send-text">Send</span>
          </button>
        </div>
      </div>)
  }
}

export default App

export const avatars: { [id: string]: { name: string, color: string } } = {
  "0": {
    name: "fa-spider",
    color: "red"
  },
  "1": {
    name: "fa-cat",
    color: "#a832a4"
  },
  "2": {
    name: "fa-dragon",
    color: "orange"
  },
  "3": {
    name: "fa-kiwi-bird",
    color: "pink"
  },
  "4": {
    name: "fa-horse-head",
    color: "cyan"
  }
}