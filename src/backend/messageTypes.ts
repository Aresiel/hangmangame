import {Static, t} from 'elysia'

export const Ping = t.Object({
    type: t.Literal("PING")
})
export type Ping = Static<typeof Ping>

export const Echo = t.Object({
    type: t.Literal("ECHO"),
    message: t.String()
})
export type Echo = Static<typeof Echo>

export const CreateSession = t.Object({
    type: t.Literal("CREATE_SESSION"),
    max_guesses: t.Number(),
    host_name: t.String()
})
export type CreateSession = Static<typeof CreateSession>

export const JoinSession = t.Object({
    type: t.Literal("JOIN_SESSION"),
    session_id: t.String(),
    player_name: t.String()
})
export type JoinSession = Static<typeof JoinSession>

export const LeaveSession = t.Object({
    type: t.Literal("LEAVE_SESSION"),
    session_id: t.String(),
    player_id: t.String()
})
export type LeaveSession = Static<typeof LeaveSession>

export const SendMessage = t.Object({
    type: t.Literal("SEND_MESSAGE"),
    message: t.String(),
    player_id: t.String(),
    session_id: t.String()
})
export type SendMessage = Static<typeof SendMessage>

export const ClientMessage = t.Union([
    Ping,
    Echo,
    CreateSession,
    JoinSession,
    LeaveSession,
    SendMessage,
])
export type ClientMessage = Static<typeof ClientMessage>

export const Pong = t.Object({
    type: t.Literal("PONG")
})
export type Pong = Static<typeof Pong>

export const SessionCreated = t.Object({
    type: t.Literal("SESSION_CREATED"),
    session_id: t.String(),
    player_id: t.String()
})
export type SessionCreated = Static<typeof SessionCreated>

export const SessionJoined = t.Object({
    type: t.Literal("SESSION_JOINED"),
    session_id: t.String(),
    player_id: t.String()
})
export type SessionJoined = Static<typeof SessionJoined>

export const PlayerJoined = t.Object({
    type: t.Literal("PLAYER_JOINED"),
    player_name: t.String()
})
export type PlayerJoined = Static<typeof PlayerJoined>

export const PlayerLeft = t.Object({
    type: t.Literal("PLAYER_LEFT"),
    player_name: t.String()
})
export type PlayerLeft = Static<typeof PlayerLeft>

export const MessageSent = t.Object({
    type: t.Literal("MESSAGE_SENT"),
    message: t.String(),
    player_name: t.String()
})
export type MessageSent = Static<typeof MessageSent>

export const Error = t.Object({
    type: t.Literal("ERROR"),
    message: t.String()
})
export type Error = Static<typeof Error>

export const ServerMessage = t.Union([Pong,
    Echo,
    SessionCreated,
    SessionJoined,
    PlayerJoined,
    PlayerLeft,
    MessageSent,
    Error
])