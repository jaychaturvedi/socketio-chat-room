export interface TRoom {
  owner: string | null;
  ownerAvatar: string | null;
  messages: TMessage[];
}

export interface TMessage {
  message: string,
  time: string,
  avatar: string,
  uid: string,
};


let room: TRoom = {
  owner: null,
  ownerAvatar: null,
  messages: []
}

function getRoom() {
  return room as TRoom
}
function onOwnerChange(owner: string, ownerAvatar: string) {
  if (!room.owner) {    
    room.owner = owner;
    room.ownerAvatar = ownerAvatar
  }
  return room
}

function onUserExit(uid: string) {
  if (uid === room.owner) {
    room.owner = null
    room.ownerAvatar = null
  }
  return room
}

function onMessage(message: string, uid: string) {
  if (room.owner === uid) {
    const payload: TMessage = {
      message :message,
      uid : uid,
      avatar: room.ownerAvatar,
      time: new Date().toISOString()
    }
    room.messages.push(payload)
  }
  return room
}

export { onOwnerChange, onMessage, onUserExit, getRoom }