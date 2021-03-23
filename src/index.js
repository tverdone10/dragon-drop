import React, { useState } from "react";
import ReactDOM from "react-dom";
import styled from "@emotion/styled";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import initial from "./widgetList";
import useMedia from "./use-media";
import App from './App.js'
import './index.css'



const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
