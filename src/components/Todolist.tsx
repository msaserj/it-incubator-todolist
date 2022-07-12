import React, {useCallback, useEffect} from 'react';
import {AddItemForm} from "./AddItemForm";
import {EditableSpan} from "./EditableSpan";
import {Button} from '@mui/material';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import {Task} from "./Task";
import {TaskStatuses, TaskType} from "../api/todolists-api";
import {FilterValueType} from "../state/todolist-reducer";
import {useAppDispatch} from "../state/hooks";
import {fetchTasksTC} from "../state/task-reducer";


type PropsType = {
    todolistID: string
    id: string
    title: string
    tasks: Array<TaskType>
    changeFilter: (todolistID: string, value: FilterValueType) => void
    addTask: (title: string, todolistID: string) => void
    changeTaskStatus: (id: string, status: TaskStatuses, todolistID: string) => void
    changeTaskTitle: (id: string, newTitle: string, todolistID: string) => void
    removeTask: (todolistID: string, taskId: string) => void
    changeTodolistTitle: (id: string, newTitle: string) => void
    filter: FilterValueType
    removeTodolist: (id: string) => void

}

export const Todolist = React.memo((props: PropsType) => {
    const dispatch = useAppDispatch();

    console.log("Todolist is called")
    // всё переехало в отдельную универсальную компоненту
    const addTask = useCallback((title: string) => {
        props.addTask(title, props.id)
    },[props.title, props.id])
    const removeTodolistHandler = () => {
        props.removeTodolist(props.id)
    }
    const changeTodolistTitle = useCallback((newTitle: string,) => {
        props.changeTodolistTitle(props.id, newTitle)
    }, [props.id, props.changeTodolistTitle])

    const onAllClickHandler = useCallback(() => props.changeFilter(props.todolistID, "all"),[props.changeFilter, props.id]);
    const onActiveClickHandler = useCallback(() => props.changeFilter(props.todolistID, "active"), [props.changeFilter, props.id]);
    const onCompletedClickHandler = useCallback(() => props.changeFilter(props.todolistID, "completed"), [props.changeFilter, props.id]);

    let tasksForTodoList = props.tasks
    if (props.filter === "active") {
        tasksForTodoList = props.tasks.filter(task => task.status === TaskStatuses.New)
    }
    if (props.filter === "completed") {
        tasksForTodoList = props.tasks.filter(task => task.status === TaskStatuses.Completed)
    }

    useEffect(()=> {
        dispatch(fetchTasksTC(props.id))
    }, [])

    return (
        <div>
            {/*<button onClick={removeTodolistHandler}>✖</button>*/}
            <EditableSpan title={props.title} onChange={changeTodolistTitle}/>
            <IconButton onClick={removeTodolistHandler}>
                <DeleteIcon/>
            </IconButton>
            {/*universal component*/}
            <AddItemForm addItem={addTask}/>
            <ul>
                {
                    tasksForTodoList.map((task) => {
                    return <Task changeTaskStatus={props.changeTaskStatus}
                                 changeTaskTitle={props.changeTaskTitle}
                                 removeTask={props.removeTask}
                                 task={task}
                                 todolistId={props.todolistID}
                                 key={task.id}
                    />
                    })
                }
            </ul>
            <div>
                <Button size="large" variant={props.filter === "all" ? "outlined" : "text"} onClick={onAllClickHandler}>All
                </Button>
                <Button color={"warning"} size="large" variant={props.filter === "active" ? "outlined" : "text"}
                        onClick={onActiveClickHandler}>Active
                </Button>
                <Button color={"success"} size="large" variant={props.filter === "completed" ? "outlined" : "text"}
                        onClick={onCompletedClickHandler}>Completed
                </Button>
            </div>
        </div>
    )
})


