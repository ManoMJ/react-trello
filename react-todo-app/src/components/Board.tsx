import { Droppable } from "react-beautiful-dnd";
import DragabbleCard from "./DragabbleCard";
import styled from "styled-components";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import { ITodo, toDoState } from "../atoms";
import { useSetRecoilState } from "recoil";
const Wrapper = styled.div`
  padding-top: 10px;
  width: 200px;
  background-color: ${(props) => props.theme.boardColor};
  border-radius: 5px;
  min-height: 200px;
  display: flex;
  flex-direction: column;
`;

const Area = styled.div<IAreaProps>`
    background-color: ${(props) => (props.isDraggingOver ? "#dfe6e9" : props.isDraggingFromThis ? "#b2bec3" : "transparent")};
    transition: .3s ease-in-out;
    flex-grow: 1;
    padding: 20px;
`;

const Form= styled.form`
    width: 100%;
    input {
        width: 100%;
    }
`;

interface IAreaProps {
    isDraggingFromThis: boolean;
    isDraggingOver : boolean;
}


interface IBoardProps {
    toDos: ITodo[];
    boardId: string;
}

interface IForm {
    toDo: string;
}

function Board({toDos, boardId}:IBoardProps) {
    const setToDos = useSetRecoilState(toDoState);
    const {register, setValue, handleSubmit} = useForm<IForm>();
    const onValid = ({toDo}:IForm) => {
        const newToDo = {
            id: Date.now(),
            text: toDo
        };
        setToDos(allBoards => {
            return {
                ...allBoards,
                [boardId]: [
                    ...allBoards[boardId],
                    newToDo
                ]
            }
        });
        setValue("toDo", "");
    }
    return (
    <Wrapper>
        <h1>{boardId}</h1>
        <Form onSubmit={handleSubmit(onValid)}>
            <input {...register("toDo", {required: true}) }
                type="text" placeholder={`Add task on ${boardId}`} />
        </Form>
        <Droppable droppableId={boardId}>
        {(magic, info) => (
            <Area ref={magic.innerRef} {...magic.droppableProps}
            isDraggingOver={info.isDraggingOver}
            isDraggingFromThis={Boolean(info.draggingFromThisWith)}>
            {toDos.map((toDo, index) => (
                <DragabbleCard key={toDo.id} index={index} toDoId={toDo.id} toDoText={toDo.text} />
            ))}
            {magic.placeholder}
            </Area>
        )}
    </Droppable>
    </Wrapper>
    )
}

export default Board;