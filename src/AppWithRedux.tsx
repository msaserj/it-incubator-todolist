import React, {useCallback, useEffect} from 'react';
import './App.css';
import {Todolist} from "./components/Todolist";
import {AddItemForm} from "./components/AddItemForm";
import {AppBar, Button, Container, Grid, IconButton, Paper, Typography} from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import {
    addTodolistTC,
    changeTodolistFilterAC,
    fetchTodolistsTC, FilterValueType,
    removeTodolistTC, TodolistDomainType,
} from "./state/todolist-reducer";
import {
    addTaskTC,
    changeTodolistTitleTC,
    removeTaskTC, updateTaskTC
} from "./state/task-reducer";
import {TaskStatuses, TaskType} from "./api/todolists-api";
import {useAppDispatch, useAppSelector} from "./state/hooks";




export type TasksStateType = {
    [key: string]: Array<TaskType>
}


function AppWithRedux() {
    console.log("App is called")
    //
    const dispatch = useAppDispatch();
    // выбираем из redux при помощи useSelect таски и тудулисты
    // это вместо локального стейта useState
    const todolists = useAppSelector<Array<TodolistDomainType>>(state => state.todolists)
    const tasks = useAppSelector<TasksStateType>(state => state.tasks)

    const removeTask = useCallback((todolistID: string, id: string) => {
        dispatch(removeTaskTC(todolistID, id))
    },[dispatch])

    const addTask = useCallback((todolistID: string, title: string) => {
        dispatch(addTaskTC(todolistID, title))
    },[dispatch])

    const changeTaskStatus = useCallback((todolistID: string, taskId: string, status: TaskStatuses) => {
        dispatch(updateTaskTC(todolistID, taskId, {status}))

    },[dispatch])
    const changeTaskTitle = useCallback((todolistID: string, id: string, title: string) => {
        dispatch(updateTaskTC(todolistID, id, {title}))
    },[dispatch])

    const changeFilter = useCallback((todolistID: string, value: FilterValueType) => {
        dispatch(changeTodolistFilterAC(todolistID, value))
    },[dispatch])

    const removeTodolist = useCallback((todolistId: string) => {
        dispatch(removeTodolistTC(todolistId))

    },[dispatch])
    const changeTodolistTitle = useCallback((todolistId: string, title: string) => {
        dispatch(changeTodolistTitleTC(todolistId, title))
    }, [dispatch])

    const addTodoList = useCallback((title: string) => {
        dispatch(addTodolistTC(title))
    },[dispatch])



    useEffect(()=> {
        dispatch(fetchTodolistsTC())
    }, [])

    return (
        <div className="App">
            <AppBar position="static">
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{mr: 2}}>
                        <MenuIcon/>
                    </IconButton>
                    <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
                        News
                    </Typography>
                    <Button color="inherit">Login</Button>
                </Toolbar>
            </AppBar>
            <Container fixed>
                {/*universal component*/}
                <Grid style={{padding: "20px"}} container>
                    <AddItemForm addItem={addTodoList}/>
                </Grid>
                <Grid container spacing={3}>
                    {todolists.map(tdl => {
                        let tasksForTodoList = tasks[tdl.id] // храним отфильтрованные таски. по умолчанию all

                        return (
                            <Grid item xs={12} md={6} xl={4}>
                                <Paper style={{padding: "10px"}} elevation={3}>
                                    <Todolist
                                        key={tdl.id}
                                        id={tdl.id}
                                        title={tdl.title}
                                        tasks={tasksForTodoList}
                                        removeTask={removeTask}
                                        changeFilter={changeFilter}
                                        addTask={addTask}
                                        changeTaskStatus={changeTaskStatus}
                                        filter={tdl.filter}
                                        todolistID={tdl.id}
                                        removeTodolist={removeTodolist}
                                        changeTaskTitle={changeTaskTitle}
                                        changeTodolistTitle={changeTodolistTitle}/>
                                </Paper>
                            </Grid>
                        )
                    })}
                </Grid>
            </Container>
        </div>
    );
}

export default AppWithRedux;
