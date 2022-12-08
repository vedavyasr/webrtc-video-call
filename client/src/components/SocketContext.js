import React, {
  createContext,
  useState,
  useRef,
  useEffect,
  useCallback,
} from "react";
import { io } from "socket.io-client";
import Peer from "simple-peer";

const SocketContext = createContext();

const socket = io("https://veda-video-call.herokuapp.com"); //in local http://localhost:5000

const ContextProvider = ({ children }) => {
  const [stream, setStream] = useState(null);
  const [me, setMe] = useState("");
  const [call, setCall] = useState({});
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [name, setName] = useState("");

  const myVideo = useRef();
  const userVideo = useRef();
  const connectionRef = useRef();

  useEffect(() => {
    async function getStream() {
      const st = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setStream(st);
      // myVideo.current.srcObject = st;
    }
    getStream();
    socket.on("me", (id) => setMe(id));

    socket.on("calluser", ({ from, name: callerName, signal }) => {
      setCall({ isReceivedCall: true, from, name: callerName, signal });
    });
  }, []);
  useEffect(() => {
    if (stream) {
      myVideo.current.srcObject = stream;
    }
  }, [stream]);
  const answerCall = () => {
    setCallAccepted(true);
    const peer = new Peer({ initiator: false, trickle: false, stream });
    peer.on("signal", (data) => {
      socket.emit("answercall", { signal: data, to: call.from });
    });
    peer.on("stream", (currenStream) => {
      userVideo.current.srcObject = currenStream;
    });
    peer.signal(call.signal);
    connectionRef.current = peer;
  };

  const callUser = (id) => {
    const peer = new Peer({ initiator: true, trickle: false, stream });
    peer.on("signal", (data) => {
      socket.emit("calluser", { signal: data, userToCall: id, from: me, name });
    });
    peer.on("stream", (currenStream) => {
      userVideo.current.srcObject = currenStream;
    });
    socket.on("callaccepted", (signal) => {
      setCallAccepted(true);
      peer.signal(signal);
    });
    connectionRef.current = peer;
  };

  const leaveCall = () => {
    setCallEnded(true);
    connectionRef.current.destroy();
    window.location.reload();
  };

  return (
    <SocketContext.Provider
      value={{
        callAccepted,
        call,
        myVideo,
        userVideo,
        name,
        stream,
        me,
        callEnded,
        setName,
        leaveCall,
        answerCall,
        callUser,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export { ContextProvider, SocketContext };
