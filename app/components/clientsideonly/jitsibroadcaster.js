import dynamic from "next/dynamic";
import React, { useEffect, useRef, useState } from "react";
import {
  Button,
  ButtonGroup,
  Dropdown,
  DropdownButton,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import { BiMicrophone, BiMicrophoneOff } from "react-icons/bi";
import { RiMic2Line } from "react-icons/ri";
import { MdCameraswitch, MdHeadset } from "react-icons/md";
import { AiFillEye, AiFillSetting } from "react-icons/ai";
import { BiUserPin } from "react-icons/bi";
import { HiViewGridAdd } from "react-icons/hi";
import styles from "../../styles/Jitsi.module.css";
import { FaRocketchat } from "react-icons/fa";
import { FiUsers } from "react-icons/fi";
import { GreenRoomTool, SpeakerMiscToolbar } from "../conferences/dayOfEvent/greenroom/SpeakerToolbar";

const JitsiMeeting = dynamic(
  () => import("@jitsi/react-sdk").then((mod) => mod.JitsiMeeting),
  { ssr: false }
);

const rtmp = process.env.NEXT_PUBLIC_ROCKET_CHAT_GREENROOM_RTMP;

const Jitsibroadcaster = ({ room, disName, rtmpSrc, handleChat, isAdmin }) => {
  const apiRef = useRef();
  const [logItems, updateLog] = useState([]);
  const [knockingParticipants, updateKnockingParticipants] = useState([]);
  const [speakers, setSpeakers] = useState(null);

  const printEventOutput = (payload) => {
    updateLog((items) => [...items, JSON.stringify(payload)]);
  };

  const handleAudioStatusChange = (payload, feature) => {
    if (payload.muted) {
      updateLog((items) => [...items, `${feature} off`]);
    } else {
      updateLog((items) => [...items, `${feature} on`]);
    }
  };

  const handleChatUpdates = (payload, ref) => {
    if (payload.isOpen || !payload.unreadCount) {
      return;
    }
    ref.current.executeCommand("toggleChat");
    updateLog((items) => [
      ...items,
      `you have ${payload.unreadCount} unread messages`,
    ]);
  };

  const handleKnockingParticipant = (payload) => {
    updateLog((items) => [...items, JSON.stringify(payload)]);
    updateKnockingParticipants((participants) => [
      ...participants,
      payload?.participant,
    ]);
  };

  const resolveKnockingParticipants = (ref, condition) => {
    knockingParticipants.forEach((participant) => {
      ref.current.executeCommand(
        "answerKnockingParticipant",
        participant?.id,
        condition(participant)
      );
      updateKnockingParticipants((participants) =>
        participants.filter((item) => item.id === participant.id)
      );
    });
  };

  const handleJitsiIFrameRef1 = (iframeRef) => {
    iframeRef.style.height = "inherit";
    iframeRef.style.width = "90%";
    iframeRef.allow = "display-capture"
  };

  const showDevices = async (ref) => {
    const videoInputs = [];
    // get all available video input
    const devices = await ref.current.getAvailableDevices();

    for (const [key, value] of Object.entries(devices)) {
      if (key == "videoInput") {
        value.forEach((vid) => {
          videoInputs.push(vid.label);
        });
      }
    }
    // log for debug
    updateLog((items) => [...items, JSON.stringify(videoInputs)]);

    let nextDevice = "";
    let devs = await ref.current.getCurrentDevices();

    for (const [key, value] of Object.entries(devs)) {
      if (key == "videoInput") {
        updateLog((items) => [...items, "found " + JSON.stringify(value)]);
        let devLabel = value.label;
        let idx = 0;
        videoInputs.forEach((vid) => {
          if (devLabel == vid) {
            let cur = idx + 1;
            if (cur >= videoInputs.length) {
              nextDevice = videoInputs[0];
            } else {
              nextDevice = videoInputs[cur];
              updateLog((items) => [...items, "next is " + nextDevice]);
            }
          }
          idx++;
        });
      }
    }
    updateLog((items) => [...items, "switching to " + nextDevice]);

    await ref.current.setVideoInputDevice(nextDevice);
  };

  const showAudioOutDevices = async (ref) => {
    const audioOutputs = [];
    // get all available audio output
    const devices = await ref.current.getAvailableDevices();

    for (const [key, value] of Object.entries(devices)) {
      if (key == "audioOutput") {
        value.forEach((vid) => {
          audioOutputs.push(vid.label);
        });
      }
    }
    // log for debug
    updateLog((items) => [...items, JSON.stringify(audioOutputs)]);

    let nextDevice = "";
    let devs = await ref.current.getCurrentDevices();

    for (const [key, value] of Object.entries(devs)) {
      if (key == "audioOutput") {
        updateLog((items) => [...items, "found " + JSON.stringify(value)]);
        let devLabel = value.label;
        let idx = 0;
        audioOutputs.forEach((vid) => {
          if (devLabel == vid) {
            let cur = idx + 1;
            if (cur >= audioOutputs.length) {
              nextDevice = audioOutputs[0];
            } else {
              nextDevice = audioOutputs[cur];
              updateLog((items) => [...items, "next is " + nextDevice]);
            }
          }
          idx++;
        });
      }
    }
    updateLog((items) => [...items, "switching to " + nextDevice]);

    await ref.current.setAudioOutputDevice(nextDevice);
  };

  const showAudioDevice = async (ref) => {
    const audioInputs = [];
    // get all available audio input
    const devices = await ref.current.getAvailableDevices();

    for (const [key, value] of Object.entries(devices)) {
      if (key == "audioInput") {
        value.forEach((vid) => {
          audioInputs.push(vid.label);
        });
      }
    }
    // log for debug
    updateLog((items) => [...items, JSON.stringify(audioInputs)]);

    let nextDevice = "";
    let devs = await ref.current.getCurrentDevices();

    for (const [key, value] of Object.entries(devs)) {
      if (key == "audioInput") {
        updateLog((items) => [...items, "found " + JSON.stringify(value)]);
        let devLabel = value.label;
        let idx = 0;
        audioInputs.forEach((vid) => {
          if (devLabel == vid) {
            let cur = idx + 1;
            if (cur >= audioInputs.length) {
              nextDevice = audioInputs[0];
            } else {
              nextDevice = audioInputs[cur];
              updateLog((items) => [...items, "next is " + nextDevice]);
            }
          }
          idx++;
        });
      }
    }
    updateLog((items) => [...items, "switching to " + nextDevice]);
    await ref.current.setAudioInputDevice(nextDevice);
  };

  const handleApiReady = async (apiObj, ref) => {
    ref.current = apiObj;
    await ref.current.addEventListeners({
      // Listening to events from the external API
      audioMuteStatusChanged: (payload) =>
        handleAudioStatusChange(payload, "audio"),
      videoMuteStatusChanged: (payload) =>
        handleAudioStatusChange(payload, "video"),
      raiseHandUpdated: printEventOutput,
      tileViewChanged: printEventOutput,
      chatUpdated: (payload) => handleChatUpdates(payload, ref),
      knockingParticipant: handleKnockingParticipant,
    });

    await ref.current.executeCommand("toggleFilmStrip");
  };

  // Multiple instances demo
  const showUsers = async (ref, which) => {
    try {
      const pinfo = await ref.current.getParticipantsInfo();
      updateLog((items) => [
        ...items,
        "participantes " + JSON.stringify(pinfo),
      ]);
      await ref.current.executeCommand("setTileView", false);
      await ref.current.setLargeVideoParticipant(pinfo[which].participantId);
    } catch (e) {
      console.error("Participant not found!");
      return;
    }
  };

  const makeTile = (ref) => {
    ref.current.executeCommand("setTileView", true);
  };

  const renderStream = (key) => (
    <div className={styles.streamButton}>
      <ButtonGroup className="m-auto">
        <Button
          variant="warning"
          title="Click to start streaming"
          onClick={() =>
            apiRef.current.executeCommand("startRecording", {
              mode: "stream",
              rtmpStreamKey: key,
              youtubeStreamKey: "",
            })
          }
        >
          Go live!
        </Button>
      </ButtonGroup>
    </div>
  );

  const renderSpinner = () => (
    <div
      style={{
        fontFamily: "sans-serif",
        textAlign: "center",
      }}
    >
      Loading..
    </div>
  );

  return (
    <>
      {/* {rtmp ? renderStream(rtmp) : rtmpSrc && renderStream(rtmpSrc)} */}
      <div className={styles.jitsiContainer}>
        {/* {toggleDevice()} */}

        <JitsiMeeting
          domain="meet.jit.si"
          roomName={room}
          spinner={renderSpinner}
          onApiReady={(externalApi) => handleApiReady(externalApi, apiRef)}
          getIFrameRef={handleJitsiIFrameRef1}
          configOverwrite={{
            startWithAudioMuted: false,
            disableModeratorIndicator: true,
            startScreenSharing: false,
            enableEmailInStats: false,
            toolbarButtons: ["select-background", "hangup"],
            enableWelcomePage: true,
            enableNoAudioDetection: true,
            hideConferenceSubject: true,
            hideConferenceTimer: true,
            prejoinPageEnabled: true,
            startWithVideoMuted: false,
            liveStreamingEnabled: true,
            disableSelfView: true,
            disableSelfViewSettings: true,
            disableShortcuts: true,
            disable1On1Mode: false,
            defaultRemoteDisplayName: "Fellow Rocketeer",
            subject: " ",
            p2p: {
              enabled: false,
            },
            remoteVideoMenu: {
              disableKick : !isAdmin,
              disableGrantModerator : !isAdmin
            },
            disableRemoteMute: !isAdmin
          }}
          interfaceConfigOverwrite={{
            DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
            FILM_STRIP_MAX_HEIGHT: 0,
            TILE_VIEW_MAX_COLUMNS: 2,
            VIDEO_QUALITY_LABEL_DISABLED: true,
            RECENT_LIST_ENABLED: false
          }}
          userInfo={{
            displayName: disName,
          }}
        />
        {apiRef.current && <GreenRoomTool apiRef={apiRef} />}
      </div>
      
      <div className={styles.dayofeventleft_button}>
      
        <SpeakerMiscToolbar apiRef={apiRef} isAdmin={isAdmin} />
      </div>
    </>
  );
};

export default Jitsibroadcaster;
