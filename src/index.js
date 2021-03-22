import React, { useState } from "react";
import ReactDOM from "react-dom";
import styled from "@emotion/styled";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import initial from "./widgetList";
import useMedia from "./use-media";
import './index.css'

const grid = 8;
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const WidgetItem = styled.div`
  width: 300px;
  height: 80px;
  border: 1px solid grey;
  border-radius: 8px
  margin-bottom: ${grid}px;
  background-color: gray;
  opacity: 0.80;
  padding: ${grid}px;
  box-shadow: 0 0 5px #eee;
`;



function Widget({ widget, index }) {
  return (
    <Draggable draggableId={widget.id} index={index}>
      {provided => (
        <WidgetItem
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          {widget.content}
        </WidgetItem>
      )}
    </Draggable>
  );
}

const WidgetList = React.memo(function WidgetList({ widgets }) {
  return widgets.map((widget, index) => (
    <Widget widget={widget} index={index} key={widget.id} />
  ));
});

const Wrapper = styled.div`
  width: 300px;
`;

function Column({ droppableId, widgets }) {
  return (
    <Droppable droppableId={droppableId}>
      {provided => (
        <Wrapper ref={provided.innerRef} {...provided.droppableProps}>
          <WidgetList widgets={widgets} />
          {provided.placeholder}
        </Wrapper>
      )}
    </Droppable>
  );
}

const Container = styled.div`
  display: ${props => (props.columnCount === 2 ? "flex" : "block")};
  justify-content: space-around;
`;

const DashboardApp = () => {
  const [state, setState] = useState({ widgets: initial });
  const columnCount = useMedia(
    ["(min-width: 1000px)", "(min-width: 600px)"],
    [2, 1],
    2
  );

  console.log(columnCount);

  function onDragEnd(result) {
    const { source, destination } = result;
    if (!destination) {
      return;
    }

    if (destination.droppableId === source.droppableId) {
      if (destination.index === source.index) {
        return;
      }

      const widgets = reorder(
        state.widgets[source.droppableId],
        source.index,
        destination.index
      );

      const updateState = {
        widgets: {
          ...state.widgets,
          [source.droppableId]: widgets
        }
      };

      setState(updateState);
    } else {
      const startColumn = [...state.widgets[source.droppableId]];
      const finishColumn = [...state.widgets[destination.droppableId]];
      const [removed] = startColumn.splice(source.index, 1);
      finishColumn.splice(destination.index, 0, removed);

      const updateState = {
        widgets: {
          ...state.widgets,
          [source.droppableId]: startColumn,
          [destination.droppableId]: finishColumn
        }
      };
      setState(updateState);
    }
  }
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Container columnCount={columnCount}>
        <Column widgets={state.widgets["column-1"]} droppableId="column-1" />
        <Column widgets={state.widgets["column-2"]} droppableId="column-2" />
        <Column widgets={state.widgets["column-3"]} droppableId="column-3" />
        <Column widgets={state.widgets["column-4"]} droppableId="column-4" />
      </Container>
    </DragDropContext>
  );
};

const rootElement = document.getElementById("root");
ReactDOM.render(<DashboardApp />, rootElement);
