import React, { useEffect, useState } from "react";
import styled from "styled-components";
import ToolTipDialog from "../ToolTipDialog";

function ToolTip() {
    const [toolTipEl, setToolTipEl] = useState();
    const [toolTipLabel, setToolTipLabel] = useState();
    const [toolTipRole, setToolTipRole] = useState();
    const [toolTipTask, setToolTipTask] = useState({});
    const handleOver = (e) => {
        const { label, element, role } = findParentToolTipLabel(e.target);
        setToolTipLabel(label);
        setToolTipRole(role);
        setToolTipEl(element);
    };
    const addTask = () => {
        const hasTask = toolTipTask[toolTipLabel];
        if (hasTask) {
            clearTimeout(hasTask.clearTimer);
        } else {
            const newTask = {
                targetElement: toolTipEl,
                role: toolTipRole,
                clearTimer: null,
            };
            setToolTipTask((prevTasks) => {
                prevTasks[toolTipLabel] = newTask;
                return { ...prevTasks };
            });
        }
    };
    const removeTask = (label) => {
        setToolTipTask((prevTasks) => {
            if (!prevTasks[label]) return { ...prevTasks };
            delete prevTasks[label];
            return { ...prevTasks };
        });
    };
    const clearTask = () => {
        setToolTipTask((prevTasks) => {
            for (let label in prevTasks) {
                const task = prevTasks[label];
                removeTask(label, task.clearTimer);
            }
            return { ...prevTasks };
        });
    };

    useEffect(() => {
        document.body.addEventListener("mouseover", handleOver);
        return () => {
            document.body.removeEventListener("mouseover", handleOver);
        };
    }, []);
    useEffect(() => {
        if (Object.keys(toolTipTask).length > 0) {
            clearTask();
        }
        if (toolTipEl) {
            addTask();
        }
    }, [toolTipEl]);

    const taskEl = (() => {
        let newTaskEl = [];
        for (let label in toolTipTask) {
            const { targetElement, role } = toolTipTask[label];
            newTaskEl.push(
                <ToolTipDialog
                    key={`toolTip-${label}`}
                    label={label}
                    role={role}
                    targetElement={targetElement}
                />
            );
        }
        return newTaskEl;
    })();

    function findParentToolTipLabel(element) {
        if (element === document.body) return false;
        const label = element.getAttribute("aria-label");
        const role = element.getAttribute("role");
        return label
            ? { label, element, role }
            : findParentToolTipLabel(element.parentElement);
    }
    return <>{taskEl}</>;
}

export default ToolTip;
