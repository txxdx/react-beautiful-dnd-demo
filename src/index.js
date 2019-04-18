import React from 'react';
import ReactDOM from 'react-dom';
import initialData from './initial-data';
import Column from './column';
import uuid from 'uuid';

import '@atlaskit/css-reset';
import{ DragDropContext } from 'react-beautiful-dnd';
import styled from 'styled-components';

const Container = styled.div`
`;

class App extends React.Component {
  state = initialData;


  onDragStart = () => {
    document.body.style.color='orange';
  }

  onDragUpdate = update => {

  }

  onDragEnd = result => {
    document.body.style.color='inherit';

    const { draggableId, source, destination } = result;

    if (!destination) {
      return;
    }

    const start = this.state.columns[source.droppableId];
    const finish = this.state.columns[destination.droppableId];

    if (start === finish) {
      const newTaskIds = Array.from(start.taskIds);
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);

      const newColumn = {
        ...start,
        taskIds: newTaskIds,
      };

      const newState = {
        ...this.state,
        columns: {
          ...this.state.columns,
          [newColumn.id]: newColumn,
        },
      };

      this.setState(newState);

      return;
    }


    //


    const startTaskIds = Array.from(start.taskIds);
    startTaskIds.splice(source.index, 1); // remove a task item
    const newStart = {
      ...start,
      taskIds: startTaskIds,
    }

    const finishTaskIds = Array.from(finish.taskIds);
    finishTaskIds.splice(destination.index, 0, draggableId); //add a task item




    const newFinish = {
      ...finish,
      taskIds: finishTaskIds,
    };

    let newState = {
      ...this.state,
      columns: {
        ...this.state.columns,
        [newStart.id]: newStart,
        [newFinish.id]: newFinish,
      },
    };

    //newFinish id 开始 往后调整
    const columnOrder = Array.from(newState.columnOrder);
    const idx = columnOrder.indexOf(newFinish.id);

    for (let i = idx; i < columnOrder.length; i++) {
      const column = newState.columns[columnOrder[i]];
      //拿分数
      let scores = 0;
      column.taskIds.forEach(taskId => {
        scores += newState.tasks[taskId].score;
      })

      if (scores <= 3) {
        break;
      } else {
        const lastTask = column.taskIds.pop();
        const lastTaskScore = newState.tasks[lastTask].score;
        const reminderScore = scores - lastTaskScore;
        if (i < columnOrder.length - 1) {

          if (reminderScore <= 3) {
            newState.columns[columnOrder[i+1]].taskIds.splice(0,0, lastTask); //处理最后一个
          } else { //5
            newState.columns[columnOrder[i+1]].taskIds.splice(0,0, lastTask); //处理最后一个
            // 处理最后第二个
            const lastSecondTask = column.taskIds.pop();
            newState.columns[columnOrder[i+1]].taskIds.splice(0,0, lastSecondTask);
          }
        } else {

          //最后一个，新增一个
          const newColumnId = 'newColumnId' + uuid.v4();
          const taskIds = [lastTask];
          if (reminderScore >= 4) {
            const lastSecondTask = column.taskIds.pop();
            taskIds.push(lastSecondTask)
          }
          const newColumn = {
            'id': newColumnId,
            'title': newColumnId,
            'taskIds': taskIds
          };
          newState = {
            ...newState,
            columns: {
              ...newState.columns,
              [newColumnId]: newColumn
            },
            columnOrder: [...newState.columnOrder, newColumnId]
          };

          //新增的大于3

        }
      }
    }

    // 删除最后是空的
    for (let i = newState.columnOrder.length-1; i >= 0; i --) {
      const columnId = newState.columnOrder[i];
      let column = newState.columns[columnId];
      if (column.taskIds.length === 0) {
        newState.columnOrder.pop();
        newState.columns[columnId] = null;
      } else {
        break;
      }
    }


    this.setState(newState);
  };

  // scoresFromRow = (row) => {
  //   let score = 0;
  //   row.taskIds.forEach(taskId => {

  //   });
  // }

  render () {
    return (
      <DragDropContext
        onDragEnd={this.onDragEnd}
        onDragStart={this.onDragStart}
        onDragUpdate={this.onDragStart}
      >
        <Container>
          {this.state.columnOrder.map(columnId => {
            const column = this.state.columns[columnId];
            const tasks = column.taskIds.map(taskId => this.state.tasks[taskId]);

            return <Column key={column.id} column={column} tasks={tasks} />;
          })}
        </Container>
      </DragDropContext>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));


