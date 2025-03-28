import { Button, Input, Radio, RadioChangeEvent, Select, Tag } from "antd";
import {
  EditOutlined,
  PlusCircleOutlined,
  AudioMutedOutlined,
  AudioOutlined,
  SettingOutlined,
  UpCircleOutlined,
  DownCircleOutlined,
} from "@ant-design/icons";
import styles from "@/styles/containerThemes/home/pages/page1/page1.module.scss";
import React, { useEffect, useState } from "react";
import SearchBox from "@/components/ui/searchBox";
import {
  addNewMessage,
  chatType,
  resetNewChat,
  setChatModel,
  setChatTemperature,
  setChatType,
  setInputValue,
  setRag,
} from "@/redux/reducers/chatSlice";
import { useDispatch } from "react-redux";
import ChatBox from "@/components/ui/chatBox";
import { simpleChat } from "@/redux/asyncApi/chat";
import { AppDispatch } from "@/redux/store";

interface props {
  chat: chatType;
  setSelectedMenu: any;
}

const Page1 = ({ chat, setSelectedMenu }: props) => {
  const dispatch = useDispatch<AppDispatch>();

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const onChangeInputValue = (e: any) => {
    // console.log(e.target.value);
    dispatch(setInputValue(e.target.value));
  };

  const onChatTypeChange = (e: any) => {
    dispatch(setChatType(e.target.value));
  };

  const onChangeChatModel = (model: string) => {
    dispatch(
      setChatModel({
        value: model,
        isAvailable: true,
      })
    );
  };

  const onChangeChatTemperature = (temperature: string) => {
    dispatch(setChatTemperature(temperature));
  };

  const onChangeRag = (rag: string) => {
    dispatch(
      setRag({
        value: rag,
        isAvailable: true,
      })
    );
  };

  const onChangeSettingsOpen = () => {
    setIsSettingsOpen(!isSettingsOpen);
  };

  const onResetSettings = () => {
    dispatch(resetNewChat());
  };

  const resetInputBox = () => {
    dispatch(setInputValue(""));
  };
 
  useEffect(() => {  
    dispatch(resetNewChat());
  }, [])
  

  const onSubmit = async (file: any) => {
    setSelectedMenu({
      key: "page0",
      icon: <EditOutlined />,
      label: "New Chat",
    });
    await dispatch(
      addNewMessage({
        role: "user",
        content:
          file &&
          file.dataArr &&
          file.dataArr.length > 0 &&
          file.type === "image"
            ? [
                { type: "text", text: chat.inputValue },
                ...file.dataArr.map((f: any) => ({
                  type: "image_url",
                  image_url: { url: f },
                })),
              ]
            : file &&
              file.dataArr &&
              file.dataArr.length > 0 &&
              file.type === "file"
            ? [
                { type: "text", text: chat.inputValue },
                ...file.dataArr.map((f: any) => ({
                  type: "text",
                  text: `
                      Please analyze the following extracted content from a PDF document. 
                      Your task is to provide insights, summaries, or answers based on the information presented. 
                      Focus on key themes, important details, and any conclusions that can be drawn from the text. 
                      Avoid including any external knowledge or opinions that are not based on the provided content.#
                      \n\n
                      Here is the extracted content:\n
                      ${f}
                    `,
                })),
              ]
            : [{ type: "text", text: chat.inputValue }],
        metrics: {
          model: chat.chatModel,
          temperature: chat.chatTemperature,
        },
      })
    );
    console.log("schema string in page 0 ",file);
    if (file && file.schemaString) {
      dispatch(simpleChat({ schemaString: file.schemaString }));
    } else {
      dispatch(simpleChat({}));
    }
    // dispatch(simpleChat({}));
    resetInputBox();
  };

  return (
    <div className={styles.page1Container}>
      <React.Fragment>
        {/* initial page box */}
        <SearchBox
          isChatPage={false}
          inputValue={chat.inputValue}
          onChangeInputValue={onChangeInputValue}
          chatType={chat.chatType}
          onChatTypeChange={onChatTypeChange}
          chatModel={chat.chatModel}
          onChangeChatModel={onChangeChatModel}
          isSettingsOpen={isSettingsOpen}
          onChangeSettingsOpen={onChangeSettingsOpen}
          chatTemperature={chat.chatTemperature}
          onChangeChatTemperature={onChangeChatTemperature}
          rag={chat.rag}
          onChangeRag={onChangeRag}
          onResetSettings={onResetSettings}
          onSubmit={onSubmit}
        />
      </React.Fragment>
    </div>
  );
};

export default Page1;
